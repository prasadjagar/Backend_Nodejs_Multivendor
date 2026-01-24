const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage: storage}); 

const addProduct = async(req, res)=>{
    try {
        const {productName, price, category, bestseller, description} = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).josn({error: "NO firm found"});
        }
        const product = new Product({
            productName, price, category,bestseller,description,image,firm: firm._id
        })
        const savedProduct = await product.save();
      firm.products.push(savedProduct);
        await firm.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "internal server error feom add prod"})
    }
}

const getProductByFirm = async(req, res)=>{
  console.log("reqqqqq, ressss-",req,res)
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if(!firm){
      return res.status(404).json({error: "NO firm found"});
    }
    const restaurentName = firm.firmName;
    const products = await Product.find({firm: firmId});
    res.status(200).json({restaurentName, products})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server eror at getProductByFirm"});
  }
}

const deleteProductById = async(req,res)=>{
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if(!deleteProduct){
      return res.status(404).json({error: "prasad No Product found"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server error at product found"});
  }
}

module.exports = {addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById};