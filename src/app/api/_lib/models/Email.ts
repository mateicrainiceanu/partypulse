import nodemailer from "nodemailer";
import UserNotification from "./notifications";

export default class Email {
    transporter: any;
    mailOptions: any;
    email: string;

    constructor(email: string) {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            name: process.env.MAIL_HOST,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        } as any)
        this.mailOptions = {
            from: `"Partypulse" <${process.env.MAIL_SENDERADRESS}>`,
            to: email,
        }
        this.email = email;
    }

    async SendRegisterVerif(emailToken: number) {
      console.log(this.transporter);
      
        const opt = { ...this.mailOptions, subject: "Registration to Partypulse", html: Email.getRegisterEmail(emailToken) }

        this.transporter.sendMail(opt, (err: any, info: any) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        })
    }

    async notification(n: UserNotification) {
        const opt = { ...this.mailOptions, subject: "Notification from Partypulse", html: await Email.getNotificationEmail(n) }        

        this.transporter.sendMail(opt, (err: any, info: any) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        })
    }

    static async getNotificationEmail(n: UserNotification) {

        const fullnotiv = await UserNotification.getFullNotification(n, n.forUserId)

        return `<div>
    <style>
    .all{
      padding: 2%;
      height: 100vh;
      width: 100vw;
      background: black;
      color: white;
      overflow-y:scroll;
      font-family: sans-serif;
    }
    h1 {
      text-align: left;
      font-family: monospace;
    }
  
    a {
      color: white
    }
    </style>
    <div class="all">
      <h1>Notification from Partypulse!</h1>
      <p>${fullnotiv.from.uname + " " + fullnotiv.text}</p>
      <a href="http://localhost:3000/">Open the app and sign in to see more</a>
    </div>
</div>`
    }

    static getRegisterEmail(code: number) {
        return `
        <div>
       <style>
        .all{
      padding: 2%;
      height: 100vh;
      width: 100vw;
      background: black;
      color: white;
      overflow-y:scroll;
      font-family: sans-serif;
        }
        h1 {    
      text-align: left;
      font-family: monospace;
    }
    .code{
      color: yellow;
      font-family: monospace;
      font-size: 2rem;
    }
    a {
      color: white
    }
    </style>
    <div class="all">
      <h1>Welcome to Partypulse!</h1>
      <p>Your verificarion code is: </p>
      <p class="code">${code}</p>
      <a href="http://${process.env.HOMEPAGE}/dash/verify/${code}">Or click here to verify your account</a>
    </div></div>

    `;
    }
}