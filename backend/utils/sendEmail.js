const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "9b174e1ecb8ed9",
            pass: "90234d879d2ddb"
        }
        // host: process.env.SMPT_HOST,
        // port: process.env.SMPT_PORT,
        // service: process.env.SMPT_SERVICE,
        // auth:{
        //     // SMPT - simple mail transport protocol
        //     user: process.env.SMPT_MAIL,
        //     pass: process.env.SMPT_PASSWORD
        // }
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    //This is send the mail to specific email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail