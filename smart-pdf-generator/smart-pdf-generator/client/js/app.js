/**
 * Smart PDF Generator — Frontend Application
 * ===========================================
 * Handles all UI interactions, form building, API calls,
 * sample data loading, and PDF preview/download.
 */

'use strict';

// ─── State ─────────────────────────────────────────────────────────────────────
const state = {
  currentTab: 'custom',
  generatedCount: 0,
  lastPdfUrl: null,
};

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  addParagraph();          // Start with one paragraph
  addInvoiceItem();        // Start with one invoice item
  addExperience();         // Start with one experience block
  addEducation();          // Start with one education block
  addReportSection();      // Start with one report section
});

function initDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  const future = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const els = ['invoiceDate', 'invoiceDueDate', 'certDate', 'reportDate'];
  els.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id.includes('Due') ? future : today;
  });
}

// ─── Navigation ────────────────────────────────────────────────────────────────
function switchTab(tabId, linkEl) {
  state.currentTab = tabId;

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`tab-${tabId}`)?.classList.add('active');
  linkEl?.classList.add('active');

  const titles = {
    custom:      ['Custom Document', 'Create a custom PDF with your own content'],
    resume:      ['Professional Resume', 'Generate a polished resume PDF'],
    invoice:     ['Business Invoice', 'Create professional invoices with tax calculation'],
    certificate: ['Achievement Certificate', 'Generate decorated certificates with QR verification'],
    report:      ['Business Report', 'Produce comprehensive business reports'],
  };
  const [title, subtitle] = titles[tabId] || ['PDF Generator', ''];
  document.getElementById('pageTitle').textContent   = title;
  document.getElementById('pageSubtitle').textContent = subtitle;

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 900) closeSidebar();
  return false;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// ─── Theme ─────────────────────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeIcon').className  = isDark ? 'fas fa-moon' : 'fas fa-sun';
  document.getElementById('themeLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';
}

