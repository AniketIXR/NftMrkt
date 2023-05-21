const User = require("../models/userModels");
const ApiFeatures = require("../Utils/apiFeatures");
const AppError = require("../Utils/appError");

const filterObj = (obj,...allowedFields)=>{
    let newObj = {};
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el];
    });
    return newObj;
}

exports.updateMe = async(req,rez,next)=>{

    //1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates. Please use /updateMyPassword.",400));
    }
    //2)Update user document
    const filterBody = filterObj(req.body,'name','email');

    const updateUser =await User.findByIdAndUpdate(req.body.id,filterBody,{
        new:true,
        runValidators:true,
    });
    res.status(200).json({
        status: "success",
        data:{
            users: updateUser,
        }
    });
}

exports.updateUser = async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.body.id,{active:false});

    res.status(200).json({
        status: "success",
        data:null, 
    });

}

exports.getUsers = async (req,res)=>{

    try{
        const users= await User.find();
        res.status(200).json({
            status: "success",
            data:{
                users: users,
            }
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err,
           });
    }
    
};
exports.getUser = (req,res)=>{
 res.status(500).json({
  status: "error",
  message: "Internal Server Error"
 });
};
exports.createUser = (req,res)=>{
 res.status(500).json({
  status: "error",
  message: "Internal Server Error"
 });
};
exports.updateUser = (req,res)=>{
 res.status(500).json({
  status: "error",
  message: "Internal Server Error"
 });
};
exports.deleteUser = (req,res)=>{
 res.status(500).json({
  status: "error",
  message: "Internal Server Error"
 });
};