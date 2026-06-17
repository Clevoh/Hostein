// backend/models/User.js
// ENHANCED with tenant assignment tracking
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true 
    },
    phone: {
      type: String,
      default: null
    },
    role: { 
      type: String, 
      enum: ["landlord", "tenant", "client", "host", "service_provider", "admin"], 
      default: "client" 
    },
    
    // 🆕 TENANT ASSIGNMENT FIELDS
    // When landlord adds a client as tenant, these fields are populated
    assignedAsTenant: {
      type: Boolean,
      default: false
    },
    assignedProperty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null
    },
    assignedUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The landlord who assigned them
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },
    tenantStatus: {
      type: String,
      enum: ["none", "pending", "active", "inactive"],
      default: "none"
    },
    
    // Profile fields
    avatar: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user has tenant assignment
userSchema.methods.hasTenantAssignment = function () {
  return this.assignedAsTenant && this.assignedProperty && this.assignedUnit;
};

// Method to get tenant assignment details
userSchema.methods.getTenantAssignment = async function () {
  if (!this.hasTenantAssignment()) {
    return null;
  }

  await this.populate([
    { path: "assignedProperty", select: "title address city images" },
    { path: "assignedUnit", select: "unitNumber unitType rentAmount" },
    { path: "assignedBy", select: "name email" }
  ]);

  return {
    property: this.assignedProperty,
    unit: this.assignedUnit,
    assignedBy: this.assignedBy,
    assignedAt: this.assignedAt,
    status: this.tenantStatus
  };
};

module.exports = mongoose.model("User", userSchema);