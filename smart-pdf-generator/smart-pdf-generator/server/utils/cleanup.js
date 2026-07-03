/**
 * File Cleanup Utility
 * ====================
 * Automatically removes generated PDFs older than the configured
 * TTL to prevent disk usage from accumulating.
 */

const fs   = require('fs');
const path = require('path');

const OUTPUT_DIR  = path.join(__dirname, '../../generated_pdfs');
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

/** Time-to-live for generated files in milliseconds (default: 1 hour) */
const FILE_TTL_MS = (parseInt(process.env.PDF_CLEANUP_INTERVAL) || 60) * 60 * 1000;

/**
 * Remove files from a directory that are older than FILE_TTL_MS.
 * Ignores hidden files (e.g. .gitkeep).
 * @param {string} dir  - Directory path to clean
 * @returns {number}    - Number of files deleted
 */
function cleanDirectory(dir) {
  if (!fs.existsSync(dir)) return 0;

  const now = Date.now();
  let deleted = 0;

  fs.readdirSync(dir).forEach(filename => {
    if (filename.startsWith('.')) return; // skip hidden files

    const filePath = path.join(dir, filename);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile() && now - stat.mtimeMs > FILE_TTL_MS) {
        fs.unlinkSync(filePath);
        deleted++;
      }
    } catch (err) {
      // File may have been removed already; ignore
    }
  });

  return deleted;
}

/**
 * Run a full cleanup cycle on all output directories.
 * Logs a summary of deleted files.
 */
function runCleanup() {
  const pdfCount     = cleanDirectory(OUTPUT_DIR);
  const uploadCount  = cleanDirectory(UPLOADS_DIR);
  const total        = pdfCount + uploadCount;

  if (total > 0) {
    console.log(`[Cleanup] Removed ${pdfCount} PDF(s) and ${uploadCount} upload(s).`);
  }
}

/**
 * Start the periodic cleanup scheduler.
 * Runs every PDF_CLEANUP_INTERVAL minutes (default: 60).
 */
function startCleanupScheduler() {
  const intervalMs = FILE_TTL_MS;
  setInterval(runCleanup, intervalMs);
  console.log(`[Cleanup] Scheduler started — runs every ${intervalMs / 60000}min`);
}

module.exports = { cleanDirectory, runCleanup, startCleanupScheduler };
