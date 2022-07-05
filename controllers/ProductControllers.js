const HttpError = require("../models/Http-Error");
const Product = require("../models/Product");
const admin = require("../firebase");
const fs = require("fs");
const { getProductsFilters } = require("../utils/filters");

const createProduct = async (req, res, next) => {
  const { uid } = req.headers;
  const { name, category, min_amount, max_amount, unit, price_per_unit } =
    req.body;
  if (!uid || !name || !category || !price_per_unit || !unit) {
    console.log({ ...req.body });

    return next(
      new HttpError("invalid credintials, please check your data", 422)
    );
  }
  if (!req.files) {
    return next(
      new HttpError(
        "must include at least 1 image, please check your data",
        422
      )
    );
  }

  let filePathes = [];
  try {
    filePathes = req.files.map((file) => {
      const bucket = admin.storage().bucket();
      bucket
        .upload(file.path)
        .then(() => {
          fs.unlinkSync(file.path);
        })
        .catch((e) => {
          return next(
            new HttpError("uploading product failed please try again", 500)
          );
        });
      const filePath =
        "https://storage.googleapis.com/snacksstore-30188.appspot.com/" +
        file.filename;
      return filePath;
    });
  } catch (error) {
    return next(
      new HttpError("uploading product failed please try again", 500)
    );
  }

  const product = new Product({
    userId: uid,
    name,
    category,
    images: filePathes,
    min_amount,
    max_amount,
    rating: 0,
    unit,
    price_per_unit,
  });
  try {
    await product.save();
  } catch (error) {
    return next(
      new HttpError("uploading product failed please try again", 500)
    );
  }
  res.status(201).json({ product: product });
};

const editProduct = async (req, res, next) => {
  const { uid } = req.headers;
  const {
    productId,
    name,
    category,
    unit,
    price_per_unit,
    min_amount,
    max_amount,
    images,
  } = req.body;

  if (!uid || !productId) {
    return next(new HttpError("editing product failed please try again", 500));
  }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    return next(new HttpError("editing product failed please try again", 500));
  }
  if (!product) {
    return next(
      new HttpError("can't find a product with the provided id", 404)
    );
  }

  if (name) {
    product.name = name;
  }
  if (category) {
    product.category = category;
  }
  if (price_per_unit) {
    product.price_per_unit = price_per_unit;
  }
  if (min_amount) {
    product.min_amount = min_amount;
  }
  if (max_amount) {
    product.max_amount = max_amount;
  }
  if (images) {
    product.images = images;
  }
  if (unit) {
    product.unit = unit;
  }
  if (req.files) {
    let filePathes = [];
    try {
      filePathes = req.files.map((file) => {
        const bucket = admin.storage().bucket();
        bucket
          .upload(file.path)
          .then(() => {
            fs.unlinkSync(file.path);
          })
          .catch((e) => {
            console.log(e);
            return next(
              new HttpError("editing product failed please try again", 500)
            );
          });
        const filePath =
          "https://storage.googleapis.com/snacksstore-30188.appspot.com/" +
          file.filename;
        return filePath;
      });
    } catch (error) {
      console.log(error);
      return next(
        new HttpError("editing product failed please try again", 500)
      );
    }
    product.images = product.images.concat(filePathes);
    if (product.images.length > 5) {
      return next(new HttpError("product can't have more than 5 images", 500));
    }
  }

  try {
    await product.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("editing product failed please try again", 500));
  }
  res.status(201).json({ product });
};

const deleteProduct = async (req, res, next) => {
  const { uid } = req.headers;
  const { productId } = req.query;
  if (!uid || !productId) {
    return next(new HttpError("deleting product failed please try again", 500));
  }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    return next(new HttpError("deleting product failed please try again", 500));
  }
  if (!product) {
    return next(
      new HttpError("can't find a product with the provided id", 404)
    );
  }
  try {
    await product.delete();
  } catch (error) {
    return next(new HttpError("deleting product failed please try again", 500));
  }
  res.status(201).json({ message: "product deleted successfully" });
};

const fetchProducts = async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const { uid } = req.headers;
  if (!uid) {
    return next(
      new HttpError("invalid credintials, please check your data", 422)
    );
  }
  const filters = getProductsFilters(req.query);
  let products;
  try {
    products = await Product.paginate(filters, {
      limit,
      page,
      sort: "-created_at",
    });
  } catch (error) {
    return next(new HttpError("fetching product failed please try again", 500));
  }
  res.status(201).json({ products: products });
};

exports.createProduct = createProduct;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.fetchProducts = fetchProducts;
