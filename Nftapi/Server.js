const dotenv = require('dotenv');
const app =require('./app');
const mongoose = require('mongoose');
const  {NFT} = require('./models/nftModels');

dotenv.config({path:"./config.env"});

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
}).then((con)=>{
    // console.log(con.connection);
    console.log("Connection Done");
});    

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`App runnign on port ${port}..`);
});

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");
    server.close(()=>{
        process.exit(1);
    });
});

process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    console.log("UNCAUGHT EXCEPTION! Shutting down...");
    process.exit(1);
});