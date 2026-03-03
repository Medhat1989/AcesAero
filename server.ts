import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// Ensure uploads directory exists (even if using memoryStorage, for safety)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Nodemailer
// Note: In production, you'll need to set these environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route for Talent Application
  app.post("/api/apply", upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "hrLetter", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { name, surname, nationality, dob, crewType } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      console.log("New Talent Application Received:", { name, surname, nationality, dob, crewType });
      
      if (!files || !files.cv || !files.license) {
        console.error("Validation Error: Missing required files");
        return res.status(400).json({ 
          success: false, 
          message: "Missing required files (CV and License are mandatory)." 
        });
      }

      console.log("Files received successfully:", Object.keys(files));

      // Email Logic
      const adminEmail = "flgroundops@gmail.com";
      const mailOptions = {
        from: process.env.SMTP_USER || "recruitment@acesads.aero",
        to: adminEmail,
        subject: `New Talent Application: ${name} ${surname} (${crewType})`,
        text: `
          New Talent Application Details:
          -----------------------------
          Name: ${name} ${surname}
          Nationality: ${nationality}
          Date of Birth: ${dob}
          Crew Type: ${crewType}
          
          Files are attached to this email.
        `,
        attachments: [
          {
            filename: files.cv[0].originalname,
            content: files.cv[0].buffer,
          },
          {
            filename: files.license[0].originalname,
            content: files.license[0].buffer,
          },
          ...(files.hrLetter ? [{
            filename: files.hrLetter[0].originalname,
            content: files.hrLetter[0].buffer,
          }] : []),
        ],
      };

      // Only attempt to send if SMTP is configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", adminEmail);
      } else {
        console.log("SMTP not configured. Skipping email send. Application details logged to console.");
      }

      res.status(200).json({ 
        success: true, 
        message: "Application submitted successfully! Our HR team will review it and contact you soon." 
      });
    } catch (error) {
      console.error("Server Error during application submission:", error);
      res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
  });

  // API Route for Airline Partnership
  app.post("/api/partner", (req, res) => {
    const { companyName, contactName, email, phone, operationType, fleetSize, message, services } = req.body;

    console.log("New Airline Partnership Request Received:", { companyName, contactName, email, phone });

    res.status(200).json({ 
      success: true, 
      message: "Partnership request received!" 
    });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler caught:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
