const mongoose = require("mongoose");
const Admins = mongoose.model("Admins");
const Users = mongoose.model("Users");
const TcPp = mongoose.model("TcPp");
const bcrypt = require("bcrypt");
const main = require("../index.js");
const { pushNotifications } = require("../utils/utils");
const moment = require("moment");

//done
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ status: 0, message: "Email field can't be empty" });
    } else if (!password) {
      return res.status(400).send({ status: 0, message: "Password field can't be empty" });
    }
    const emaill = email.toLowerCase();
    const admin = await Admins.findOne({ email: emaill });
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!emaill.match(emailRegex)) {
      return res.status(400).send({ status: 0, message: "Invalid Email Address" });
    }
    if (!admin) {
      return res.status(400).send({ status: 0, message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send({ status: 0, message: "Password is not valid" });
    } else {
      await admin.generateAuthToken();
      const adminDetail = await Admins.findOne({ _id: admin._id });
      res.status(200).send({ status: 1, message: "Login Successfully", data: adminDetail });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

//done
const signOut = async (req, res) => {
  try {
    const user = await Admins.findById({ _id: req.user._id });
    if (!user) {
      return res.status(400).send({ status: 0, message: "Admin Not Found" });
    } else {
      await Admins.findOneAndUpdate(
        { _id: req.user._id },
        {
          token: null,
        },
        { new: true }
      );
      res.status(200).send({ status: 1, message: "Admin Logged Out" });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

// //done
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, confirmNewPassword, newPassword } = req.body;
    const usercheck = await Admins.findOne({ _id: req.user._id });
    if (!currentPassword) {
      return res.status(400).send({ status: 0, message: "Current Password Is Required" });
    }
    const isMatch = await bcrypt.compare(currentPassword, usercheck.password);
    if (!isMatch) {
      return res.status(400).send({ status: 0, message: "Invalid Current Password" });
    } else if (!newPassword) {
      return res.status(400).send({ status: 0, message: "New Password Is Required" });
    } else if (newPassword.length < 6) {
      return res.status(400).send({ status: 0, message: "Password Should Be 6 Character Long" });
    } else if (!confirmNewPassword) {
      return res.status(400).send({ status: 0, message: "Confirm New Password Is Required" });
    } else if (confirmNewPassword.length < 6) {
      return res.status(400).send({ status: 0, message: "Password Should Be 6 Character Long" });
    } else if (newPassword !== confirmNewPassword) {
      return res.status(400).send({ status: 0, message: "New Password And Confirm New Password Should Be Same" });
    } else if (currentPassword == newPassword || currentPassword == confirmNewPassword) {
      return res.status(400).send({ status: 0, message: "Current Password And New Password Can't Be Same" });
    } else if (!usercheck) {
      return res.status(400).send({ status: 0, message: "User Not Found" });
    } else {
      await usercheck.comparePassword(currentPassword);
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(newPassword, salt);
      await Admins.findByIdAndUpdate({ _id: req.user._id }, { $set: { password: pass } });
      res.status(200).send({ status: 1, message: "Password Changed Successfully" });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

// //done
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({ isDeleted: 0 }).sort({ createdAt: -1 });
    if (users.length < 1) {
      return res.status(400).send({ status: 0, message: "No Users Found" });
    } else {
      return res.status(200).send({ status: 1, Users: users });
    }
  } catch (error) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

// // done
const deleteAccount = async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteUser = await Users.findByIdAndUpdate({ _id: _id }, { $set: { isDeleted: 1 } });
    if (deleteUser) {
      res.status(200).send({ status: 1, message: "Account deleted successfully" });
      // await Meme.updateMany({ userId: _id }, { isDeleted: 1 })
      // await Vote.deleteMany({ userId: _id })
      // await Friends.deleteMany({
      //     $or: [
      //         { friendId: _id },
      //         { userId: _id },
      //     ]
      // })
      // await LeaderBoard.deleteMany({ userId: _id })
      // await BlockUser.deleteMany({
      //     $or: [
      //         { blockedUserId: _id },
      //         { userId: _id },
      //     ]
      // })
      // await ReportMeme.deleteMany({ userId: _id })
    } else {
      return res.status(400).send({ status: 0, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

// // done
const blockunblock = async (req, res) => {
  try {
    const _id = req.params.id;
    const checkUser = await Users.findOne({ _id });
    if (checkUser.block) {
      const user = await Users.findByIdAndUpdate({ _id }, { $set: { block: false } });

      if (user) {
        return res.status(200).send({ status: 1, message: "Account Unblocked Successfully" });
      }
    } else {
      const user = await Users.findByIdAndUpdate({ _id }, { $set: { block: true } });
      if (user) {
        await Users.findOneAndUpdate(
          { _id: user._id },
          {
            token: null,
            user_device_type: null,
            user_device_token: null,
          },
          { new: true }
        );
        return res.status(200).send({ status: 1, message: "Account Blocked Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

// //done
const TcandPp = async (req, res) => {
  try {
    const { termCondition, privacyPolicy, aboutUs } = req.body;
    const findData = await TcPp.findOne();
    if (!termCondition && !privacyPolicy && !aboutUs) {
      res.status(400).send({ status: 0, message: "Please Add Term Condition, Privacy Policy or About Us" });
    } else if (termCondition && privacyPolicy) {
      await TcPp.findByIdAndUpdate({ _id: findData?._id }, { $set: { termCondition, privacyPolicy, aboutUs } });
    } else if (termCondition && !privacyPolicy && !aboutUs) {
      await TcPp.findByIdAndUpdate({ _id: findData?._id }, { $set: { termCondition } });
    } else if (privacyPolicy && !termCondition && !aboutUs) {
      await TcPp.findByIdAndUpdate({ _id: findData?._id }, { $set: { privacyPolicy } });
    } else if (aboutUs && !termCondition && !privacyPolicy) {
      await TcPp.findByIdAndUpdate({ _id: findData?._id }, { $set: { aboutUs } });
    }
    res.status(200).send({ status: 1, message: `${termCondition && privacyPolicy && aboutUs ? "Term Condition, Privacy Policy and About Us" : termCondition ? "Term Condition " : privacyPolicy ? "Privacy Policy " : aboutUs ? "About Us " : " "}Added Successfully` });
  } catch (err) {
    res.status(400).send({ status: 0, message: "Something went wrong" });
  }
  main.dbSeed();
};

// //done
const getTcandPp = async (req, res) => {
  try {
    const { type } = req.query;
    const tcAndPp = await TcPp.findOne();
    if (type == "about_us" || type == "privacy_policy" || type == "terms_and_conditions") {
      res.status(200).send({ status: 1, tcAndPp, url: { content: `${process.env.URL}${type}` } });
    } else if (type == "all") {
      res.status(200).send({ status: 1, tcAndPp, url: { content: `${process.env.URL}${type}` } });
    } else {
      res.status(400).send({ status: 0, message: "Invalid content type" });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, message: "Something went wrong" });
  }
};

module.exports = { signIn, signOut, updatePassword, getAllUsers, deleteAccount, blockunblock, TcandPp, getTcandPp };
