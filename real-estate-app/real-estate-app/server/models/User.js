const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const validator = require("validator"); // Import validator for email validation

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password is modified
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// ✅ Method to compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// ✅ Add unique index for email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
