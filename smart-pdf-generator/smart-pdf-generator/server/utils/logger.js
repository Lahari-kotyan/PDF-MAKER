/**
 * Logger Utility
 * ==============
 * Lightweight structured logger with timestamps,
 * log levels, and colored console output.
 */

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO:  '\x1b[32m', // Green
  WARN:  '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m',
};

const currentLevel = LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LEVELS.INFO;

function log(level, message, meta = {}) {
  if (LEVELS[level] < currentLevel) return;

  const timestamp = new Date().toISOString();
  const color = COLORS[level] || COLORS.RESET;
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

  console.log(`${color}[${level}]${COLORS.RESET} ${timestamp} — ${message}${metaStr}`);
}

const logger = {
  debug: (msg, meta) => log('DEBUG', msg, meta),
  info:  (msg, meta) => log('INFO',  msg, meta),
  warn:  (msg, meta) => log('WARN',  msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),

  /** Log an incoming HTTP request */
  request: (req) => log('INFO', `${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    ua: req.headers['user-agent']?.substring(0, 60),
  }),

  /** Log a PDF generation event */
  pdf: (template, filename, sizeBytes) => log('INFO', `PDF generated: ${template}`, {
    file: filename,
    size: `${Math.round(sizeBytes / 1024)}KB`,
  }),
};

module.exports = logger;
