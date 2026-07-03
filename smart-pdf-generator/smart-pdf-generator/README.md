# 📄 Smart PDF Generator

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)

**A production-ready, full-stack PDF generation platform with 5 professional templates, dark mode UI, watermarks, QR codes, real-time preview, and instant download.**

[🚀 Live Demo](#) · [📖 API Docs](#api-reference) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 📸 Screenshots

> **Note:** Add actual screenshots here after running the application locally.

| Dashboard (Dark Mode) | Resume Template | Invoice Template |
|---|---|---|
| *screenshot-dashboard.png* | *screenshot-resume.png* | *screenshot-invoice.png* |

| Certificate Template | Business Report | PDF Preview Modal |
|---|---|---|
| *screenshot-certificate.png* | *screenshot-report.png* | *screenshot-preview.png* |

---

## 🌟 Features

### Core PDF Generation
- ✅ **Custom Document** — Full control over title, subtitle, paragraphs, tables, fonts, colors
- ✅ **Professional Resume** — Two-column layout with sidebar, skills, experience, education, projects
- ✅ **Business Invoice** — Itemized billing, tax calculation, totals, payment QR code
- ✅ **Achievement Certificate** — Landscape, gold borders, decorative styling
- ✅ **Business Report** — Multi-section reports with tables, cover page, header/footer

### Advanced Features
- 🔒 **Watermark Support** — Custom text, color, opacity control
- 📱 **QR Code Integration** — Embed scannable QR codes in any PDF
- ✍️ **Digital Signature Placeholder** — Dashed signature boxes with labels
- 📑 **Headers & Footers** — Custom text, page numbers, branding
- 🎨 **Multiple Templates** — 5 production-ready templates
- 👀 **Live PDF Preview** — Preview before downloading (iframe embed)
- 📥 **One-Click Download** — Direct PDF download from the preview modal
- 🔢 **Auto Page Numbers** — Tracks pages across multi-page documents
- 📊 **Dynamic Tables** — Striped rows, colored headers, column width control

### UI/UX
- 🌙 **Dark / Light Mode Toggle** — Full theme switching with CSS variables
- 📱 **Fully Responsive** — Mobile-first design, collapsible sidebar
- ✨ **Smooth Animations** — Fade-ins, hover effects, transitions
- 🔔 **Toast Notifications** — Success, error, warning, info toasts with auto-dismiss
- ⏳ **Loading Indicators** — Overlay spinner during PDF generation
- 🎭 **Sample Data Loader** — One-click "Load Sample" for every template
- ♿ **Accessible** — Semantic HTML, ARIA labels, keyboard navigation

### Developer Features
- 🔐 **Helmet.js Security** — CSP, XSS, clickjacking protection
- ⏱️ **Rate Limiting** — 100 requests per 15 minutes per IP
- ✅ **Input Validation** — Server-side validation middleware for all endpoints
- 🧹 **Auto Cleanup** — PDFs older than 1 hour are automatically deleted
- 📁 **Clean Architecture** — Modular routes, middleware, and utilities
- 🌍 **Environment Config** — `.env` for all sensitive/environment-specific values
- 📦 **Multer Upload** — Image upload support (up to 5MB, JPEG/PNG/GIF/WEBP)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js ≥ 18 |
| **Framework** | Express.js 4.x |
| **PDF Engine** | PDFKit 0.15 |
| **QR Codes** | qrcode 1.5 |
| **File Upload** | Multer 1.4 |
| **Security** | Helmet.js, express-rate-limit |
| **Frontend** | Vanilla HTML5, CSS3, ES6+ JavaScript |
| **Fonts** | Google Fonts (Inter), Font Awesome 6 |
| **ID Generation** | UUID v4 |
| **Dev Tools** | Nodemon, dotenv |

---

## 📁 Project Structure

```
smart-pdf-generator/
│
├── client/                     # Frontend assets
│   ├── css/
│   │   └── styles.css          # Full theme system (dark/light), responsive layout
│   ├── js/
│   │   └── app.js              # All UI logic, form builders, API calls
│   ├── assets/
│   │   └── fonts/              # Custom fonts (if any)
│   └── index.html              # Single-page app shell
│
├── server/                     # Backend (Node.js + Express)
│   ├── routes/
│   │   ├── pdf.js              # POST /api/pdf/* — all generation endpoints
│   │   └── templates.js        # GET /api/templates/* — sample data
│   ├── middleware/
│   │   └── validate.js         # Input validation for each template
│   ├── utils/
│   │   └── pdfGenerator.js     # Core PDF engine — all 5 templates
│   └── index.js                # Express app, middleware, error handling
│
├── public/
│   └── uploads/                # Uploaded images (temp)
│
├── generated_pdfs/             # Output PDFs (auto-cleaned after 1 hour)
│
├── assets/
│   └── images/                 # Static project assets
│
├── .env.example                # Environment variable template
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── README.md
```

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-pdf-generator.git
cd smart-pdf-generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env as needed (PORT defaults to 3000)
```

### 4. Start the Server

**Development (auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 5. Open the App
```
http://localhost:3000
```

That's it! No database, no build step, no complex configuration. 🎉

---

## 🔌 API Reference

Base URL: `http://localhost:3000/api`

### Health Check
```http
GET /health
```
```json
{ "status": "ok", "version": "1.0.0", "uptime": 42.3 }
```

---

### Generate Custom PDF
```http
POST /pdf/custom
Content-Type: application/json
```
```json
{
  "title": "My Document",
  "subtitle": "Optional subtitle",
  "fontSize": 12,
  "fontColor": "#1E293B",
  "paragraphs": [
    { "text": "Section Title", "heading": true },
    { "text": "Body paragraph text here.", "align": "justify" }
  ],
  "tables": [
    {
      "headers": ["Name", "Score", "Grade"],
      "rows": [["Alice", "95", "A"], ["Bob", "87", "B"]],
      "colWidths": [150, 100, 100]
    }
  ],
  "header": { "left": "My Company", "right": "Confidential" },
  "footer": { "left": "Draft", "center": "© 2024", "pageNumbers": true },
  "watermark": { "text": "DRAFT", "color": "#CCCCCC", "opacity": 0.15 },
  "qrCode": { "text": "https://example.com", "label": "Visit Website" },
  "signature": true
}
```

---

### Generate Resume PDF
```http
POST /pdf/resume
Content-Type: application/json
```
```json
{
  "name": "Alex Johnson",
  "title": "Senior Developer",
  "email": "alex@example.com",
  "phone": "+1 555 000 0000",
  "location": "San Francisco, CA",
  "linkedin": "linkedin.com/in/alexjohnson",
  "summary": "7+ years building scalable applications...",
  "skills": ["JavaScript", "React", "Node.js", "AWS"],
  "experience": [
    {
      "role": "Senior Engineer",
      "company": "TechCorp",
      "period": "2021–Present",
      "description": ["Led team of 6", "Reduced latency by 40%"]
    }
  ],
  "education": [{ "degree": "BSc CS", "school": "MIT", "year": "2018" }],
  "projects": [{ "name": "OpenFlow", "description": "API gateway, 2K GitHub stars" }]
}
```

---

### Generate Invoice PDF
```http
POST /pdf/invoice
Content-Type: application/json
```
```json
{
  "invoiceNumber": "INV-2024-001",
  "date": "June 26, 2024",
  "dueDate": "July 26, 2024",
  "company": { "name": "Acme Ltd", "address": "123 Main St", "email": "billing@acme.com" },
  "client":  { "name": "Globex Corp", "address": "456 Corp Blvd", "email": "ap@globex.com" },
  "items": [
    { "description": "Web Development (40hrs)", "qty": 40, "price": 125 },
    { "description": "Cloud Setup", "qty": 1, "price": 800 }
  ],
  "taxRate": 8.5,
  "notes": "Payment due in 30 days.",
  "qrCode": { "text": "https://pay.acme.com/inv/001", "label": "Pay Online" }
}
```

---

### Generate Certificate PDF
```http
POST /pdf/certificate
Content-Type: application/json
```
```json
{
  "certificateTitle": "Certificate of Excellence",
  "recipientName": "Dr. Sarah Mitchell",
  "course": "Advanced Machine Learning",
  "issuer": "Prof. James Carter",
  "date": "June 26, 2024",
  "description": "For outstanding performance in the 12-week intensive program.",
  "qrCode": { "text": "https://verify.org/cert/ABC123", "label": "Verify Certificate" }
}
```

---

### Generate Report PDF
```http
POST /pdf/report
Content-Type: application/json
```
```json
{
  "title": "Q4 2024 Business Report",
  "subtitle": "Executive Summary",
  "author": "Analytics Team",
  "date": "December 31, 2024",
  "sections": [
    { "title": "1. Executive Summary", "content": "Revenue grew 23% YoY..." },
    {
      "title": "2. Revenue by Region",
      "content": "All regions exceeded targets.",
      "table": {
        "headers": ["Region", "Revenue", "Growth"],
        "rows": [["North America", "$2.2M", "+18%"], ["APAC", "$0.98M", "+52%"]],
        "colWidths": [180, 130, 130]
      }
    }
  ],
  "watermark": { "text": "CONFIDENTIAL", "color": "#CC0000", "opacity": 0.07 },
  "qrCode": { "text": "https://reports.company.com/q4-2024", "label": "View Online" }
}
```

---

### Successful Response (all endpoints)
```json
{
  "success": true,
  "message": "PDF generated successfully!",
  "filename": "resume-abc123.pdf",
  "url": "/generated_pdfs/resume-abc123.pdf",
  "downloadUrl": "/generated_pdfs/resume-abc123.pdf",
  "size": 42380,
  "generatedAt": "2024-06-26T10:30:00.000Z"
}
```

### Download a PDF
```http
GET /pdf/download/:filename
```
Returns the PDF file as a binary download.

### List Generated PDFs
```http
GET /pdf/list
```

### Get Template Sample Data
```http
GET /templates/:type
# type: custom | resume | invoice | certificate | report
```

---

## 🎨 Template Gallery

### 1. 📄 Custom Document
- Free-form text with paragraph and heading styles
- Dynamic table builder (unlimited rows/columns)
- Watermark, QR, header, footer, signature controls
- Font size and color picker

### 2. 👤 Professional Resume
- Two-column layout (dark sidebar + white content area)
- Initials avatar in sidebar
- Skills, experience, education, projects sections
- Color-accented section headers

### 3. 🧾 Business Invoice
- Professional dark header with invoice number
- Itemized line items with qty × unit price calculation
- Automatic tax and total computation
- QR code for online payment

### 4. 🎓 Achievement Certificate
- Landscape A4 with gold decorative borders
- Triple-star decoration and corner ornaments
- Recipient name in 44pt bold
- Dual signature lines + date
- QR code for verification

### 5. 📊 Business Report
- Branded cover page with color strip
- Numbered sections with dividers
- Embedded tables per section
- Auto header/footer with page numbers
- Confidential watermark option

---

## 🔐 Security

| Feature | Implementation |
|---|---|
| HTTP Security Headers | Helmet.js (CSP, XSS, clickjacking) |
| Rate Limiting | 100 req / 15 min per IP |
| Input Validation | Custom middleware per endpoint |
| Path Traversal Prevention | `path.basename()` on all file names |
| File Upload Safety | MIME type filter, 5MB size limit |
| Text Sanitization | Strip `<>` chars from all user input |
| Auto File Cleanup | PDFs deleted after 1 hour |

---

## 🚀 Deployment

### Deploy to Railway
```bash
npm install -g railway
railway init
railway up
```

### Deploy to Render
1. Connect GitHub repo to [render.com](https://render.com)
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start`
4. Set env var `NODE_ENV=production`

### Deploy with Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p generated_pdfs public/uploads
EXPOSE 3000
CMD ["npm", "start"]
```
```bash
docker build -t smart-pdf-generator .
docker run -p 3000:3000 smart-pdf-generator
```

### Deploy to Heroku
```bash
heroku create smart-pdf-generator
git push heroku main
```

---

## 🔮 Future Enhancements

- [ ] **Multi-language Support** — i18n for UI and PDF output
- [ ] **Custom Font Upload** — Allow users to upload TTF/OTF fonts
- [ ] **Password Protection** — Encrypt generated PDFs with a user password
- [ ] **Merge PDFs** — Combine multiple PDFs into one
- [ ] **Email Delivery** — Send generated PDFs via email (SendGrid/Resend)
- [ ] **Cloud Storage** — Save PDFs to S3 / Google Cloud Storage
- [ ] **PDF to Image** — Export PDF pages as PNG/JPEG
- [ ] **Database Integration** — Store templates and generation history
- [ ] **User Authentication** — Auth0 / JWT for multi-user support
- [ ] **Drag & Drop Sections** — Reorder resume/report sections visually
- [ ] **Chart Embedding** — Embed charts (bar, pie, line) in reports
- [ ] **Real-time Collaboration** — Multi-user document editing
- [ ] **AI Content Generation** — Auto-fill resume/report content with AI
- [ ] **REST API SDK** — Publish an NPM package for programmatic use

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Smart PDF Generator**

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

## 📄 License

Copyright © 2024 Smart PDF Generator.
This project is [MIT](./LICENSE) licensed.

---

## ⭐ Show your support

Give a ⭐ if this project helped you! It means a lot and motivates continued development.

---

<div align="center">
  Built with ❤️ using Node.js, Express, and PDFKit
</div>
