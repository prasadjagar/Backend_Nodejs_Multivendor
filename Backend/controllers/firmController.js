const Firm  = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer'); 

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

// add firm ki kavalasina logic             
const addFirm = async(req, res)=>{
  try {
    const {firmName, area, category, region, offer}= req.body;
    const image = req.file?req.file.filename: undefined;
    
    
    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
      res.status(404).json({message:"Vendor not found"});
    }
    const firm = new Firm({
      firmName, area, category,region,offer,image, vendor: vendor._id
    })
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm._id)
    await vendor.save()
    return res.status(200).json({message: "Firm Added successfully"})
  } catch (error) {
     console.error(error)
     res.status(500).json("internal server error")
  }
}

const deleteFirmById = async(req,res)=>{
  try {
    const firmId = req.params.firmId;
    const deleteProduct = await Firm.findByIdAndDelete(firmId);
    if(!deleteProduct){
      return res.status(404).json({error: "prasad No Product found"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal server error at product found"});
  }
}
module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}