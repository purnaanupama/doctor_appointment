import nodemailer from 'nodemailer'

export const sendEmail = async(email,otp)=>{
    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // use TLS
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
      },
      tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
      }
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: email, // recipient email address
      subject: 'HERE IS YOUR OTP CODE TO SUCCESSFULLY REGISTER TO DOC-MEDICARE',
      text: `Your OTP code is: ${otp}`,
      html: `<b>Your OTP code is: ${otp}</b>`
  });

  if(info.messageId){
    return("success")
  } else {
    return("fail")
  }
}