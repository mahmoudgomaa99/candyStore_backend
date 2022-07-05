const express = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  createProduct,
  editProduct,
  deleteProduct,
  fetchProducts,
} = require("../controllers/ProductControllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.use(checkAuth);

router.post("/", fileUpload.array("files", 5), createProduct);
router.put("/", fileUpload.array("files", 5), editProduct);
router.delete("/", deleteProduct);
router.get("/", fetchProducts);

module.exports = router;
