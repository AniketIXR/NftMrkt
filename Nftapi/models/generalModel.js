const mongoose = require('mongoose');

const nftSchema= new mongoose.Schema({
    name:{
        type:String ,
        required: [true , "A name is required"],
        unique: true, 
    },
    duration :
    {
     type:String ,
     required: [true , "A duration is required"]
    },
    maxGroupSize :{
      type :Number,
      required: [true , "Max group size is required"]
    },
    difficulty :{
        type:String,
        required: [true , "Difficulty is required"]
    },
    ratingsAverage : {
        type: Number,
        default : 4  
    },
    ratingQuantity : {
        type:Number,
        default:0
    },
    price:{
        type: Number,
        required: [true, "A price is required"],
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true , "A summary is required"]
    },
    description :{
        type:String,
        trim:true
    },
    bgImage:{
        type:String,
        reqired:[true , "Image is required"]
    },
    images:String,
    creationTime:{
        type:Date,
        default : Date.now()
    },

    
});

const NFT = mongoose.model("NFT",nftSchema); 
module.exports = NFT;