/**
 * PDF API Routes
 * ==============
 * Handles all PDF generation requests with proper error handling,
 * validation, file management, and download support.
 */

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');

const {
  generateCustomPDF,
  generateResumePDF,
  generateInvoicePDF,
  generateCertificatePDF,
  generateReportPDF,
} = require('../utils/pdfGenerator');

const {
  validateCustomPDF,
  validateResumePDF,
  validateInvoicePDF,
  validateCertificatePDF,
} = require('../middleware/validate');

// ─── File Upload Config ────────────────────────────────────────────────────────
const upload = multer({
  dest: path.join(__dirname, '../../public/uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP).'));
  },
});

const OUTPUT_DIR = path.join(__dirname, '../../generated_pdfs');

// ─── Shared Response Helper ────────────────────────────────────────────────────
function sendPDFResponse(res, filePath, filename) {
  const fileUrl = `/generated_pdfs/${path.basename(filePath)}`;
  res.json({
    success: true,
    message: 'PDF generated successfully!',
    filename,
    url: fileUrl,
    downloadUrl: fileUrl,
    size: fs.statSync(filePath).size,
    generatedAt: new Date().toISOString(),
  });
}

// ─── Cleanup old generated PDFs (older than 1 hour) ───────────────────────────
function cleanupOldFiles() {
  const now = Date.now();
  fs.readdirSync(OUTPUT_DIR).forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > 3600000) {
      fs.unlinkSync(filePath);
    }
  });
}

// ─── POST /api/pdf/custom ──────────────────────────────────────────────────────
router.post('/custom', validateCustomPDF, async (req, res, next) => {
  try {
    cleanupOldFiles();
    const filename = `custom-${uuidv4()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    await generateCustomPDF(req.body, outputPath);
    sendPDFResponse(res, outputPath, filename);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/pdf/resume ──────────────────────────────────────────────────────
router.post('/resume', validateResumePDF, async (req, res, next) => {
  try {
    cleanupOldFiles();
    const filename = `resume-${uuidv4()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    await generateResumePDF(req.body, outputPath);
    sendPDFResponse(res, outputPath, filename);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/pdf/invoice ─────────────────────────────────────────────────────
router.post('/invoice', validateInvoicePDF, async (req, res, next) => {
  try {
    cleanupOldFiles();
    const filename = `invoice-${uuidv4()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    await generateInvoicePDF(req.body, outputPath);
    sendPDFResponse(res, outputPath, filename);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/pdf/certificate ─────────────────────────────────────────────────
router.post('/certificate', validateCertificatePDF, async (req, res, next) => {
  try {
    cleanupOldFiles();
    const filename = `certificate-${uuidv4()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    await generateCertificatePDF(req.body, outputPath);
    sendPDFResponse(res, outputPath, filename);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/pdf/report ──────────────────────────────────────────────────────
router.post('/report', async (req, res, next) => {
  try {
    cleanupOldFiles();
    const filename = `report-${uuidv4()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    await generateReportPDF(req.body, outputPath);
    sendPDFResponse(res, outputPath, filename);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/pdf/download/:filename ──────────────────────────────────────────
router.get('/download/:filename', (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename); // prevent path traversal
    const filePath = path.join(OUTPUT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF not found or has expired.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/pdf/list ─────────────────────────────────────────────────────────
router.get('/list', (req, res) => {
  const files = fs.readdirSync(OUTPUT_DIR).map(f => ({
    name: f,
    url: `/generated_pdfs/${f}`,
    size: fs.statSync(path.join(OUTPUT_DIR, f)).size,
    created: fs.statSync(path.join(OUTPUT_DIR, f)).mtime,
  }));
  res.json({ success: true, count: files.length, files });
});

module.exports = router;
