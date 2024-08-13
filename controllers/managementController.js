const User = require("../models/User");

exports.createUser = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  const {
    username,
    email,
    password,
    userType,
    leadAccess,
    phone,
    countryCode,
  } = req.body;
  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render("createmanagement", {
        error: "Username already exists",
        formData: req.body,
        userType: req.session.user.userType,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.render("createmanagement", {
        error: "Email already exists",
        formData: req.body,
        userType: req.session.user.userType,
      });
    }

    const existingPhone = await User.findOne({ phone, countryCode });
    if (existingPhone) {
      return res.render("createmanagement", {
        error: "Phone number already exists",
        formData: req.body,
        userType: req.session.user.userType,
      });
    }

    // Generate a referral ID for brokers
    let referralId;
    if (userType === "broker") {
      referralId = await generateUniqueReferralId();
    }

    const user = await User.create({
      username,
      email,
      password,
      userType,
      leadAccess,
      phone,
      countryCode,
      referralId, // This will be undefined for non-brokers
      referCount: 0 // Initialize referCount to 0
    });

    res.redirect("/dashboard/management");
  } catch (err) {
    res.render("createmanagement", {
      error: err.message,
      formData: req.body,
      userType: req.session.user.userType,
    });
  }
};

// Function to generate a unique referral ID
async function generateUniqueReferralId() {
  while (true) {
    const referralId = require("crypto")
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();
    const existingUser = await User.findOne({ referralId });
    if (!existingUser) {
      return referralId;
    }
  }
}

exports.getUsers = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  try {
    if (req.session.user.userType === "agent") {
      return res.status(403).send("Unauthorized");
    }
    const users = await User.find();
    const userType = req.session.user.userType;
    res.render("management", { users: users, userType });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.editUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const userType = req.session.user.userType;
    console.log(user);

    res.render("editmanagement", { user: user, userType });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the new email already exists for another user
    if (req.body.email !== user.email) {
      const existingEmail = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });
      if (existingEmail) {
        return res.status(400).send("Email already exists for another user");
      }
    }

    // Update user fields
    user.username = req.body.username;
    user.email = req.body.email;

    // Only update password if a new one is provided
    if (req.body.password && req.body.password !== user.password) {
      user.password = req.body.password;
    }

    // Check if leadAccess checkboxes are present in the request body
    if (req.body.leadAccess) {
      // If present, update the leadAccess array
      user.leadAccess = Array.isArray(req.body.leadAccess)
        ? req.body.leadAccess
        : [req.body.leadAccess];
    } else {
      // If not present, reset the leadAccess array to empty
      user.leadAccess = [];
    }

    // Update the user document
    await user.save();
    res.redirect("/dashboard/management");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.redirect("/dashboard/management");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
