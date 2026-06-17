// backend/controllers/authController.js
// ENHANCED with tenant assignment checking on login

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * REGISTER a new user
 * - If user was pre-created by landlord, update their info
 * - Otherwise, create new user account
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (user && user.tenantStatus !== "pending") {
      // User exists and is not a pending tenant assignment
      return res.status(400).json({ message: "User already exists" });
    }

    if (user && user.tenantStatus === "pending") {
      // User was pre-created by landlord - update their info
      user.name = name;
      user.password = password; // Will be hashed by pre-save hook
      user.phone = phone;
      user.tenantStatus = "active"; // Activate the tenant assignment
      await user.save();

      // Get assignment details
      await user.populate([
        { path: "assignedProperty", select: "title address city" },
        { path: "assignedUnit", select: "unitNumber unitType rentAmount" },
        { path: "assignedBy", select: "name email" }
      ]);

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Account activated successfully! You have a property assignment.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          hasAssignment: user.assignedAsTenant,
          assignment: user.assignedAsTenant ? {
            property: user.assignedProperty,
            unit: user.assignedUnit,
            assignedBy: user.assignedBy,
            assignedAt: user.assignedAt
          } : null
        },
      });
    }

    // New user registration
    const allowedRoles = ["client", "host", "tenant", "landlord", "service_provider"];
    const assignedRole = allowedRoles.includes(role) ? role : "client";

    user = await User.create({ 
      name, 
      email: email.toLowerCase().trim(), 
      password, // Will be hashed by pre-save hook
      phone,
      role: assignedRole 
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasAssignment: false
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * LOGIN user
 * - Returns user info + tenant assignment if exists
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .populate("assignedProperty", "title address city images")
      .populate("assignedUnit", "unitNumber unitType bedrooms bathrooms rentAmount")
      .populate("assignedBy", "name email phone");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Prepare response
    const response = {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        
        // 🆕 TENANT ASSIGNMENT INFO
        hasAssignment: user.assignedAsTenant || false,
        tenantStatus: user.tenantStatus || "none"
      },
    };

    // Add assignment details if exists
    if (user.assignedAsTenant) {
      response.user.assignment = {
        property: user.assignedProperty,
        unit: user.assignedUnit,
        assignedBy: user.assignedBy,
        assignedAt: user.assignedAt,
        status: user.tenantStatus
      };

      // Add special message for first-time login with assignment
      if (user.tenantStatus === "pending") {
        response.message = "Welcome! You have been assigned a property by your landlord.";
        
        // Update status to active since they've logged in
        user.tenantStatus = "active";
        await user.save();
      }
    }

    res.json(response);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};