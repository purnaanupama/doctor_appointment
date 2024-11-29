import nodemailer from 'nodemailer'

export const sendEmail = async(email,otp)=>{
    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
          user: 'anupamahera2022@gmail.com',
          pass: 'ksfbiqywsbxnjwhm'
      },
      tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
      }
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
      from: 'anupamahera2022@gmail.com', // sender address
      to: email, // recipient email address
      subject: 'HERE IS YOUR OTP CODE TO SUCCESSFULLY REGISTER TO ESTATE-EASE', // subject line
      text: `Your OTP code is: ${otp}`, // plain text body
      html: `<b>Your OTP code is: ${otp}</b>` // html body
  });

  if(info.messageId){
    return("success")
  } else {
    return("fail")
  }
}