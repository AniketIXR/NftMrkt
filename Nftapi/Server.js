const dotenv = require('dotenv');
const app =require('./app');
const mongoose = require('mongoose');

dotenv.config({path:"./config.env"});

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParse: true
}).then((con)=>{
    // console.log(con.connection);
    console.log("Connection Done");
});    


// console.log(process.env);

const nftSchema= new mongoose.Schema({
    name:{
        type:String ,
        required: [true , "A name is required"],
        unique: true, 
    },
    rating : {
        type: Number,
        default : 4  
    },
    price:{
        type: Number,
        required: [true, "A price is required"],
    }
});

const NFT = mongoose.model("NFT",nftSchema); 

const newNft = new NFT({
    name: "Dot",
    rating :3.4,
    price: 34
});

newNft
     .save()
     .then(docNft =>{
     console.log(docNft);
    })
     .catch(err=>{
      console.log(err);
});

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`App runnign on port ${port}..`);
});