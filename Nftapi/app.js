const express =require("express");
const fs=require("fs");
const morgan = require("morgan");
const nftRouter = require("./routes/nftsRoute");
const userRouter = require("./routes/userRoute");

const app = express();
app.use(express.json());

if(process.env.NODE_ENV !== 'production')
app.use(morgan("dev"));// this console logs the api endpoint and the method that the user has requested

app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
});


app.use('/api/v1/nfts',nftRouter);
app.use('/api/v1/users',userRouter);     

module.exports = app;