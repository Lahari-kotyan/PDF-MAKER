/**
 * PDF Generator Utility
 * =====================
 * Core PDF generation engine using PDFKit.
 * Supports: custom fonts, headers, footers, watermarks,
 * tables, images, QR codes, and multiple templates.
 */

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// ─── Color Palette ─────────────────────────────────────────────────────────────
const COLORS = {
  primary:    '#2563EB',
  secondary:  '#7C3AED',
  accent:     '#059669',
  dark:       '#1E293B',
  medium:     '#64748B',
  light:      '#F1F5F9',
  white:      '#FFFFFF',
  danger:     '#DC2626',
  warning:    '#D97706',
  gold:       '#F59E0B',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Convert hex color to PDFKit-compatible rgb array */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

/** Sanitize text to prevent injection issues */
function sanitize(text) {
  if (typeof text !== 'string') return String(text || '');
  return text.replace(/[<>]/g, '').trim();
}

/** Add header/footer to every page */
function addPageTemplate(doc, options) {
  const { header, footer, pageNum, totalPages, watermark } = options;

  if (watermark && watermark.text) {
    doc.save();
    doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] });
    const rgb = hexToRgb(watermark.color || '#CCCCCC');
    doc.fillColor(rgb, watermark.opacity || 0.15)
       .fontSize(60)
       .font('Helvetica-Bold')
       .text(sanitize(watermark.text), 0, doc.page.height / 2 - 30, {
         align: 'center',
         width: doc.page.width,
       });
    doc.restore();
  }

  if (header) {
    doc.save();
    const rgb = hexToRgb(COLORS.primary);
    doc.rect(0, 0, doc.page.width, 50).fill(rgb);
    doc.fillColor(COLORS.white).fontSize(11).font('Helvetica-Bold')
       .text(sanitize(header.left || ''), 30, 17, { width: 200 });
    doc.fillColor(COLORS.white).fontSize(11).font('Helvetica')
       .text(sanitize(header.right || ''), doc.page.width - 230, 17, { width: 200, align: 'right' });
    doc.restore();
  }

  if (footer) {
    doc.save();
    const y = doc.page.height - 40;
    const rgb = hexToRgb(COLORS.dark);
    doc.rect(0, y, doc.page.width, 40).fill(rgb);
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica')
       .text(sanitize(footer.left || ''), 30, y + 12, { width: 200 });
    if (footer.pageNumbers) {
      doc.text(`Page ${pageNum} of ${totalPages}`, doc.page.width - 130, y + 12, { width: 100, align: 'right' });
    }
    doc.fillColor(COLORS.white).fontSize(9)
       .text(sanitize(footer.center || ''), 0, y + 12, { width: doc.page.width, align: 'center' });
    doc.restore();
  }
}

// ─── Table Renderer ────────────────────────────────────────────────────────────
function drawTable(doc, table, startX, startY) {
  const { headers = [], rows = [], colWidths } = table;
  const allCols = colWidths || headers.map(() => 100);
  const totalWidth = allCols.reduce((a, b) => a + b, 0);
  const rowHeight = 28;
  let y = startY;

  // Header row
  const headerRgb = hexToRgb(COLORS.primary);
  doc.rect(startX, y, totalWidth, rowHeight).fill(headerRgb);
  let x = startX;
  headers.forEach((h, i) => {
    doc.fillColor(COLORS.white).fontSize(10).font('Helvetica-Bold')
       .text(sanitize(String(h)), x + 6, y + 8, { width: allCols[i] - 12, ellipsis: true });
    x += allCols[i];
  });
  y += rowHeight;

  // Data rows
  rows.forEach((row, rowIdx) => {
    const bg = rowIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    const bgRgb = hexToRgb(bg);
    doc.rect(startX, y, totalWidth, rowHeight).fill(bgRgb).stroke('#E2E8F0');
    x = startX;
    row.forEach((cell, i) => {
      doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica')
         .text(sanitize(String(cell)), x + 6, y + 9, { width: allCols[i] - 12, ellipsis: true });
      x += allCols[i];
    });
    y += rowHeight;
  });

  return y; // return final Y position
}

