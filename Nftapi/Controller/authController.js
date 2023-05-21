const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
const {promisify} = require('util');
const User = require('../models/userModels');
const sendEmail = require('../Utils/email');
const {catchAsync} = require('../Utils/catchAsync');

//Create Token
const signToken = id => {
    return token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN,
     });
}

//Send Token
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions= {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        // secure:true,
        httpOnly:true,
    };

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token,cookieOptions);
 
    user.password = undefined;

    res.status(statusCode).json({
       status:"Success",
       token,
       data:{
           user:user,
       }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
     const newUser = User.create(
        {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
        }
     );

     const token = signToken(newUser._id);

     res.status(201).json({
        status:"Success",
        token,
        data:{
            user:newUser,
        }
     });
});

exports.login = catchAsync(async (req, res, next) => {

    const {email, password} = req.body;
    if(!email || !password)
    {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if(!user || !(await user.correctPassword(password, user.password)))
    {
        return next(new AppError('Incorrect email or password', 401));
    }

});


exports.protect =catchAsync( async (req, res, next) => {
    
    let token;
    //1)Gettign token and check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(" ")[1];
    }
    if(!token)
    {
        return next(new AppError('You are not looged in! Please log in to get access', 401));
    }
    //2)Verification token
    const decode = promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //This decode gives the id,start time and expire time of the token

    //3)Check if user still exists
    const freshUser = await User.findById(decode.id);
    if(!freshUser)
    {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    //4)Check if user changed password after the token was issued
    if(freshUser.changedPasswordAfter(decode.iat))
    {
        return next(
            new AppError('User recently changed password! Please log in again', 401
            ));
    }
    req.user = freshUser;
    next();
});

exports.rstrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles))
        {
            return next(
                new AppError('You do not have permission to perform this action', 403
            ));
        }
    }

}

exports.forgotPassword = catchAsync(async(req,res,next)=>{

    //1)Get user based on the given date 
    const user = User.findOne({email: req.body.email});

    if(!user)
    {
        return next(new AppError("There is no User with this Email",404));
    }
    //2) create random Token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    //3) Send email back to user
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Forget `;

    await sendEmail({
        email:  user.email,
        subject: "Your Password rest token (Valid for 10 min)",
        message,
    });

    res.status(200).json({
        status:"success",
        message :"Token send to Email",
    });

});

exports.resetPassword= catchAsync(async(req,res,next) =>{

    //1) Get User based on the token
    const hashedToken = crypto().createHashedToken('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
         passwordResetToken:hashedToken,
         passwordResetExpires:{$gte:Date.now()},
        });

    //2)if token has not expired and there is user, set the new password
    if(!user)
    {
        return next(new AppError("Token is invalid or has expired",400));
    }

    //3) Update changePassword for the User

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    
    //4) Log the user in, send JWT
    
    
    const token = signToken(newUser._id);

    res.status(201).json({
       status:"Success",
       token,
    });

});

exports.updatePassword =catchAsync( async(req,res,next) =>{

    //1) Get User from collection of data
    const user = await User.findById(req.user.id).select(+password);
    //2) Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    {
        return next(new AppError("Your current password is wrong",401));
    }
    //3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //4) Log user in, send JWT
    const token = signToken(newUser._id);
    res.status(201).json({
        status:"Success",
        token,
     });
});