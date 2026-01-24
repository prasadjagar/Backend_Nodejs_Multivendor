console.log("Hai Prasad");

const express = require("express")
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
//const cors = require('cors');
//const path = require('path');

//hai prasad 



const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB successfully prasad"))
    .catch((err) => console.log("Error connecting to MongoDB: praasd2", err));
    app.use(bodyParser.json())
     app.use('/vendor', vendorRoutes);
     app.use('/firm', firmRoutes);
     app.use('/product', productRoutes); //  this is middleware
     app.use('/uploads', express.static('uploads'));

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.use('/',(req, res)=>{
    res.send("Hello Prasad from express server");
})