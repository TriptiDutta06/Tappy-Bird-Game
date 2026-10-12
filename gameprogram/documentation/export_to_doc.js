/**
 * Generates an MS Word-compatible document (.doc) from the project report.
 * Can be opened and saved as .docx in Microsoft Word or LibreOffice.
 */
const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'PROJECT_REPORT.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Convert Markdown to basic styled HTML for Word document
function markdownToHtml(md) {
  let html = md
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e3a8a; font-family: Calibri, sans-serif; font-size: 24pt; border-bottom: 2px solid #3b82f6; padding-bottom: 6px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #1d4ed8; font-family: Calibri, sans-serif; font-size: 16pt; margin-top: 18pt;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #2563eb; font-family: Calibri, sans-serif; font-size: 13pt; margin-top: 12pt;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background-color: #f1f5f9; font-family: Consolas, monospace; font-size: 10pt; padding: 2px 4px;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li style="font-family: Calibri, sans-serif; font-size: 11pt; margin-bottom: 4px;">$1</li>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li style="font-family: Calibri, sans-serif; font-size: 11pt; margin-bottom: 4px;">$1</li>')
    .replace(/\n\n/gim, '</p><p style="font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; margin-bottom: 8pt;">');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>CA-2 Project Report</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1e293b; margin: 40px; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 10.5pt; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; }
      </style>
    </head>
    <body>
      <p style="font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5;">${html}</p>
    </body>
    </html>
  `;
}

const docHtml = markdownToHtml(mdContent);
const outPath = path.join(__dirname, '23_ABC_TEMPLATE.doc');
fs.writeFileSync(outPath, docHtml, 'utf8');

console.log('✅ Generated submission template: documentation/23_ABC_TEMPLATE.doc');
console.log('👉 Student should rename this file to their actual Roll Number and Initials (e.g. 23_ABC.docx or 23_ABC.doc)');
