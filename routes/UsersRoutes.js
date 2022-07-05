const express = require("express");
const {
  createUser,
  login,
  updateUser,
  sendOtp,
  deleteUser,
  fetchUser,
  changePassword,
  forgetPassword,
  fetchUserById,
} = require("../controllers/UsersControllers");
const fileUpload = require("../middlewares/fileUpload");
const checkAuth = require("../middlewares/check-auth");
const router = express.Router();

router.post("/", createUser);
router.post("/login", login);
router.put("/forgetPassword", forgetPassword);
router.get("/sendOtp", sendOtp);

router.use(checkAuth);

router.get("/", fetchUser);
router.put("/", fileUpload.single("file"), updateUser);
router.delete("/", deleteUser);
router.get("/fetchUserById", fetchUserById);
router.put("/changePassword", changePassword);

module.exports = router;
