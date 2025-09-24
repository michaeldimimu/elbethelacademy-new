import mongoose from "mongoose";
import crypto from "crypto";
import { UserRole } from "../types/roles.js";

// Invitation interface for TypeScript
export interface IInvitation extends mongoose.Document {
  email: string;
  role: UserRole;
  token: string;
  invitedBy: mongoose.Types.ObjectId;
  invitedByDetails: {
    name: string;
    email: string;
    role: UserRole;
  };
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isExpired(): boolean;
  generateToken(): string;
}

// Invitation schema
const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "Role is required"],
    },
    token: {
      type: String,
      unique: true,
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invited by user is required"],
    },
    invitedByDetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index - automatically delete expired documents
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate invitations for the same email and role
invitationSchema.index(
  { email: 1, role: 1, isUsed: 1 },
  {
    unique: true,
    partialFilterExpression: { isUsed: false },
  }
);

// Generate secure random token before saving
invitationSchema.pre("save", function (next) {
  // Always generate token if it doesn't exist
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Mark as used when accepting invitation
invitationSchema.pre("save", function (next) {
  if (this.isModified("isUsed") && this.isUsed && !this.usedAt) {
    this.usedAt = new Date();
  }
  next();
});

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

// Method to generate secure token
invitationSchema.methods.generateToken = function (): string {
  return crypto.randomBytes(32).toString("hex");
};

// Static method to find valid invitation by token
invitationSchema.statics.findValidByToken = function (token: string) {
  return this.findOne({
    token,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).populate("invitedBy", "name email role");
};

// Static method to find pending invitations for an email
invitationSchema.statics.findPendingByEmail = function (email: string) {
  return this.find({
    email: email.toLowerCase(),
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).populate("invitedBy", "name email role");
};

// Static method to cleanup expired invitations (manual cleanup if needed)
invitationSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      {
        isUsed: true,
        usedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }, // Remove used invitations older than 30 days
    ],
  });
};

// Remove sensitive data from JSON output
invitationSchema.methods.toJSON = function () {
  const invitationObject = this.toObject();
  // Keep token for acceptance, but it should only be shared via secure link
  return invitationObject;
};

// Create and export the model
const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema);

export default Invitation;
