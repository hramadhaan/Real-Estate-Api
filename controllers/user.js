// FILE
const User = require("../models/user");
// PACKAGE
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No Image Provided");
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const username = req.body.username;
  const photo = req.file.path;
  //   const photo = req.body.photo;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        name: name,
        username: username,
        photo: photo,
        email: email,
        password: hashedPw,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User berhasil didaftarkan.",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let dataUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.json({ message: "User tidak ada." });
      }
      dataUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.json({
          message: "Password Anda salah.",
        });
      }
      const token = jwt.sign(
        {
          email: dataUser.email,
          userId: dataUser._id.toString(),
        },
        "passwordsangatrahasia"
      );
      res.status(200).json({
        message: "Login berhasil.",
        token: token,
        userId: dataUser["_id"],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.profile = (req, res, next) => {
  const id = req.params.id;
  User.findOne({ _id: id })
    .then((profile) => {
      res.status(200).json({
        message: "Berhasil mendapatkan data user.",
        data: profile,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
