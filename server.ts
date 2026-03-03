import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Talent Application
  app.post("/api/apply", upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "hrLetter", maxCount: 1 }
  ]), (req, res) => {
    const { name, surname, nationality, dob, crewType } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log("New Talent Application Received:");
    console.log({ name, surname, nationality, dob, crewType });
    console.log("Files received:", Object.keys(files));

    // IN A REAL PRODUCTION ENVIRONMENT:
    // You would use a service like Nodemailer, SendGrid, or AWS SES here.
    // Example logic:
    // const adminEmail = "flgroundops@gmail.com";
    // await sendEmail({
    //   to: adminEmail,
    //   subject: `New Talent Application: ${name} ${surname}`,
    //   text: `Name: ${name} ${surname}\nNationality: ${nationality}\nDOB: ${dob}\nType: ${crewType}`,
    //   attachments: files...
    // });

    res.status(200).json({ 
      success: true, 
      message: "Application submitted successfully! Our HR team will review it and contact you soon." 
    });
  });

  // API Route for Airline Partnership
  app.post("/api/partner", (req, res) => {
    const { companyName, contactName, email, phone, operationType, fleetSize, message, services } = req.body;

    console.log("New Airline Partnership Request Received:");
    console.log({ companyName, contactName, email, phone, operationType, fleetSize, message, services });

    // IN A REAL PRODUCTION ENVIRONMENT:
    // Send email to business development team
    // const bdEmail = "flgroundops@gmail.com";
    // await sendEmail({ ... });

    res.status(200).json({ 
      success: true, 
      message: "Partnership request received! Our business development team will contact you soon." 
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
