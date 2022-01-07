const nodemailer = require('nodemailer');

const sendLetter = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'edbo.adm@gmail.com',
            pass: '321qazxsw'
        }
    });
    const mailOptions = {
        from: `Name <from_email@gmail.com>`,
        to: 'to_email@gmail.com',
        subject: 'Subject',
        text: `something`,
    };
    transporter.sendMail(mailOptions, function(error) {
        if (err) {
            throw new Error(error.message);
        }
    });
}

module.exports = {
    sendLetter
}