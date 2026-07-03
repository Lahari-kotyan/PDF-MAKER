/**
 * PDF Layout Templates
 * ====================
 * Reusable layout constants and page configuration objects.
 * Import these into pdfGenerator.js for consistent styling.
 */

const PAGE_SIZES = {
  A4:        [595.28, 841.89],
  LETTER:    [612,    792],
  LANDSCAPE: [841.89, 595.28],
};

const MARGINS = {
  DEFAULT:  { top: 60, bottom: 60, left: 60, right: 60 },
  TIGHT:    { top: 40, bottom: 40, left: 40, right: 40 },
  WIDE:     { top: 80, bottom: 80, left: 80, right: 80 },
  RESUME:   { top: 50, bottom: 50, left: 50, right: 50 },
  CERT:     { top: 0,  bottom: 0,  left: 0,  right: 0  },
};

const FONT_SIZES = {
  H1:      28,
  H2:      20,
  H3:      16,
  H4:      13,
  BODY:    11,
  SMALL:   9,
  CAPTION: 8,
};

const LINE_HEIGHTS = {
  TIGHT:   1.2,
  NORMAL:  1.5,
  RELAXED: 1.8,
};

module.exports = { PAGE_SIZES, MARGINS, FONT_SIZES, LINE_HEIGHTS };
