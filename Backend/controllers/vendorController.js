const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require('dotenv');
dotEnv.config();
const secretkey = process.env.WhatIsYourName;

const vendorRegister = async (req, res)=>{
    console.log("req body", req.body);
    const {username, email, password} = req.body
    try{
        const vendorEmail = await Vendor.findOne({email: email});
        if(vendorEmail){
            return res.status(400).json({message: "Email is already registered"});
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message: "Hai Prasad Vendor registered successfully "})
        console.log("registeredddd");
    }catch(err){
        console.error(error);
        res.status(500).json({error: "Internalll serverrr errorr"})
    }
}
const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;
    try {
       const vendor = await Vendor.findOne({email});
       if(!vendor || !(await bcrypt.compare(password, vendor.password))){
        return res.status(401).json({error: "Invalid username or password"})
       }
       const token = jwt.sign({vendorId: vendor._id}, secretkey, {expiresIn: "1h"})
       res.status(200).json({success: "Login successful",token: token})
       console.log(email, "this is token", token);
    } catch(error){
        res.status(500).json({error: "Internal server error"})
    }
}

const getAllVendors = async(req,res)=>{
    try{
      const vendors = await Vendor.find().populate('firm');
      res.json({vendors})
    }catch(error){
      console.error(error);
        res.status(500).json({error: "Internalll serverrr errorr from getallvendors"})
    }
}

//individual fetch single vendor records based on ID
const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({error: "vendor not found"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internalll serverrr errorr from individual vendors"})
    }
}

module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById}