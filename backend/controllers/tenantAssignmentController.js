// backend/controllers/tenantAssignmentController.js
// NEW CONTROLLER for landlords to assign clients as tenants

const User = require("../models/User");
const Unit = require("../models/Unit");
const Property = require("../models/Property");
const Tenant = require("../models/Tenant");

/**
 * Helper function to send notification
 */
const sendNotification = (req, userId, notification) => {
  try {
    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");
    
    if (io && userSockets) {
      const socketId = userSockets.get(userId.toString());
      if (socketId) {
        io.to(socketId).emit("notification", notification);
        console.log(`📨 Notification sent to user ${userId}`);
      }
    }
  } catch (error) {
    console.error("Notification error:", error);
  }
};

/**
 * ASSIGN CLIENT AS TENANT (Landlord/Host adds client by email)
 * - Landlord provides: clientEmail, propertyId, unitId
 * - System creates/updates User with tenant assignment
 * - Client sees assignment when they login
 */
exports.assignClientAsTenant = async (req, res) => {
  try {
    const { clientEmail, propertyId, unitId, rentAmount, leaseStart, leaseEnd } = req.body;

    // ─────────────────────────────────────────────────────────────
    // 1. VALIDATE INPUTS
    // ─────────────────────────────────────────────────────────────
    if (!clientEmail) {
      return res.status(400).json({ message: "Client email is required" });
    }

    if (!propertyId || !unitId) {
      return res.status(400).json({ message: "Property and unit are required" });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. VERIFY LANDLORD OWNS THE PROPERTY
    // ─────────────────────────────────────────────────────────────
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "You don't own this property" 
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. VERIFY UNIT EXISTS AND IS AVAILABLE
    // ─────────────────────────────────────────────────────────────
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    if (unit.property.toString() !== propertyId) {
      return res.status(400).json({ 
        message: "This unit doesn't belong to the selected property" 
      });
    }

    if (unit.isOccupied) {
      return res.status(400).json({ 
        message: "This unit is already occupied" 
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. FIND OR CREATE CLIENT USER
    // ─────────────────────────────────────────────────────────────
    let client = await User.findOne({ email: clientEmail.toLowerCase().trim() });

    if (!client) {
      // Client doesn't exist yet - create a pending user account
      // They'll complete signup later with a password
      client = await User.create({
        email: clientEmail.toLowerCase().trim(),
        name: clientEmail.split('@')[0], // Temporary name
        password: Math.random().toString(36).slice(-8) + "TEMP123!", // Temporary password
        role: "client",
        assignedAsTenant: true,
        assignedProperty: propertyId,
        assignedUnit: unitId,
        assignedBy: req.user._id,
        assignedAt: new Date(),
        tenantStatus: "pending", // Waiting for client to accept/login
      });

      console.log(`✅ Created new user account for ${clientEmail}`);
    } else {
      // Client exists - update their tenant assignment
      client.assignedAsTenant = true;
      client.assignedProperty = propertyId;
      client.assignedUnit = unitId;
      client.assignedBy = req.user._id;
      client.assignedAt = new Date();
      client.tenantStatus = "active";
      await client.save();

      console.log(`✅ Updated existing user ${clientEmail} with tenant assignment`);

      // Send notification to existing client
      sendNotification(req, client._id, {
        type: "info",
        title: "You've Been Assigned a Unit",
        message: `${req.user.name} has assigned you to ${property.title} - Unit ${unit.unitNumber}`,
        timestamp: new Date()
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. CREATE TENANT RECORD
    // ─────────────────────────────────────────────────────────────
    const tenant = await Tenant.create({
      name: client.name,
      email: client.email,
      phone: client.phone || "N/A",
      property: propertyId,
      unit: unitId,
      leaseStart: leaseStart || new Date(),
      leaseEnd: leaseEnd,
      rentAmount: rentAmount || unit.rentAmount,
      status: "active"
    });

    // ─────────────────────────────────────────────────────────────
    // 6. UPDATE UNIT STATUS
    // ─────────────────────────────────────────────────────────────
    unit.tenant = tenant._id;
    unit.isOccupied = true;
    await unit.save();

    // ─────────────────────────────────────────────────────────────
    // 7. SEND EMAIL (TODO - implement email service)
    // ─────────────────────────────────────────────────────────────
    // TODO: Send email to client with login instructions
    // For now, just log it
    console.log(`📧 Email should be sent to ${clientEmail} with login instructions`);

    // ─────────────────────────────────────────────────────────────
    // 8. RETURN SUCCESS
    // ─────────────────────────────────────────────────────────────
    const populatedTenant = await Tenant.findById(tenant._id)
      .populate("property", "title address city")
      .populate("unit", "unitNumber unitType rentAmount");

    res.status(201).json({
      success: true,
      message: client.tenantStatus === "pending" 
        ? "Client account created and assigned. They'll receive login instructions via email."
        : "Existing client assigned successfully!",
      tenant: populatedTenant,
      clientCreated: client.tenantStatus === "pending",
      loginInstructions: client.tenantStatus === "pending" 
        ? "The client should signup/login with their email to see their assignment"
        : null
    });

  } catch (error) {
    console.error("ASSIGN CLIENT AS TENANT ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to assign client as tenant" 
    });
  }
};

/**
 * GET MY TENANT ASSIGNMENT (Client checks their assignment)
 * - Returns property/unit details if client has been assigned by a landlord
 */
exports.getMyTenantAssignment = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("assignedProperty", "title address city images")
      .populate("assignedUnit", "unitNumber unitType bedrooms bathrooms rentAmount")
      .populate("assignedBy", "name email phone");

    if (!user.assignedAsTenant) {
      return res.status(200).json({
        success: true,
        hasAssignment: false,
        message: "You don't have any property assignment"
      });
    }

    res.status(200).json({
      success: true,
      hasAssignment: true,
      assignment: {
        property: user.assignedProperty,
        unit: user.assignedUnit,
        assignedBy: user.assignedBy,
        assignedAt: user.assignedAt,
        status: user.tenantStatus
      }
    });
  } catch (error) {
    console.error("GET TENANT ASSIGNMENT ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * REMOVE TENANT ASSIGNMENT
 * - Landlord removes client from unit
 * - Marks unit as vacant
 */
exports.removeTenantAssignment = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId).populate("property");
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Verify ownership
    if (tenant.property.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Not authorized to remove this tenant" 
      });
    }

    // Update client user
    const client = await User.findOne({ email: tenant.email });
    if (client) {
      client.assignedAsTenant = false;
      client.assignedProperty = null;
      client.assignedUnit = null;
      client.tenantStatus = "none";
      await client.save();

      // Notify client
      sendNotification(req, client._id, {
        type: "warning",
        title: "Tenancy Ended",
        message: `Your assignment to ${tenant.property.title} has been ended`,
        timestamp: new Date()
      });
    }

    // Update unit
    const unit = await Unit.findById(tenant.unit);
    if (unit) {
      unit.tenant = null;
      unit.isOccupied = false;
      await unit.save();
    }

    // Mark tenant as inactive
    tenant.status = "inactive";
    tenant.leaseEnd = new Date();
    await tenant.save();

    res.status(200).json({
      success: true,
      message: "Tenant removed successfully"
    });
  } catch (error) {
    console.error("REMOVE TENANT ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * GET MY TENANTS (Landlord's tenants)
 */
exports.getMyTenants = async (req, res) => {
  try {
    // Get all properties owned by landlord
    const properties = await Property.find({ host: req.user._id });
    const propertyIds = properties.map(p => p._id);

    // Get all tenants for these properties
    const tenants = await Tenant.find({ 
      property: { $in: propertyIds },
      status: "active"
    })
      .populate("property", "title address")
      .populate("unit", "unitNumber unitType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tenants.length,
      tenants
    });
  } catch (error) {
    console.error("GET MY TENANTS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
