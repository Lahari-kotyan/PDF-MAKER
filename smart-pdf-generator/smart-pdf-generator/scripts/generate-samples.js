#!/usr/bin/env node
/**
 * generate-samples.js
 * ===================
 * Generates all 5 sample PDFs to the generated_pdfs/ directory.
 * Run with: node scripts/generate-samples.js
 *
 * Useful for:
 *   - Testing the PDF engine without starting the HTTP server
 *   - Creating sample PDFs for README screenshots
 *   - CI/CD smoke tests
 */

require('dotenv').config();
const path = require('path');
const fs   = require('fs');

const {
  generateCustomPDF,
  generateResumePDF,
  generateInvoicePDF,
  generateCertificatePDF,
  generateReportPDF,
} = require('../server/utils/pdfGenerator');

const OUT = path.join(__dirname, '../generated_pdfs');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const samples = [
  {
    name: 'sample-custom-document.pdf',
    generator: generateCustomPDF,
    data: {
      title: 'Smart PDF Generator — Feature Overview',
      subtitle: 'Complete documentation of capabilities',
      fontSize: 11,
      paragraphs: [
        { text: 'Introduction', heading: true },
        { text: 'Smart PDF Generator is a production-ready, full-stack PDF creation platform built with Node.js, Express, and PDFKit. It supports 5 professional templates, real-time preview, watermarks, QR codes, and digital signatures.', align: 'justify' },
        { text: 'Supported Features', heading: true },
        { text: 'The platform supports custom documents, professional resumes, business invoices, achievement certificates, and comprehensive business reports — all generated server-side in under 2 seconds.', align: 'left' },
      ],
      tables: [{
        headers: ['Feature', 'Status', 'Version'],
        rows: [
          ['Custom Documents', '✓ Complete', 'v1.0'],
          ['Resume Builder',   '✓ Complete', 'v1.0'],
          ['Invoice Generator','✓ Complete', 'v1.0'],
          ['Certificates',     '✓ Complete', 'v1.0'],
          ['Business Reports', '✓ Complete', 'v1.0'],
          ['QR Codes',         '✓ Complete', 'v1.0'],
          ['Watermarks',       '✓ Complete', 'v1.0'],
        ],
        colWidths: [180, 120, 80],
      }],
      header: { left: 'Smart PDF Generator', right: 'v1.0.0' },
      footer: { left: 'Confidential', center: '© 2024 Smart PDF Generator', pageNumbers: true },
      watermark: { text: 'SAMPLE', color: '#AAAAAA', opacity: 0.12 },
      signature: true,
    },
  },
  {
    name: 'sample-resume.pdf',
    generator: generateResumePDF,
    data: {
      name: 'Alexandra Johnson',
      title: 'Senior Full Stack Engineer',
      email: 'alex@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      website: 'alexjohnson.dev',
      linkedin: 'linkedin.com/in/alexjohnson',
      summary: 'Passionate Full Stack Developer with 7+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architectures. Led cross-functional teams to deliver high-impact products serving millions of users.',
      skills: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js & Express', 'Python', 'PostgreSQL & MongoDB', 'AWS & GCP', 'Docker & Kubernetes', 'CI/CD & DevOps'],
      experience: [
        {
          role: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          period: 'Jan 2021 – Present',
          description: ['Architected microservices reducing latency by 40%', 'Led a team of 6 engineers across 3 product launches', 'Improved test coverage from 45% to 92%'],
        },
        {
          role: 'Full Stack Developer',
          company: 'StartupXYZ',
          period: 'Mar 2018 – Dec 2020',
          description: ['Built real-time dashboard for 500K+ daily users', 'Reduced page load time by 60% via code splitting'],
        },
      ],
      education: [{ degree: 'B.Sc. Computer Science', school: 'UC Berkeley', year: '2018' }],
      projects: [
        { name: 'OpenFlow — Open Source API Gateway', description: 'GitHub: 2.4K stars. Lightweight API gateway with rate limiting and auth.' },
        { name: 'DataViz Pro', description: 'Interactive data visualization with 30+ chart types used by 200+ teams.' },
      ],
    },
  },
  {
    name: 'sample-invoice.pdf',
    generator: generateInvoicePDF,
    data: {
      invoiceNumber: 'INV-2024-0042',
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
      company: { name: 'Acme Solutions Ltd.', address: '123 Business Ave, Suite 400, New York, NY 10001', email: 'billing@acmesolutions.com', phone: '+1 (800) 555-0100' },
      client:  { name: 'Globex Corporation', address: '456 Corporate Blvd, Chicago, IL 60601', email: 'accounts@globex.com', phone: '+1 (312) 555-0200' },
      items: [
        { description: 'Web Application Development (40 hrs)', qty: 40, price: 125 },
        { description: 'UI/UX Design & Prototyping (20 hrs)', qty: 20, price: 95 },
        { description: 'Cloud Infrastructure Setup', qty: 1, price: 800 },
        { description: 'QA Testing & Bug Fixes', qty: 15, price: 80 },
        { description: 'Monthly Maintenance Support', qty: 1, price: 500 },
      ],
      taxRate: 8.5,
      notes: 'Payment due within 30 days. Please include invoice number in your reference. Late payments incur a 1.5% monthly fee.',
      qrCode: { text: 'https://pay.acmesolutions.com/inv/2024-0042', label: 'Pay Online' },
    },
  },
  {
    name: 'sample-certificate.pdf',
    generator: generateCertificatePDF,
    data: {
      recipientName: 'Dr. Sarah Mitchell',
      certificateTitle: 'Certificate of Excellence',
      course: 'Advanced Machine Learning & AI Engineering',
      issuer: 'Prof. James Carter, Ph.D.',
      date: new Date().toLocaleDateString(),
      description: 'For outstanding performance and successful completion of the 12-week intensive program, demonstrating exceptional skills in neural networks and model deployment.',
      qrCode: { text: 'https://verify.smartpdf.dev/cert/CERT-2024-SM-9872', label: 'Verify Certificate' },
    },
  },
  {
    name: 'sample-report.pdf',
    generator: generateReportPDF,
    data: {
      title: 'Q4 2024 Business Performance Report',
      subtitle: 'Executive Summary & Strategic Analysis',
      author: 'Analytics Team',
      date: new Date().toLocaleDateString(),
      sections: [
        { title: '1. Executive Summary', content: 'Q4 2024 demonstrated exceptional growth. Revenue surpassed targets by 23%, customer acquisition increased by 41%, and NPS reached an all-time high of 72.' },
        {
          title: '2. Revenue Performance',
          content: 'Total revenue reached $4.7M — a 31% YoY increase. Subscription revenue accounted for 68% of total.',
          table: {
            headers: ['Region', 'Q4 Revenue', 'YoY Growth', 'Target', 'Status'],
            rows: [
              ['North America', '$2,200,000', '+18%', '$2,000,000', '✓ Met'],
              ['Europe',        '$1,100,000', '+24%', '$1,050,000', '✓ Met'],
              ['APAC',          '$980,000',   '+52%', '$800,000',   '✓ Exceeded'],
              ['Latin America', '$420,000',   '+15%', '$450,000',   '⚠ Below'],
            ],
            colWidths: [110, 100, 90, 100, 80],
          },
        },
        { title: '3. Customer Metrics', content: 'CAC decreased 18%. MRR grew to $1.56M with churn rate of only 2.1%, well below industry average of 5.2%.' },
        { title: '4. Q1 2025 Outlook', content: 'Revenue guidance: $5.2M–$5.6M. Key initiatives: AI analytics module launch, 3 new APAC markets, 50 new resellers.' },
      ],
      watermark: { text: 'CONFIDENTIAL', color: '#DC2626', opacity: 0.07 },
      qrCode: { text: 'https://reports.company.com/q4-2024', label: 'View Online Report' },
    },
  },
];

async function run() {
  console.log('\n📄 Smart PDF Generator — Sample Generator');
  console.log('==========================================\n');

  let success = 0;
  let failed  = 0;

  for (const sample of samples) {
    const outPath = path.join(OUT, sample.name);
    const start = Date.now();
    try {
      await sample.generator(sample.data, outPath);
      const size = fs.statSync(outPath).size;
      const ms   = Date.now() - start;
      console.log(`✅  ${sample.name.padEnd(40)} ${(size / 1024).toFixed(1)}KB  ${ms}ms`);
      success++;
    } catch (err) {
      console.error(`❌  ${sample.name} — ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n==========================================`);
  console.log(`Generated: ${success}/${samples.length} PDFs  |  Failed: ${failed}`);
  console.log(`Output dir: ${OUT}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
