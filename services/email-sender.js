const nodemailer = require('nodemailer');
require('dotenv').config()

const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});


async function sendEmailRegis(user_email, user_username, user_password, user_token) {
    var mailOptions = {
        from: 'TVnow',
        to: user_email,
        subject: 'Register Verification - TVnow.com',
        html: `<h2>Your Payment is successful, kindly use this <a href="https://tvnow-client.web.app/register-verify?user=${user_username}&token=${user_token}">link</a> to activate this account. (Only for the 1st time)</h2>
        <h3>Your Account</h3>
            <h4>Username:</b> ${user_username}</h4>
            <h4>Password:</b> ${user_password}</h4>
            <p><i>Please do not share the password with anyone.</i></p>`
    }
    await new Promise((resolve, reject) => {
        mail.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(console.log(info))
            }
        });
    });
}
async function sendEmailChangePassword(user_email, user_token) {
    var mailOptions = {
        from: 'TVnow',
        to: user_email,
        subject: 'Password Change - TVnow.com',
        html: `<h2>You request to change the current password, kindly use this <a href="https://tvnow-client.web.app/password-submit?user=${user_email}&token=${user_token}">link</a> to change password.</h2>
        <h3>
            <i>If you're not submit this, we highly recommended you to change your current password.</i>
        </h3>`
    }
    await new Promise((resolve, reject) => {
        mail.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(console.log(info))
            }
        });
    });
}
async function sendEmailTwoFactor(user_email, id_token, timekey_token) {
    var mailOptions = {
        from: 'TVnow',
        to: user_email,
        subject: '2 Step Verification Login - TVnow.com',
        html: `<h2>Please enter these numbers to login, or go to this <a href="https://tvnow-client.web.app/login-twofac_email?user=${user_email}&token=${timekey_token}">link within 15 minutes.</a></h2>
            <h1>Code: ${id_token}</h1>`
    }
    await new Promise((resolve, reject) => {
        mail.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(console.log(info))
            }
        });
    });
}
async function sendEmailForgotPassword(user_email, user_username, user_password) {


    var mailOptions = {
        from: 'TVnow',
        to: user_email,
        subject: 'Forgot Password - TVnow.com',
        html: `<h2>You request the forgotten password, please feel free to login <a href="https://tvnow-client.web.app/login">here</a>.</h2>
        <h3>Your Account</h3>
            <h4>Username:</b> ${user_username}</h4>
            <h4>Password:</b> ${user_password}</h4>
            <p><i>Please do not share the password with anyone.</i></p>`
    }
    await new Promise((resolve, reject) => {
        mail.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(console.log(info))
            }
        });
    });

}

module.exports = { sendEmailRegis, sendEmailChangePassword, sendEmailTwoFactor, sendEmailForgotPassword };
