import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "AcesAds Aero API is online (Consolidated)" });
});

// Talent Application
app.post('/api/apply', upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "hrLetter", maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, surname, nationality, dob, crewType } = req.body;
    const files = req.files as any;

    if (!files || !files.cv || !files.license) {
      return res.status(400).json({ success: false, message: "Missing required files (CV and License)." });
    }

    const adminEmail = "ryanmed.khalil@gmail.com";
    const mailOptions = {
      from: process.env.SMTP_USER || "recruitment@acesads.aero",
      to: adminEmail,
      subject: `New Talent Application: ${name} ${surname} (${crewType})`,
      text: `Name: ${name} ${surname}\nNationality: ${nationality}\nDOB: ${dob}\nCrew Type: ${crewType}`,
      attachments: [
        { filename: files.cv[0].originalname, content: files.cv[0].buffer },
        { filename: files.license[0].originalname, content: files.license[0].buffer },
        ...(files.hrLetter ? [{ filename: files.hrLetter[0].originalname, content: files.hrLetter[0].buffer }] : []),
      ],
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ success: true, message: "Application submitted successfully!" });
  } catch (error: any) {
    console.error("Apply Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Partnership Request
app.post('/api/partner', async (req, res) => {
  try {
    const { companyName, contactName, email, phone, operationType, fleetSize, message, services } = req.body;

    const adminEmail = "ryanmed.khalil@gmail.com";
    const mailOptions = {
      from: process.env.SMTP_USER || "recruitment@acesads.aero",
      to: adminEmail,
      subject: `New Partnership Request: ${companyName}`,
      text: `
        Company: ${companyName}
        Contact: ${contactName}
        Email: ${email}
        Phone: ${phone}
        Operation Type: ${operationType}
        Fleet Size: ${fleetSize}
        Services Requested: ${services ? services.join(', ') : 'None specified'}
        
        Message:
        ${message}
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ 
      success: true, 
      message: "Partnership request received! Our team will contact you shortly." 
    });
  } catch (error: any) {
    console.error("Partner Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default app;