// ─── QR Code Generator ─────────────────────────────────────────────────────────
async function generateQRBuffer(text) {
  return await QRCode.toBuffer(text, {
    errorCorrectionLevel: 'M',
    type: 'png',
    margin: 1,
    color: { dark: '#1E293B', light: '#FFFFFF' },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: CUSTOM DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
async function generateCustomPDF(data, outputPath) {
  return new Promise(async (resolve, reject) => {
    const {
      title = 'Document',
      subtitle = '',
      paragraphs = [],
      tables = [],
      images = [],
      header,
      footer,
      watermark,
      qrCode,
      signature = false,
      fontSize = 12,
      fontColor = COLORS.dark,
    } = data;

    const doc = new PDFDocument({ margin: 60, size: 'A4', bufferPages: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const topMargin = header ? 70 : 60;
    doc.y = topMargin;

    // Title
    const primaryRgb = hexToRgb(COLORS.primary);
    doc.rect(0, topMargin - 10, doc.page.width, 3).fill(primaryRgb);
    doc.moveDown(0.5);
    doc.fillColor(COLORS.dark).fontSize(26).font('Helvetica-Bold')
       .text(sanitize(title), { align: 'center' });

    if (subtitle) {
      doc.fillColor(COLORS.medium).fontSize(13).font('Helvetica')
         .text(sanitize(subtitle), { align: 'center' });
    }

    doc.moveDown(1.5);
    doc.rect(60, doc.y, doc.page.width - 120, 2).fill(hexToRgb(COLORS.light));
    doc.moveDown(0.5);

    // Paragraphs
    paragraphs.forEach(p => {
      const content = typeof p === 'string' ? p : p.text || '';
      const style = typeof p === 'object' ? p : {};
      if (style.heading) {
        doc.fillColor(COLORS.primary).fontSize(14).font('Helvetica-Bold')
           .text(sanitize(content));
        doc.moveDown(0.3);
      } else {
        doc.fillColor(hexToRgb(style.color || fontColor))
           .fontSize(style.fontSize || fontSize)
           .font(style.bold ? 'Helvetica-Bold' : style.italic ? 'Helvetica-Oblique' : 'Helvetica')
           .text(sanitize(content), { align: style.align || 'left', lineGap: 4 });
        doc.moveDown(0.7);
      }
    });

    // Tables
    tables.forEach(table => {
      doc.moveDown(0.5);
      const endY = drawTable(doc, table, 60, doc.y);
      doc.y = endY + 10;
      doc.moveDown(0.5);
    });

    // QR Code
    if (qrCode && qrCode.text) {
      const qrBuf = await generateQRBuffer(qrCode.text);
      doc.moveDown(0.5);
      doc.image(qrBuf, 60, doc.y, { width: 80, height: 80 });
      doc.fontSize(8).fillColor(COLORS.medium)
         .text(sanitize(qrCode.label || qrCode.text), 150, doc.y - 80, { width: 200 });
      doc.moveDown(4);
    }

    // Signature placeholder
    if (signature) {
      doc.moveDown(1);
      const sigY = doc.y;
      doc.rect(60, sigY, 200, 50).dash(4).stroke(hexToRgb(COLORS.medium));
      doc.fillColor(COLORS.medium).fontSize(9)
         .text('Authorized Signature', 60, sigY + 55);
      doc.rect(280, sigY, 200, 50).dash(4).stroke(hexToRgb(COLORS.medium));
      doc.text('Date', 280, sigY + 55);
    }

    // Finalize pages
    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      addPageTemplate(doc, { header, footer, watermark, pageNum: i + 1, totalPages });
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: RESUME
// ═══════════════════════════════════════════════════════════════════════════════
async function generateResumePDF(data, outputPath) {
  return new Promise(async (resolve, reject) => {
    const {
      name = 'Your Name',
      title: jobTitle = 'Software Engineer',
      email = '', phone = '', location = '', website = '', linkedin = '',
      summary = '',
      skills = [],
      experience = [],
      education = [],
      projects = [],
      watermark,
    } = data;

    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const W = doc.page.width;
    const sidebarW = 190;
    const contentX = sidebarW + 20;
    const contentW = W - contentX - 50;

    // ── Sidebar ──
    const sideRgb = hexToRgb(COLORS.dark);
    doc.rect(0, 0, sidebarW, doc.page.height).fill(sideRgb);

    // Avatar circle
    const cx = sidebarW / 2, cy = 90;
    doc.circle(cx, cy, 45).fill(hexToRgb(COLORS.primary));
    doc.fillColor(COLORS.white).fontSize(28).font('Helvetica-Bold')
       .text(name.charAt(0).toUpperCase(), cx - 14, cy - 16);

    // Contact info in sidebar
    let sy = 150;
    const sideText = (text, bold = false, size = 9) => {
      doc.fillColor(COLORS.white).fontSize(size)
         .font(bold ? 'Helvetica-Bold' : 'Helvetica')
         .text(sanitize(text), 15, sy, { width: sidebarW - 30, align: 'center' });
      sy += size + 5;
    };

    sideText(name, true, 14); sy += 4;
    sideText(jobTitle, false, 10); sy += 10;

    const contacts = [email, phone, location, website, linkedin].filter(Boolean);
    contacts.forEach(c => { sideText(c); sy += 2; });

    // Skills section in sidebar
    if (skills.length) {
      sy += 15;
      doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
         .text('SKILLS', 15, sy, { width: sidebarW - 30, align: 'left' });
      sy += 16;
      doc.rect(15, sy, sidebarW - 30, 1).fill(hexToRgb(COLORS.medium));
      sy += 8;
      const skillList = Array.isArray(skills) ? skills : skills.split(',');
      skillList.forEach(skill => {
        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica')
           .text(`• ${sanitize(skill.trim())}`, 15, sy, { width: sidebarW - 30 });
        sy += 13;
      });
    }

    // ── Main Content ──
    const sectionTitle = (text, y) => {
      doc.fillColor(COLORS.primary).fontSize(13).font('Helvetica-Bold')
         .text(text, contentX, y);
      doc.rect(contentX, y + 17, contentW, 1.5).fill(hexToRgb(COLORS.primary));
      return y + 25;
    };

    let cy2 = 50;

    // Summary
    if (summary) {
      cy2 = sectionTitle('PROFESSIONAL SUMMARY', cy2);
      cy2 += 4;
      doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica')
         .text(sanitize(summary), contentX, cy2, { width: contentW, lineGap: 3 });
      cy2 = doc.y + 12;
    }

    // Experience
    if (experience.length) {
      cy2 = sectionTitle('WORK EXPERIENCE', cy2);
      cy2 += 4;
      experience.forEach(exp => {
        doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica-Bold')
           .text(sanitize(exp.role || ''), contentX, cy2, { width: contentW });
        cy2 += 14;
        doc.fillColor(COLORS.primary).fontSize(9.5).font('Helvetica')
           .text(`${sanitize(exp.company || '')}  •  ${sanitize(exp.period || '')}`, contentX, cy2);
        cy2 += 14;
        if (exp.description) {
          const bullets = Array.isArray(exp.description) ? exp.description : [exp.description];
          bullets.forEach(b => {
            doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica')
               .text(`• ${sanitize(b)}`, contentX + 8, cy2, { width: contentW - 8 });
            cy2 = doc.y + 2;
          });
        }
        cy2 += 10;
      });
    }

    // Education
    if (education.length) {
      cy2 = sectionTitle('EDUCATION', cy2);
      cy2 += 4;
      education.forEach(edu => {
        doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica-Bold')
           .text(sanitize(edu.degree || ''), contentX, cy2, { width: contentW });
        cy2 += 14;
        doc.fillColor(COLORS.primary).fontSize(9.5).font('Helvetica')
           .text(`${sanitize(edu.school || '')}  •  ${sanitize(edu.year || '')}`, contentX, cy2);
        cy2 += 18;
      });
    }

    // Projects
    if (projects.length) {
      cy2 = sectionTitle('PROJECTS', cy2);
      cy2 += 4;
      projects.forEach(proj => {
        doc.fillColor(COLORS.dark).fontSize(10.5).font('Helvetica-Bold')
           .text(sanitize(proj.name || ''), contentX, cy2, { width: contentW });
        cy2 += 13;
        if (proj.description) {
          doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica')
             .text(sanitize(proj.description), contentX + 8, cy2, { width: contentW - 8 });
          cy2 = doc.y + 10;
        }
      });
    }

    // Watermark
    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;
    if (watermark && watermark.text) {
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        addPageTemplate(doc, { watermark, pageNum: i + 1, totalPages });
      }
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: INVOICE
// ═══════════════════════════════════════════════════════════════════════════════
async function generateInvoicePDF(data, outputPath) {
  return new Promise(async (resolve, reject) => {
    const {
      invoiceNumber = 'INV-001',
      date = new Date().toLocaleDateString(),
      dueDate = '',
      company = {}, client = {},
      items = [],
      notes = '',
      taxRate = 0,
      watermark,
      qrCode,
    } = data;

    const doc = new PDFDocument({ margin: 60, size: 'A4', bufferPages: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const W = doc.page.width;

    // Header banner
    doc.rect(0, 0, W, 100).fill(hexToRgb(COLORS.dark));

    doc.fillColor(COLORS.white).fontSize(32).font('Helvetica-Bold')
       .text('INVOICE', 60, 28);
    doc.fillColor(COLORS.primary).fontSize(13).font('Helvetica')
       .text(`#${sanitize(invoiceNumber)}`, 60, 64);

    // Company info (right side of header)
    doc.fillColor(COLORS.white).fontSize(10).font('Helvetica-Bold')
       .text(sanitize(company.name || 'Your Company'), W - 260, 25, { width: 200, align: 'right' });
    ['address', 'email', 'phone', 'website'].forEach((k, i) => {
      if (company[k]) {
        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica')
           .text(sanitize(company[k]), W - 260, 40 + i * 13, { width: 200, align: 'right' });
      }
    });

    let y = 120;

    // Bill To / Invoice Details row
    doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica-Bold')
       .text('BILL TO', 60, y);
    doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica-Bold')
       .text('INVOICE DETAILS', W / 2, y, { width: W / 2 - 60, align: 'right' });
    y += 15;

    doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica-Bold')
       .text(sanitize(client.name || ''), 60, y);
    y += 15;
    ['address', 'email', 'phone'].forEach(k => {
      if (client[k]) {
        doc.fillColor(COLORS.medium).fontSize(9.5).font('Helvetica')
           .text(sanitize(client[k]), 60, y);
        y += 13;
      }
    });

    let detailY = 135;
    const details = [
      ['Date:', date],
      ['Due Date:', dueDate || '—'],
      ['Payment:', 'Bank Transfer / Card'],
    ];
    details.forEach(([label, val]) => {
      doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica').text(label, W - 240, detailY);
      doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica-Bold').text(val, W - 140, detailY);
      detailY += 15;
    });

    y = Math.max(y, detailY) + 20;

    // Items table
    const colX = [60, 240, 340, 410, 480];
    const headers = ['Description', 'Qty', 'Unit Price', 'Tax', 'Amount'];
    const colW =    [180, 100, 70, 70, 80];

    doc.rect(60, y, W - 120, 28).fill(hexToRgb(COLORS.dark));
    headers.forEach((h, i) => {
      doc.fillColor(COLORS.white).fontSize(9.5).font('Helvetica-Bold')
         .text(h, colX[i], y + 9, { width: colW[i], align: i === 0 ? 'left' : 'right' });
    });
    y += 28;

    let subtotal = 0;
    items.forEach((item, idx) => {
      const qty = parseFloat(item.qty || 1);
      const unit = parseFloat(item.price || 0);
      const amount = qty * unit;
      subtotal += amount;

      const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(60, y, W - 120, 26).fill(hexToRgb(bg));
      doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica')
         .text(sanitize(item.description || ''), colX[0], y + 8, { width: colW[0] });
      doc.text(String(qty), colX[1], y + 8, { width: colW[1], align: 'right' });
      doc.text(`$${unit.toFixed(2)}`, colX[2], y + 8, { width: colW[2], align: 'right' });
      doc.text(`${taxRate}%`, colX[3], y + 8, { width: colW[3], align: 'right' });
      doc.font('Helvetica-Bold')
         .text(`$${amount.toFixed(2)}`, colX[4], y + 8, { width: colW[4], align: 'right' });
      y += 26;
    });

    y += 15;
    const tax = subtotal * (parseFloat(taxRate) / 100);
    const total = subtotal + tax;

    const totalRows = [
      ['Subtotal', `$${subtotal.toFixed(2)}`],
      [`Tax (${taxRate}%)`, `$${tax.toFixed(2)}`],
    ];
    totalRows.forEach(([label, val]) => {
      doc.fillColor(COLORS.medium).fontSize(10).font('Helvetica')
         .text(label, W - 220, y, { width: 100, align: 'right' });
      doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica')
         .text(val, W - 110, y, { width: 50, align: 'right' });
      y += 16;
    });

    // Total box
    doc.rect(W - 230, y, 170, 32).fill(hexToRgb(COLORS.primary));
    doc.fillColor(COLORS.white).fontSize(13).font('Helvetica-Bold')
       .text('TOTAL', W - 225, y + 9, { width: 80 });
    doc.text(`$${total.toFixed(2)}`, W - 130, y + 9, { width: 90, align: 'right' });
    y += 50;

    // QR Code
    if (qrCode && qrCode.text) {
      const qrBuf = await generateQRBuffer(qrCode.text);
      doc.image(qrBuf, 60, y, { width: 70, height: 70 });
      doc.fillColor(COLORS.medium).fontSize(8).text('Scan to pay or verify', 60, y + 72, { width: 70, align: 'center' });
    }

    // Notes
    if (notes) {
      doc.fillColor(COLORS.medium).fontSize(9).font('Helvetica-Bold')
         .text('NOTES', 160, y);
      doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica')
         .text(sanitize(notes), 160, y + 14, { width: W - 220 });
    }

    // Footer bar
    doc.rect(0, doc.page.height - 40, W, 40).fill(hexToRgb(COLORS.dark));
    doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
       .text('Thank you for your business!', 0, doc.page.height - 25, { align: 'center', width: W });

    // Watermark
    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;
    if (watermark && watermark.text) {
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        addPageTemplate(doc, { watermark, pageNum: i + 1, totalPages });
      }
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: CERTIFICATE
// ═══════════════════════════════════════════════════════════════════════════════
async function generateCertificatePDF(data, outputPath) {
  return new Promise(async (resolve, reject) => {
    const {
      recipientName = 'John Doe',
      certificateTitle = 'Certificate of Achievement',
      course = '',
      issuer = '',
      date = new Date().toLocaleDateString(),
      description = '',
      watermark,
      qrCode,
    } = data;

    const doc = new PDFDocument({ margin: 0, size: 'A4', layout: 'landscape', bufferPages: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const W = doc.page.width;
    const H = doc.page.height;

    // Background gradient simulation
    doc.rect(0, 0, W, H).fill(hexToRgb('#FFFBF0'));

    // Decorative border layers
    doc.rect(20, 20, W - 40, H - 40).lineWidth(3).stroke(hexToRgb(COLORS.gold));
    doc.rect(30, 30, W - 60, H - 60).lineWidth(1).stroke(hexToRgb(COLORS.gold));

    // Top decorative band
    doc.rect(30, 30, W - 60, 8).fill(hexToRgb(COLORS.gold));
    doc.rect(30, H - 38, W - 60, 8).fill(hexToRgb(COLORS.gold));

    // Corner ornaments
    const ornamentCorners = [[40, 40], [W - 80, 40], [40, H - 80], [W - 80, H - 80]];
    ornamentCorners.forEach(([cx, cy]) => {
      doc.circle(cx + 20, cy + 20, 14).lineWidth(2).stroke(hexToRgb(COLORS.gold));
      doc.circle(cx + 20, cy + 20, 7).fill(hexToRgb(COLORS.gold));
    });

    // Star decorations
    doc.fillColor(hexToRgb(COLORS.gold)).fontSize(24)
       .text('★', W / 2 - 80, 48, { width: 50, align: 'center' })
       .text('★', W / 2, 48, { width: 50, align: 'center' })
       .text('★', W / 2 + 80, 48, { width: 50, align: 'center' });

    // Certificate of text
    doc.fillColor(COLORS.medium).fontSize(14).font('Helvetica')
       .text('This is to certify that', 0, 95, { align: 'center', width: W });

    // Recipient name
    doc.fillColor(COLORS.dark).fontSize(44).font('Helvetica-Bold')
       .text(sanitize(recipientName), 0, 115, { align: 'center', width: W });

    // Decorative line under name
    const lineY = 170;
    doc.rect(W / 2 - 180, lineY, 360, 2).fill(hexToRgb(COLORS.gold));

    doc.fillColor(COLORS.medium).fontSize(13).font('Helvetica')
       .text('has successfully completed', 0, 183, { align: 'center', width: W });

    doc.fillColor(COLORS.primary).fontSize(22).font('Helvetica-Bold')
       .text(sanitize(course || certificateTitle), 0, 203, { align: 'center', width: W });

    if (description) {
      doc.fillColor(COLORS.medium).fontSize(11).font('Helvetica')
         .text(sanitize(description), 100, 233, { align: 'center', width: W - 200 });
    }

    // QR Code
    if (qrCode && qrCode.text) {
      const qrBuf = await generateQRBuffer(qrCode.text);
      doc.image(qrBuf, W / 2 - 35, H - 140, { width: 70, height: 70 });
    }

    // Signature lines
    const sigY = H - 120;
    doc.rect(80, sigY, 160, 1).fill(hexToRgb(COLORS.dark));
    doc.rect(W - 240, sigY, 160, 1).fill(hexToRgb(COLORS.dark));

    doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica-Bold')
       .text(sanitize(issuer || 'Director'), 80, sigY + 6, { width: 160, align: 'center' });
    doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica-Bold')
       .text(sanitize(date), W - 240, sigY + 6, { width: 160, align: 'center' });

    doc.fillColor(COLORS.medium).fontSize(8.5).font('Helvetica')
       .text('Authorized Signatory', 80, sigY + 20, { width: 160, align: 'center' })
       .text('Date of Issue', W - 240, sigY + 20, { width: 160, align: 'center' });

    // Watermark
    if (watermark && watermark.text) {
      const pageRange = doc.bufferedPageRange();
      for (let i = 0; i < pageRange.count; i++) {
        doc.switchToPage(i);
        addPageTemplate(doc, { watermark, pageNum: i + 1, totalPages: pageRange.count });
      }
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: REPORT
// ═══════════════════════════════════════════════════════════════════════════════
async function generateReportPDF(data, outputPath) {
  return new Promise(async (resolve, reject) => {
    const {
      title = 'Business Report',
      subtitle = '',
      author = '',
      date = new Date().toLocaleDateString(),
      sections = [],
      tables = [],
      watermark,
      qrCode,
    } = data;

    const doc = new PDFDocument({ margin: 60, size: 'A4', bufferPages: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const W = doc.page.width;

    // Cover page
    doc.rect(0, 0, W, 220).fill(hexToRgb(COLORS.dark));
    doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica')
       .text('BUSINESS REPORT', 60, 60, { letterSpacing: 4 });
    doc.fillColor(COLORS.white).fontSize(32).font('Helvetica-Bold')
       .text(sanitize(title), 60, 85, { width: W - 120 });
    if (subtitle) {
      doc.fillColor('#94A3B8').fontSize(14).font('Helvetica')
         .text(sanitize(subtitle), 60, 140, { width: W - 120 });
    }
    doc.fillColor('#64748B').fontSize(10).font('Helvetica')
       .text(`${sanitize(author ? `By ${author}  •  ` : '')}${date}`, 60, 175, { width: W - 120 });

    // Accent stripe
    doc.rect(0, 218, W, 4).fill(hexToRgb(COLORS.primary));

    let y = 250;

    sections.forEach((section, idx) => {
      // Section heading
      doc.fillColor(COLORS.primary).fontSize(14).font('Helvetica-Bold')
         .text(sanitize(section.title || `Section ${idx + 1}`), 60, y);
      y = doc.y + 4;
      doc.rect(60, y, W - 120, 1.5).fill(hexToRgb(COLORS.primary));
      y += 10;

      if (section.content) {
        doc.fillColor(COLORS.dark).fontSize(10.5).font('Helvetica')
           .text(sanitize(section.content), 60, y, { width: W - 120, lineGap: 4 });
        y = doc.y + 14;
      }

      if (section.table) {
        const endY = drawTable(doc, section.table, 60, y);
        y = endY + 16;
      }

      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 60;
      }
    });

    // Tables at bottom
    tables.forEach(table => {
      doc.moveDown(0.5);
      drawTable(doc, table, 60, doc.y);
    });

    // QR Code
    if (qrCode && qrCode.text) {
      doc.addPage();
      const qrBuf = await generateQRBuffer(qrCode.text);
      doc.image(qrBuf, 60, 60, { width: 80, height: 80 });
      doc.fillColor(COLORS.medium).fontSize(9)
         .text(sanitize(qrCode.label || 'Scan for more info'), 60, 145, { width: 80, align: 'center' });
    }

    const pageRange = doc.bufferedPageRange();
    const totalPages = pageRange.count;

    const header = { left: sanitize(title), right: date };
    const footer = { left: sanitize(author || ''), center: '© Smart PDF Generator', pageNumbers: true };

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      addPageTemplate(doc, { header, footer, watermark, pageNum: i + 1, totalPages });
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

module.exports = {
  generateCustomPDF,
  generateResumePDF,
  generateInvoicePDF,
  generateCertificatePDF,
  generateReportPDF,
};
