const express =require("express");
const AppError = require("./Utils/appError");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const globalErrorHandler = require("./Controller/errorController");
const fs=require("fs");
const morgan = require("morgan");
const nftRouter = require("./Routes/nftsRoute");
const userRouter = require("./Routes/userRoute");

const app = express();
app.use(express.json({limit:"10kb"}));

//Data Sanitaization against a NoSQL query injection
app.use(mongoSanitize());

//Data Sanitaization against site script XSS
app.use(xss());

//Secure http header 
app.use(helmet());

const limiter = rateLimit({
    max:100,
    windows:60*60*1000,
    message:"Too many request from this IP, please try again in an hour!"
});

app.use('/api',limiter);

if(process.env.NODE_ENV !== 'production')
app.use(morgan("dev"));// this console logs the api endpoint and the method that the user has requested

app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
});


app.use('/api/v1/nfts',nftRouter);
app.use('/api/v1/users',userRouter);     
 
app.all("*",(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

//Global Eror Handling Middleware 
app.use(globalErrorHandler);


module.exports = app;