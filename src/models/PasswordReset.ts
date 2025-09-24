import mongoose from "mongoose";

interface IPasswordReset extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index for automatic cleanup
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Compound index for efficient queries
passwordResetSchema.index({ email: 1, isUsed: 1, expiresAt: 1 });

// Clean up used tokens after 24 hours
passwordResetSchema.index(
  { updatedAt: 1 },
  { 
    expireAfterSeconds: 24 * 60 * 60, // 24 hours
    partialFilterExpression: { isUsed: true }
  }
);

const PasswordReset = mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default PasswordReset;
export type { IPasswordReset };