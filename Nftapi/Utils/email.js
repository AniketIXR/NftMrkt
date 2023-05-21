const nodemailer = require('nodemailer');

const sendEmail =async (options)=>{

   try{

      
   //1) Create transporter
   const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'alvis.klocko@ethereal.email',
          pass: 'JhCrYs25YTZT2e9q5a'
      }
  });
//    const transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth:{
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//       }
//  });

 //2) Define email option

   const mailOptions = {
      from : "Aniket Roy ",
      to: options.email,
      subject: options.subject,
      text: options.message 
   }

 //3) Active send email

      await transporter.sendMail(mailOptions);

   }
   catch(err){
      
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({validateBeforeSave:false});
      
      return next(new AppError("There was an error sending the email. Try again later!",500));
   }


}

module.exports = sendEmail;