const nodemailer = require('nodemailer');

const sendApproveLetter = async(email, login, password) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'edbo.adm@gmail.com',
            pass: '321qazxsw'
        }
    });
    const mailOptions = {
        from: `edbo.adm@gmail.com`,
        to: `${email}`,
        subject: 'ЄДЕБО - відповідь',
        text: `Ваш запит на отримання ролі реєстратора ЄДЕБО прийнято.

        Логін: ${login}
        Пароль: ${password}
        `,
    };
    transporter.sendMail(mailOptions, function(error) {
        if (error) {
            throw new Error(error.message);
        }
    });
}

const sendRejectLetter = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'edbo.adm@gmail.com',
            pass: '321qazxsw'
        }
    });
    const mailOptions = {
        from: `edbo.adm@gmail.com`,
        to: `${email}`,
        subject: 'ЄДЕБО - відповідь',
        text: `Ваш запит на отримання ролі реєстратора ЄДЕБО відхилено.`,
    };
    transporter.sendMail(mailOptions, function(error) {
        if (error) {
            throw new Error(error.message);
        }
    });
}

module.exports = {
    sendApproveLetter,
    sendRejectLetter
}