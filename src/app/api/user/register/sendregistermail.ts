import nodemailer from "nodemailer";

export function sendMail(email: string, emailToken: number) {

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        name: process.env.MAIL_HOST,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }, debug: true
    } as any)

    const mailOptions = {
        from: `"Partypulse" <${process.env.MAIL_SENDERADRESS}>`,
        to: email,
        subject: "Mail Verification for Partypulse",
        html: getEmailHTML(emailToken)
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

function getEmailHTML(code: number) {
    return `
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
      <a href="http://localhost:3000/dash/verify/${code}">Or click here to verify your account</a>
    </div>

    `;
}