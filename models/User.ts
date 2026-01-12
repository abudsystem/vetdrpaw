import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "cliente" | "veterinario" | "administrador";
  telefono?: string;
  direccion?: string;

  // Guest user fields
  isGuest?: boolean;
  activationToken?: string;
  activationExpires?: Date;
  activatedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;

  // Password reset fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: true }, // Select true by default, handle exclusion in service/repo
    role: {
      type: String,
      enum: ["cliente", "veterinario", "administrador"],
      default: "cliente",
    },
    telefono: { type: String, required: false },
    direccion: { type: String, required: false },

    // Guest user fields
    isGuest: { type: Boolean, default: false },
    activationToken: { type: String, required: false },
    activationExpires: { type: Date, required: false },
    activatedAt: { type: Date, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },

    // Password reset fields
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
