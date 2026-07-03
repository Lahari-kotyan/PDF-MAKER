/**
 * Input Validation Middleware
 * ===========================
 * Validates and sanitizes all incoming PDF generation requests.
 */

const MAX_TEXT_LENGTH = 10000;
const MAX_ITEMS = 100;

function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function sanitizeString(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str.substring(0, maxLength).replace(/[<>]/g, '').trim();
}

/**
 * Validate Custom PDF payload
 */
function validateCustomPDF(req, res, next) {
  const { title, paragraphs, tables } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
  }
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be under 200 characters.' });
  }

  if (paragraphs && !Array.isArray(paragraphs)) {
    return res.status(400).json({ error: 'paragraphs must be an array.' });
  }

  if (paragraphs && paragraphs.length > MAX_ITEMS) {
    return res.status(400).json({ error: `Maximum ${MAX_ITEMS} paragraphs allowed.` });
  }

  if (tables && !Array.isArray(tables)) {
    return res.status(400).json({ error: 'tables must be an array.' });
  }

  next();
}

/**
 * Validate Resume PDF payload
 */
function validateResumePDF(req, res, next) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Recipient name is required.' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  next();
}

/**
 * Validate Invoice PDF payload
 */
function validateInvoicePDF(req, res, next) {
  const { items, taxRate } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one invoice item is required.' });
  }

  if (items.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 invoice items allowed.' });
  }

  for (const item of items) {
    if (!item.description) {
      return res.status(400).json({ error: 'Each item must have a description.' });
    }
    if (isNaN(parseFloat(item.price)) || parseFloat(item.price) < 0) {
      return res.status(400).json({ error: 'Item price must be a non-negative number.' });
    }
  }

  if (taxRate !== undefined && (isNaN(parseFloat(taxRate)) || parseFloat(taxRate) < 0 || parseFloat(taxRate) > 100)) {
    return res.status(400).json({ error: 'Tax rate must be between 0 and 100.' });
  }

  next();
}

/**
 * Validate Certificate PDF payload
 */
function validateCertificatePDF(req, res, next) {
  const { recipientName } = req.body;

  if (!recipientName || typeof recipientName !== 'string' || recipientName.trim().length === 0) {
    return res.status(400).json({ error: 'Recipient name is required.' });
  }

  if (recipientName.length > 100) {
    return res.status(400).json({ error: 'Recipient name must be under 100 characters.' });
  }

  next();
}

module.exports = {
  validateCustomPDF,
  validateResumePDF,
  validateInvoicePDF,
  validateCertificatePDF,
  sanitizeString,
};
