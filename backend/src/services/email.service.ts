const nodemailer = require('nodemailer');
require('dotenv').config();
const environment = process.env;

const transporter = nodemailer.createTransport({
    service: environment.SMTP_SERVICE_NAME,
    host: environment.SMTP_SERVICE_HOST,
    secure: environment.SMTP_SERVICE_SECURE,
    port: environment.SMTP_SERVICE_PORT,
    authMethod: environment.SMTP_AUTH_METHOD,
    auth: {
        user: environment.SMTP_USER_NAME,
        pass: environment.SMTP_USER_PASSWORD
    }
});

export interface EmailAttributes {
    from: string;
    to: string;
    subject: string;
    text: string;
}

export class EmailService {
    public send(mailOptions: EmailAttributes) {

        // send the email
        return transporter.sendMail(mailOptions)
            .then((send: any) => Promise.resolve(send))
            .catch((err: any) => Promise.reject(err));
    }
}
