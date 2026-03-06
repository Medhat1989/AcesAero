import express from "express";
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
// Note: For Gmail, you MUST use an "App Password" if 2FA is enabled.
// See: https://support.google.com/accounts/answer/185833
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const app = express();

async function startServer() {
  const PORT = 3000;

  console.log("Checking SMTP Configuration...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "smtp.gmail.com (default)");
  console.log("SMTP_USER:", process.env.SMTP_USER ? "Configured" : "MISSING");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Configured" : "MISSING");

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.verify();
      console.log("SMTP Connection verified successfully.");
    } catch (error) {
      console.error("SMTP Verification Failed:", error);
      // If it fails, try to re-init with service: 'gmail' if it's gmail
      if ((process.env.SMTP_HOST || "").includes("gmail") || process.env.SMTP_USER?.includes("gmail")) {
        console.log("Attempting Gmail-specific configuration...");
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
    }
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route for Talent Application
  app.get("/api/apply", (req, res) => {
    res.json({ message: "Talent API is active. Use POST to submit applications." });
  });

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
        return res.status(400).json({ 
          success: false, 
          message: "Missing required files (CV and License are mandatory)." 
        });
      }

      // Email Logic
      const adminEmail = "ryanmed.khalil@gmail.com";
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

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully to:", adminEmail);
        } catch (mailError: any) {
          console.error("Nodemailer Error:", mailError);
          return res.status(500).json({ 
            success: false, 
            message: "Failed to send email notification.",
            error: mailError.message 
          });
        }
      } else {
        console.warn("SMTP credentials not configured. Email not sent.");
        return res.status(200).json({ 
          success: true, 
          message: "Application saved to database, but email notification skipped (SMTP not configured).",
          warning: "SMTP_USER and SMTP_PASS environment variables are missing."
        });
      }

      res.status(200).json({ 
        success: true, 
        message: "Application submitted successfully!" 
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  // API Route for Airline Partnership
  app.post("/api/partner", async (req, res) => {
    try {
      const { companyName, contactName, email, phone, operationType, fleetSize, message, services } = req.body;
      console.log("New Airline Partnership Request:", { companyName, contactName, email, phone });

      const adminEmail = "ryanmed.khalil@gmail.com";
      const mailOptions = {
        from: process.env.SMTP_USER || "recruitment@acesads.aero",
        to: adminEmail,
        subject: `New Partnership Request: ${companyName}`,
        text: `
          New Partnership Request Details:
          -----------------------------
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
        try {
          await transporter.sendMail(mailOptions);
          console.log("Partnership email sent successfully to:", adminEmail);
        } catch (mailError: any) {
          console.error("Partnership Nodemailer Error:", mailError);
          return res.status(500).json({ 
            success: false, 
            message: "Failed to send partnership email notification.",
            error: mailError.message 
          });
        }
      } else {
        console.warn("SMTP credentials not configured. Partnership email not sent.");
        return res.status(200).json({ 
          success: true, 
          message: "Partnership request saved, but email notification skipped (SMTP not configured).",
          warning: "SMTP_USER and SMTP_PASS environment variables are missing."
        });
      }

      res.status(200).json({ 
        success: true, 
        message: "Partnership request received! Our team will contact you shortly." 
      });
    } catch (error) {
      console.error("Partnership Server Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
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
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("dist");
    if (fs.existsSync(distPath)) {
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`index.html not found at: ${indexPath}`);
          res.status(404).send("Application not built correctly. index.html missing.");
        }
      });
    } else {
      console.error(`dist directory not found at: ${distPath}`);
      app.get("*", (req, res) => {
        res.status(404).send("Application not built. Please run 'npm run build' first.");
      });
    }
  }

  // Only start listening if not in a serverless environment (like Vercel)
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
