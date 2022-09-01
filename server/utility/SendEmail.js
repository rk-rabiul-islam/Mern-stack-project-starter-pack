// All requird Import elements
import nodemailer from 'nodemailer';
// Create Send Email for your
export const SendEmail = async (to, subject, msg) =>{

    try {
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: "developerrk.me@gmail.com",
              pass: "ppenfwnqaicsigpa"
            }
          });

          transport.sendMail({
            from    : 'developerrk.me@gmail.com',
            to      : to,
            subject : subject,
            text : msg
          });
        
    } catch (error) {
        console.log(error);
    }

}