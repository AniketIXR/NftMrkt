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
    useNewUrlParse: true
}).then((con)=>{
    // console.log(con.connection);
    console.log("Connection Done");
});    

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`App runnign on port ${port}..`);
});