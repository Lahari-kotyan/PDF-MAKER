/**
 * Templates API Routes
 * ====================
 * Returns pre-built sample data for each PDF template type,
 * so users can quickly generate demo PDFs.
 */

const express = require('express');
const router = express.Router();

const TEMPLATES = {
  resume: {
    name: 'Alex Johnson',
    title: 'Senior Full Stack Developer',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    summary: 'Passionate Full Stack Developer with 7+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architectures. Led cross-functional teams to deliver high-impact products serving millions of users.',
    skills: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js & Express', 'Python & Django', 'PostgreSQL & MongoDB', 'AWS & GCP', 'Docker & Kubernetes', 'GraphQL & REST APIs', 'CI/CD & DevOps', 'Agile / Scrum'],
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        period: 'Jan 2021 – Present',
        description: [
          'Architected microservices system reducing latency by 40%',
          'Led a team of 6 engineers to deliver 3 major product features',
          'Improved test coverage from 45% to 92% across all services',
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'StartupXYZ',
        period: 'Mar 2018 – Dec 2020',
        description: [
          'Built real-time dashboard serving 500K+ daily active users',
          'Reduced page load time by 60% through code splitting and lazy loading',
        ],
      },
    ],
    education: [
      { degree: 'B.Sc. Computer Science', school: 'UC Berkeley', year: '2018' },
    ],
    projects: [
      { name: 'OpenFlow — Open Source API Gateway', description: 'GitHub: 2.4K stars. A lightweight API gateway with rate limiting, caching, and authentication.' },
      { name: 'DataViz Pro', description: 'Interactive data visualization library with 30+ chart types. Used by 200+ teams.' },
    ],
  },

  invoice: {
    invoiceNumber: 'INV-2024-0042',
    date: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
    company: {
      name: 'Acme Solutions Ltd.',
      address: '123 Business Ave, Suite 400, New York, NY 10001',
      email: 'billing@acmesolutions.com',
      phone: '+1 (800) 555-0100',
      website: 'acmesolutions.com',
    },
    client: {
      name: 'Globex Corporation',
      address: '456 Corporate Blvd, Chicago, IL 60601',
      email: 'accounts@globex.com',
      phone: '+1 (312) 555-0200',
    },
    items: [
      { description: 'Web Application Development (40 hrs)', qty: 40, price: 125 },
      { description: 'UI/UX Design & Prototyping (20 hrs)', qty: 20, price: 95 },
      { description: 'Cloud Infrastructure Setup', qty: 1, price: 800 },
      { description: 'QA Testing & Bug Fixes', qty: 15, price: 80 },
      { description: 'Monthly Maintenance & Support', qty: 1, price: 500 },
    ],
    taxRate: 8.5,
    notes: 'Payment is due within 30 days. Please include the invoice number in your payment reference. Bank transfer or card payments accepted. Late payments may incur a 1.5% monthly fee.',
    qrCode: { text: 'https://pay.acmesolutions.com/inv/2024-0042', label: 'Pay Online' },
  },

  certificate: {
    recipientName: 'Sarah Mitchell',
    certificateTitle: 'Certificate of Excellence',
    course: 'Advanced Machine Learning & AI Engineering',
    issuer: 'Dr. James Carter, Ph.D.',
    date: new Date().toLocaleDateString(),
    description: 'For outstanding performance and successful completion of the 12-week intensive program, demonstrating exceptional skills in neural networks, deep learning, and model deployment.',
    qrCode: { text: 'https://verify.academy.com/cert/CERT-2024-SM-9872', label: 'Verify Certificate' },
  },

  report: {
    title: 'Q4 2024 Business Performance Report',
    subtitle: 'Executive Summary & Strategic Analysis',
    author: 'Analytics Team',
    date: new Date().toLocaleDateString(),
    sections: [
      {
        title: '1. Executive Summary',
        content: 'Q4 2024 demonstrated exceptional growth across all key performance indicators. Revenue surpassed targets by 23%, customer acquisition increased by 41%, and net promoter score reached an all-time high of 72. The strategic investments made in product development and marketing during Q3 have begun to yield significant returns.',
      },
      {
        title: '2. Revenue Performance',
        content: 'Total revenue for Q4 reached $4.7M, a 31% increase year-over-year. Subscription revenue accounted for 68% of total revenue, while professional services contributed 22% and one-time license fees 10%. The APAC region showed the strongest growth at 52% YoY.',
        table: {
          headers: ['Region', 'Q4 Revenue', 'YoY Growth', 'Target', 'Status'],
          rows: [
            ['North America', '$2,200,000', '+18%', '$2,000,000', '✓ Met'],
            ['Europe', '$1,100,000', '+24%', '$1,050,000', '✓ Met'],
            ['APAC', '$980,000', '+52%', '$800,000', '✓ Exceeded'],
            ['Latin America', '$420,000', '+15%', '$450,000', '⚠ Below'],
          ],
          colWidths: [110, 100, 90, 100, 80],
        },
      },
      {
        title: '3. Customer Metrics',
        content: 'Customer acquisition cost (CAC) decreased by 18% due to improved marketing efficiency and enhanced referral programs. Monthly Recurring Revenue (MRR) grew to $1.56M with a churn rate of only 2.1%, well below the industry average of 5.2%. Total active customers reached 8,420 as of December 31, 2024.',
      },
      {
        title: '4. Strategic Outlook for Q1 2025',
        content: 'The company is well-positioned for continued growth in 2025. Key initiatives include the launch of the AI-powered analytics module in February, expansion into 3 new APAC markets, and the partnership program targeting 50 new resellers. Revenue guidance for Q1 2025 is set at $5.2M–$5.6M.',
      },
    ],
    watermark: { text: 'CONFIDENTIAL', color: '#DC2626', opacity: 0.08 },
    qrCode: { text: 'https://reports.company.com/q4-2024', label: 'View Online Report' },
  },
};

// ─── GET /api/templates/list ───────────────────────────────────────────────────
router.get('/list', (req, res) => {
  res.json({
    success: true,
    templates: [
      { id: 'custom', name: 'Custom Document', icon: '📄', description: 'Create a custom document with your own content, tables, and formatting.' },
      { id: 'resume', name: 'Professional Resume', icon: '👤', description: 'Generate a stunning resume with work history, skills, and projects.' },
      { id: 'invoice', name: 'Business Invoice', icon: '🧾', description: 'Create professional invoices with itemized billing and tax calculation.' },
      { id: 'certificate', name: 'Achievement Certificate', icon: '🎓', description: 'Generate beautiful certificates with decorative borders and QR verification.' },
      { id: 'report', name: 'Business Report', icon: '📊', description: 'Produce comprehensive business reports with charts, tables, and sections.' },
    ],
  });
});

// ─── GET /api/templates/:type ──────────────────────────────────────────────────
router.get('/:type', (req, res) => {
  const { type } = req.params;
  if (!TEMPLATES[type]) {
    return res.status(404).json({ error: `Template "${type}" not found.` });
  }
  res.json({ success: true, template: TEMPLATES[type] });
});

module.exports = router;
