import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    hasOwnChannel: {  // Changed from isChannel to hasOwnChannel for better semantics
      type: Boolean,
      default: false,
      immutable: true, // Once true, cannot be changed back to false
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      default: null,
      immutable: function() {  // Channel reference also becomes immutable once set
        return this.hasOwnChannel;
      }
    },
  },
  { timestamps: true }
);

// Pre-save hook for password hashing
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

// Method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Pre-save hook to prevent modification of hasOwnChannel
// userSchema.pre("save", function(next) {
//   if (this.isModified('hasOwnChannel') && this._original.hasOwnChannel === true) {
//     next(new Error("Cannot modify hasOwnChannel once it's set to true"));
//   } else {
//     next();
//   }
// });

// Store original values before any update
// userSchema.pre(/^findOneAndUpdate/, function(next) {
//   this._original = this._conditions;
//   next();
// });

// Prevent hasOwnChannel from being updated to false
// userSchema.pre(/^findOneAndUpdate/, function(next) {
//   const update = this.getUpdate();
//   if (update.hasOwnProperty('hasOwnChannel') && this._original.hasOwnChannel === true) {
//     next(new Error("Cannot modify hasOwnChannel once it's set to true"));
//   } else {
//     next();
//   }
// });

const User = mongoose.model("User", userSchema);

export default User;