const nodemailer = require("nodemailer");


let testAccount = nodemailer.createTestAccount();

const auth = {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
}

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth
});

const sendMail = (transport) => {
    console.log(auth)
    transporter.sendMail(transport, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("mail sent successfully. " + info)
        }
    })
}

const sendWelcomeMail = (email, name) => {
    const transport = {
        from: '"Task Manager Team " <vishalvarnwal25@outlook.com>',
        to: email,
        subject: "Welcome to Task Manager app",
        html: `
        <h2>Welcome to the app, ${name}.</h2>
        <p>Let me know how you get along with it. Now, you can create your task easily. Please, do let me know your feedback.</p></br>
        <b>Thanks & Regards,</b></br>
        <b>TaskManager Team</b>`,
    }
    sendMail(transport)
}

const sendGoodByeMail = (email, name) => {
    const transport = {
        from: '"Task Manager Team " <vishalvarnwal25@outlook.com>',
        to: email,
        subject: "Sorry to see you go!",
        html: `
        <h2><b>Goodbye, ${name}.</b></h2>
        <p>I hope to see you back sometime soon.</p></br>
        <b>Thanks & Regards,</b></br>
        <b>TaskManager Team</b>`,
    }
    sendMail(transport)
}

module.exports = {
    sendWelcomeMail,
    sendGoodByeMail
}