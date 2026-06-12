import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

// -----becrypt password----- //
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  
});

// --compare password-- //
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
