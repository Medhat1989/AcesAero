const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = req.body || {};
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'New Crew Application - AcesAero',
      html: `<h2>New Application</h2>
             <p><b>Name:</b> ${body.surname || 'N/A'}</p>
             <p><b>Email:</b> ${body.email || 'N/A'}</p>
             <p><b>Nationality:</b> ${body.nationality || 'N/A'}</p>
             <p><b>Crew Type:</b> ${body.crew_type || 'N/A'}</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
