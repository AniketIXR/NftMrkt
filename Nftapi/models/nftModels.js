const mongoose = require('mongoose');
const { default: next } = require('next');
const slugify=require('slugify');

const nftSchema= new mongoose.Schema({
    name:{
        type:String ,
        required: [true , "A name is required"],
        unique: true, 
    },
    slug:String,
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
    ratingsQuantity : {
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
    images:[String],
    creationTime:{
        type:Date,
        default : Date.now()
    },
    secNFT:{
        type:Boolean,
        default: false
    }
  },
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
);

nftSchema.virtual("durationWeeks").get(function(){
    return this.duration/7;
});


//Doc Middleware

//This pre middleware works only at the time of creation not at the time of update
nftSchema.pre("save",function(next){
    this.slug = slugify(this,name,{lower:true});
    next();
});
//This will run after the data is saved to the database
nftSchema.post("save",function(doc,next){
    console.log(doc);
});

//Query Middleware
//If we want some specific data to be only vissible to specific users
nftSchema.pre("find",function(next){
    this.find({secretNfts:{$ne:true}});
    next();
});
//This works for every operation delete patch .....
nftSchema.pre("findOne",function(next){
    this.find({secretNfts:{$ne:true}});
    next();
});


const NFT = mongoose.model("NFT",nftSchema); 
module.exports = NFT;