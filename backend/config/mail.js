const nodemailer = require('nodemailer')

const sendEmail = (to, subject, html) => {
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });
    
      let mailOptions = {
        from: 'myapp2816@gmail.com',
        to: to,
        subject: subject,
        html: html
      };
    
      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });

}

module.exports = {
    sendEmail,
}