// ─── Section Toggle ─────────────────────────────────────────────────────────────
function toggleSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.classList.toggle('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC FORM BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

/* ── Paragraphs ─────────────────────────────────────────────────────────────── */
let paraCount = 0;
function addParagraph() {
  const id = ++paraCount;
  const container = document.getElementById('paragraphsContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `para-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('para-${id}', 'paragraphsContainer')"><i class="fas fa-times"></i></button>
    <div class="form-row" style="margin-bottom:10px">
      <div class="form-group" style="margin:0">
        <label>Type</label>
        <select class="form-control" id="paraType-${id}">
          <option value="normal">Normal Text</option>
          <option value="heading">Section Heading</option>
        </select>
      </div>
      <div class="form-group" style="margin:0">
        <label>Alignment</label>
        <select class="form-control" id="paraAlign-${id}">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </div>
    <div class="form-group" style="margin:0">
      <label>Content</label>
      <textarea class="form-control" id="paraText-${id}" rows="3" placeholder="Enter your paragraph content..."></textarea>
    </div>`;
  container.appendChild(div);
}

/* ── Tables ─────────────────────────────────────────────────────────────────── */
let tableCount = 0;
function addTable() {
  const id = ++tableCount;
  const container = document.getElementById('tablesContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `table-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('table-${id}', 'tablesContainer')"><i class="fas fa-times"></i></button>
    <div class="form-group">
      <label>Column Headers (comma separated)</label>
      <input type="text" class="form-control" id="tableHeaders-${id}" placeholder="Name, Age, City, Country" />
    </div>
    <div class="form-group" style="margin:0">
      <label>Rows (one row per line, values comma separated)</label>
      <textarea class="form-control" id="tableRows-${id}" rows="4" placeholder="Alice, 30, New York, USA&#10;Bob, 25, London, UK&#10;Carol, 35, Paris, France"></textarea>
    </div>`;
  container.appendChild(div);
}

/* ── Invoice Items ──────────────────────────────────────────────────────────── */
let invoiceItemCount = 0;
function addInvoiceItem() {
  const id = ++invoiceItemCount;
  const container = document.getElementById('invoiceItemsContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `invItem-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('invItem-${id}', 'invoiceItemsContainer')"><i class="fas fa-times"></i></button>
    <div class="form-row-3">
      <div class="form-group" style="margin:0">
        <label>Description</label>
        <input type="text" class="form-control" id="itemDesc-${id}" placeholder="Web Development (40hrs)" />
      </div>
      <div class="form-group" style="margin:0">
        <label>Quantity</label>
        <input type="number" class="form-control" id="itemQty-${id}" value="1" min="0.01" step="0.01" />
      </div>
      <div class="form-group" style="margin:0">
        <label>Unit Price ($)</label>
        <input type="number" class="form-control" id="itemPrice-${id}" value="0" min="0" step="0.01" />
      </div>
    </div>`;
  container.appendChild(div);
}

/* ── Work Experience ────────────────────────────────────────────────────────── */
let expCount = 0;
function addExperience() {
  const id = ++expCount;
  const container = document.getElementById('experienceContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `exp-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('exp-${id}', 'experienceContainer')"><i class="fas fa-times"></i></button>
    <div class="form-row">
      <div class="form-group"><label>Job Title</label><input type="text" class="form-control" id="expRole-${id}" placeholder="Senior Developer" /></div>
      <div class="form-group"><label>Company</label><input type="text" class="form-control" id="expCompany-${id}" placeholder="TechCorp Inc." /></div>
    </div>
    <div class="form-group"><label>Period</label><input type="text" class="form-control" id="expPeriod-${id}" placeholder="Jan 2021 – Present" /></div>
    <div class="form-group" style="margin:0"><label>Responsibilities (one per line)</label><textarea class="form-control" id="expDesc-${id}" rows="3" placeholder="Built scalable APIs&#10;Led team of 6 engineers&#10;Reduced latency by 40%"></textarea></div>`;
  container.appendChild(div);
}

/* ── Education ──────────────────────────────────────────────────────────────── */
let eduCount = 0;
function addEducation() {
  const id = ++eduCount;
  const container = document.getElementById('educationContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `edu-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('edu-${id}', 'educationContainer')"><i class="fas fa-times"></i></button>
    <div class="form-row-3">
      <div class="form-group" style="margin:0"><label>Degree</label><input type="text" class="form-control" id="eduDegree-${id}" placeholder="B.Sc. Computer Science" /></div>
      <div class="form-group" style="margin:0"><label>School</label><input type="text" class="form-control" id="eduSchool-${id}" placeholder="MIT" /></div>
      <div class="form-group" style="margin:0"><label>Year</label><input type="text" class="form-control" id="eduYear-${id}" placeholder="2020" /></div>
    </div>`;
  container.appendChild(div);
}

/* ── Projects ───────────────────────────────────────────────────────────────── */
let projCount = 0;
function addProject() {
  const id = ++projCount;
  const container = document.getElementById('projectsContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `proj-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('proj-${id}', 'projectsContainer')"><i class="fas fa-times"></i></button>
    <div class="form-row">
      <div class="form-group"><label>Project Name</label><input type="text" class="form-control" id="projName-${id}" placeholder="OpenFlow API Gateway" /></div>
      <div class="form-group"><label>Tech Stack</label><input type="text" class="form-control" id="projTech-${id}" placeholder="Node.js, React, AWS" /></div>
    </div>
    <div class="form-group" style="margin:0"><label>Description</label><textarea class="form-control" id="projDesc-${id}" rows="2" placeholder="Brief description of the project..."></textarea></div>`;
  container.appendChild(div);
}

/* ── Report Sections ────────────────────────────────────────────────────────── */
let sectionCount = 0;
function addReportSection() {
  const id = ++sectionCount;
  const container = document.getElementById('reportSectionsContainer');
  removeEmpty(container);
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = `section-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('section-${id}', 'reportSectionsContainer')"><i class="fas fa-times"></i></button>
    <div class="form-group"><label>Section Title</label><input type="text" class="form-control" id="sectionTitle-${id}" placeholder="1. Executive Summary" /></div>
    <div class="form-group" style="margin:0"><label>Content</label><textarea class="form-control" id="sectionContent-${id}" rows="4" placeholder="Section content..."></textarea></div>`;
  container.appendChild(div);
}

/* ── Generic Remove ─────────────────────────────────────────────────────────── */
function removeItem(itemId, containerId) {
  const item = document.getElementById(itemId);
  if (item) item.remove();
  const container = document.getElementById(containerId);
  if (container && container.children.length === 0) {
    showEmpty(container);
  }
}

function removeEmpty(container) {
  const empty = container.querySelector('.item-empty');
  if (empty) empty.remove();
}

function showEmpty(container) {
  container.innerHTML = `<div class="item-empty"><i class="fas fa-inbox"></i>No items yet. Click Add to get started.</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA COLLECTION
// ═══════════════════════════════════════════════════════════════════════════════

function collectCustomData() {
  const paragraphs = [];
  document.querySelectorAll('[id^="paraText-"]').forEach(el => {
    const id = el.id.split('-')[1];
    const text = el.value.trim();
    if (text) {
      const type = document.getElementById(`paraType-${id}`)?.value;
      const align = document.getElementById(`paraAlign-${id}`)?.value;
      paragraphs.push({ text, heading: type === 'heading', align });
    }
  });

  const tables = [];
  document.querySelectorAll('[id^="tableHeaders-"]').forEach(el => {
    const id = el.id.split('-')[1];
    const headers = el.value.split(',').map(h => h.trim()).filter(Boolean);
    const rowsRaw = document.getElementById(`tableRows-${id}`)?.value || '';
    const rows = rowsRaw.split('\n').map(r => r.split(',').map(c => c.trim())).filter(r => r.some(Boolean));
    if (headers.length) tables.push({ headers, rows });
  });

  const header = document.getElementById('enableHeader')?.checked ? {
    left: document.getElementById('headerLeft')?.value || '',
    right: document.getElementById('headerRight')?.value || '',
  } : null;

  const footer = document.getElementById('enableFooter')?.checked ? {
    left: document.getElementById('footerLeft')?.value || '',
    center: document.getElementById('footerCenter')?.value || '',
    pageNumbers: document.getElementById('footerPageNums')?.checked,
  } : null;

  const watermark = document.getElementById('enableWatermark')?.checked ? {
    text: document.getElementById('watermarkText')?.value || 'CONFIDENTIAL',
    color: document.getElementById('watermarkColor')?.value || '#CCCCCC',
    opacity: (document.getElementById('watermarkOpacity')?.value || 15) / 100,
  } : null;

  const qrCode = document.getElementById('enableQR')?.checked ? {
    text: document.getElementById('qrText')?.value || '',
    label: document.getElementById('qrLabel')?.value || '',
  } : null;

  return {
    title: document.getElementById('customTitle')?.value || 'My Document',
    subtitle: document.getElementById('customSubtitle')?.value || '',
    fontSize: parseInt(document.getElementById('customFontSize')?.value) || 12,
    fontColor: document.getElementById('customFontColor')?.value || '#1E293B',
    paragraphs, tables, header, footer, watermark, qrCode,
    signature: document.getElementById('enableSignature')?.checked,
  };
}

function collectResumeData() {
  const experience = [];
  document.querySelectorAll('[id^="expRole-"]').forEach(el => {
    const id = el.id.split('-')[1];
    const descRaw = document.getElementById(`expDesc-${id}`)?.value || '';
    experience.push({
      role: el.value.trim(),
      company: document.getElementById(`expCompany-${id}`)?.value.trim() || '',
      period: document.getElementById(`expPeriod-${id}`)?.value.trim() || '',
      description: descRaw.split('\n').map(d => d.trim()).filter(Boolean),
    });
  });

  const education = [];
  document.querySelectorAll('[id^="eduDegree-"]').forEach(el => {
    const id = el.id.split('-')[1];
    education.push({
      degree: el.value.trim(),
      school: document.getElementById(`eduSchool-${id}`)?.value.trim() || '',
      year:   document.getElementById(`eduYear-${id}`)?.value.trim() || '',
    });
  });

  const projects = [];
  document.querySelectorAll('[id^="projName-"]').forEach(el => {
    const id = el.id.split('-')[1];
    const tech = document.getElementById(`projTech-${id}`)?.value.trim();
    projects.push({
      name: el.value.trim(),
      description: `${document.getElementById(`projDesc-${id}`)?.value.trim()}${tech ? ` | Tech: ${tech}` : ''}`,
    });
  });

  return {
    name:     document.getElementById('resumeName')?.value || '',
    title:    document.getElementById('resumeTitle')?.value || '',
    email:    document.getElementById('resumeEmail')?.value || '',
    phone:    document.getElementById('resumePhone')?.value || '',
    location: document.getElementById('resumeLocation')?.value || '',
    linkedin: document.getElementById('resumeLinkedin')?.value || '',
    summary:  document.getElementById('resumeSummary')?.value || '',
    skills:   (document.getElementById('resumeSkills')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
    experience, education, projects,
  };
}

function collectInvoiceData() {
  const items = [];
  document.querySelectorAll('[id^="itemDesc-"]').forEach(el => {
    const id = el.id.split('-')[1];
    items.push({
      description: el.value.trim(),
      qty:   parseFloat(document.getElementById(`itemQty-${id}`)?.value) || 1,
      price: parseFloat(document.getElementById(`itemPrice-${id}`)?.value) || 0,
    });
  });

  const qrText = document.getElementById('invoiceQrText')?.value;

  return {
    invoiceNumber: document.getElementById('invoiceNumber')?.value || 'INV-001',
    date:    document.getElementById('invoiceDate')?.value || new Date().toLocaleDateString(),
    dueDate: document.getElementById('invoiceDueDate')?.value || '',
    taxRate: parseFloat(document.getElementById('taxRate')?.value) || 0,
    notes:   document.getElementById('invoiceNotes')?.value || '',
    qrCode:  qrText ? { text: qrText, label: 'Pay Online' } : null,
    company: {
      name:    document.getElementById('companyName')?.value || '',
      address: document.getElementById('companyAddress')?.value || '',
      email:   document.getElementById('companyEmail')?.value || '',
      phone:   document.getElementById('companyPhone')?.value || '',
    },
    client: {
      name:    document.getElementById('clientName')?.value || '',
      address: document.getElementById('clientAddress')?.value || '',
      email:   document.getElementById('clientEmail')?.value || '',
      phone:   document.getElementById('clientPhone')?.value || '',
    },
    items,
  };
}

function collectCertificateData() {
  const qrText = document.getElementById('certQrText')?.value;
  return {
    certificateTitle: document.getElementById('certTitle')?.value || 'Certificate of Achievement',
    recipientName: document.getElementById('certRecipient')?.value || '',
    course:        document.getElementById('certCourse')?.value || '',
    issuer:        document.getElementById('certIssuer')?.value || '',
    date:          document.getElementById('certDate')?.value || new Date().toLocaleDateString(),
    description:   document.getElementById('certDescription')?.value || '',
    qrCode:        qrText ? { text: qrText, label: 'Verify Certificate' } : null,
  };
}

function collectReportData() {
  const sections = [];
  document.querySelectorAll('[id^="sectionTitle-"]').forEach(el => {
    const id = el.id.split('-')[1];
    sections.push({
      title:   el.value.trim(),
      content: document.getElementById(`sectionContent-${id}`)?.value.trim() || '',
    });
  });

  const qrText = document.getElementById('reportQrText')?.value;
  const watermarkEnabled = document.getElementById('reportWatermark')?.checked;

  return {
    title:    document.getElementById('reportTitle')?.value || 'Business Report',
    subtitle: document.getElementById('reportSubtitle')?.value || '',
    author:   document.getElementById('reportAuthor')?.value || '',
    date:     document.getElementById('reportDate')?.value || new Date().toLocaleDateString(),
    sections,
    watermark: watermarkEnabled ? { text: 'CONFIDENTIAL', color: '#DC2626', opacity: 0.08 } : null,
    qrCode:    qrText ? { text: qrText, label: 'View Report Online' } : null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE PDF
// ═══════════════════════════════════════════════════════════════════════════════

async function generatePDF() {
  const tab = state.currentTab;
  let endpoint, data;

  try {
    switch (tab) {
      case 'custom':
        endpoint = '/api/pdf/custom';
        data = collectCustomData();
        if (!data.title.trim()) { toast('Please enter a document title.', 'warning'); return; }
        break;
      case 'resume':
        endpoint = '/api/pdf/resume';
        data = collectResumeData();
        if (!data.name.trim()) { toast('Please enter a full name.', 'warning'); return; }
        break;
      case 'invoice':
        endpoint = '/api/pdf/invoice';
        data = collectInvoiceData();
        if (!data.items.length || !data.items[0].description) { toast('Please add at least one invoice item.', 'warning'); return; }
        break;
      case 'certificate':
        endpoint = '/api/pdf/certificate';
        data = collectCertificateData();
        if (!data.recipientName.trim()) { toast('Please enter the recipient name.', 'warning'); return; }
        break;
      case 'report':
        endpoint = '/api/pdf/report';
        data = collectReportData();
        if (!data.title.trim()) { toast('Please enter a report title.', 'warning'); return; }
        break;
      default:
        toast('Unknown template.', 'error'); return;
    }

    showLoading(`Generating ${tab} PDF...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    hideLoading();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate PDF.');
    }

    state.generatedCount++;
    document.getElementById('statTotal').textContent = state.generatedCount;
    state.lastPdfUrl = result.url;

    toast(`PDF generated successfully! (${formatBytes(result.size)})`, 'success');
    openPreview(result.url, result.downloadUrl);

  } catch (err) {
    hideLoading();
    console.error(err);
    toast(err.message || 'An unexpected error occurred.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE DATA LOADER
// ═══════════════════════════════════════════════════════════════════════════════

async function loadSampleData() {
  const tab = state.currentTab;
  try {
    showLoading('Loading sample data...');
    const res = await fetch(`/api/templates/${tab}`);
    const { template } = await res.json();
    hideLoading();
    if (!template) { toast('No sample for this template.', 'info'); return; }
    populateForm(tab, template);
    toast('Sample data loaded!', 'success');
  } catch {
    hideLoading();
    toast('Failed to load sample data.', 'error');
  }
}

function populateForm(tab, d) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

  if (tab === 'custom') {
    set('customTitle', 'My Custom Document');
    set('customSubtitle', 'A demonstration of Smart PDF Generator capabilities');
    // Clear and repopulate paragraphs
    document.getElementById('paragraphsContainer').innerHTML = '';
    paraCount = 0;
    const paras = [
      { text: 'Introduction', heading: true },
      { text: 'Smart PDF Generator is a powerful, production-ready tool for creating beautiful PDFs. This document demonstrates the capabilities of the system, including formatted text, tables, and more.', align: 'justify' },
      { text: 'Key Features', heading: true },
      { text: 'Generate professional documents in seconds with our intuitive interface. Support for multiple templates, custom fonts, watermarks, QR codes, and digital signature placeholders makes this the ultimate PDF solution.', align: 'left' },
    ];
    paras.forEach(p => {
      addParagraph();
      const textEl = document.getElementById(`paraText-${paraCount}`);
      const typeEl = document.getElementById(`paraType-${paraCount}`);
      if (textEl) textEl.value = p.text;
      if (typeEl) typeEl.value = p.heading ? 'heading' : 'normal';
    });
    // Add a table
    document.getElementById('tablesContainer').innerHTML = '';
    tableCount = 0;
    addTable();
    set('tableHeaders-1', 'Feature, Status, Priority');
    document.getElementById('tableRows-1').value = 'PDF Generation, ✓ Complete, High\nTemplate System, ✓ Complete, High\nQR Code Support, ✓ Complete, Medium\nDigital Signature, ✓ Complete, Medium';
    // Enable watermark
    document.getElementById('enableWatermark').checked = true;
    document.getElementById('watermarkSection').classList.remove('hidden');
    set('watermarkText', 'SAMPLE');
    // Enable footer
    document.getElementById('enableFooter').checked = true;
    document.getElementById('footerSection').classList.remove('hidden');
    set('footerCenter', 'Smart PDF Generator © 2024');
  }

  if (tab === 'resume') {
    set('resumeName', d.name); set('resumeTitle', d.title);
    set('resumeEmail', d.email); set('resumePhone', d.phone);
    set('resumeLocation', d.location); set('resumeLinkedin', d.linkedin);
    set('resumeSummary', d.summary);
    set('resumeSkills', Array.isArray(d.skills) ? d.skills.join(', ') : d.skills);

    document.getElementById('experienceContainer').innerHTML = '';
    expCount = 0;
    (d.experience || []).forEach(exp => {
      addExperience();
      set(`expRole-${expCount}`, exp.role);
      set(`expCompany-${expCount}`, exp.company);
      set(`expPeriod-${expCount}`, exp.period);
      set(`expDesc-${expCount}`, Array.isArray(exp.description) ? exp.description.join('\n') : exp.description);
    });

    document.getElementById('educationContainer').innerHTML = '';
    eduCount = 0;
    (d.education || []).forEach(edu => {
      addEducation();
      set(`eduDegree-${eduCount}`, edu.degree);
      set(`eduSchool-${eduCount}`, edu.school);
      set(`eduYear-${eduCount}`, edu.year);
    });

    document.getElementById('projectsContainer').innerHTML = '';
    projCount = 0;
    (d.projects || []).forEach(proj => {
      addProject();
      set(`projName-${projCount}`, proj.name);
      set(`projDesc-${projCount}`, proj.description);
    });
  }

  if (tab === 'invoice') {
    set('companyName', d.company?.name); set('companyAddress', d.company?.address);
    set('companyEmail', d.company?.email); set('companyPhone', d.company?.phone);
    set('clientName', d.client?.name); set('clientAddress', d.client?.address);
    set('clientEmail', d.client?.email); set('clientPhone', d.client?.phone);
    set('invoiceNumber', d.invoiceNumber); set('taxRate', d.taxRate);
    set('invoiceNotes', d.notes);
    set('invoiceQrText', d.qrCode?.text);

    document.getElementById('invoiceItemsContainer').innerHTML = '';
    invoiceItemCount = 0;
    (d.items || []).forEach(item => {
      addInvoiceItem();
      set(`itemDesc-${invoiceItemCount}`, item.description);
      set(`itemQty-${invoiceItemCount}`, item.qty);
      set(`itemPrice-${invoiceItemCount}`, item.price);
    });
  }

  if (tab === 'certificate') {
    set('certTitle', d.certificateTitle); set('certRecipient', d.recipientName);
    set('certCourse', d.course); set('certIssuer', d.issuer);
    set('certDescription', d.description); set('certQrText', d.qrCode?.text);
  }

  if (tab === 'report') {
    set('reportTitle', d.title); set('reportSubtitle', d.subtitle);
    set('reportAuthor', d.author);
    if (d.watermark) { document.getElementById('reportWatermark').checked = true; }
    if (d.qrCode?.text) {
      document.getElementById('reportQR').checked = true;
      document.getElementById('reportQrSection').classList.remove('hidden');
      set('reportQrText', d.qrCode.text);
    }
    document.getElementById('reportSectionsContainer').innerHTML = '';
    sectionCount = 0;
    (d.sections || []).forEach(sec => {
      addReportSection();
      set(`sectionTitle-${sectionCount}`, sec.title);
      set(`sectionContent-${sectionCount}`, sec.content);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function showLoading(text = 'Generating PDF...') {
  document.getElementById('loadingText').textContent = text;
  document.getElementById('loadingOverlay').classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

function openPreview(viewUrl, downloadUrl) {
  document.getElementById('pdfFrame').src = viewUrl;
  document.getElementById('downloadBtn').href = `/api/pdf/download/${viewUrl.split('/').pop()}`;
  document.getElementById('previewModal').classList.remove('hidden');
}
function closePreview() {
  document.getElementById('previewModal').classList.add('hidden');
  document.getElementById('pdfFrame').src = '';
}

function toast(message, type = 'info') {
  const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <i class="fas fa-${icons[type] || 'info-circle'}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.appendChild(el);
  setTimeout(() => { el.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => el.remove(), 300); }, 4000);
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePreview();
});
