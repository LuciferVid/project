import nodemailer from 'nodemailer';

class INotification {
  async send(to, subject, data) { throw new Error('Not implemented'); }
}

class EmailNotification extends INotification {
  async send(to, subject, data) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<div>
        <h2>${subject}</h2>
        <p>${data}</p>
      </div>`,
    };

    try {
      if(process.env.EMAIL_USER !== 'youremail@gmail.com') { // Prevent crashing with dummy creds
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
      } else {
        console.log(`Mock Email sent to ${to}: ${subject}`);
      }
    } catch (err) {
      console.error(`Error sending email to ${to}:`, err);
    }
  }
}

class SMSNotification extends INotification {
  async send(to, subject, data) {
    // Twilio / Fast2SMS API integration goes here
    console.log(`Mock SMS sent to ${to}: ${subject}`);
  }
}

export class NotificationFactory {
  static create(channel) {
    if (channel === 'EMAIL') return new EmailNotification();
    if (channel === 'SMS') return new SMSNotification();
    throw new Error(`Unknown channel: ${channel}`);
  }
  
  static async notifyAll(to, subject, data) {
    await Promise.allSettled([
      this.create('EMAIL').send(to.email, subject, data),
      to.phone ? this.create('SMS').send(to.phone, subject, data) : Promise.resolve()
    ]);
  }
}
