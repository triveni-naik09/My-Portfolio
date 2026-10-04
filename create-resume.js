const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'public', 'assets', 'Triveni_Naik_Resume.pdf');

// A valid, fully conforming minimal PDF document
const streamData = `BT
/F1 22 Tf
50 740 Td
(TRIVENI KAMLESH NAIK) Tj
0 -22 Td
/F2 12 Tf
(Electronics & Telecommunication Engineering Student | 3rd Year B.Tech) Tj
0 -16 Td
(Email: ntriveni959@gmail.com | Phone: +91 9699116908 | Nagpur, MH, India) Tj
0 -16 Td
(LinkedIn: https://linkedin.com/in/triveni-naik-9273613a6 | GitHub: https://github.com/triveni-naik09) Tj
0 -30 Td
/F1 14 Tf
(EDUCATION) Tj
0 -18 Td
/F2 11 Tf
(B.Tech: S.B. Jain Institute of Technology, Management & Research, Nagpur (3rd Year)) Tj
0 -15 Td
(12th HSC Boards: Smt. C.B. Adarsh Vidya Mandir, Nagpur - 75.17%) Tj
0 -15 Td
(10th SSC Boards: Shri. Rajendra High School, Mahal, Nagpur - 86.40%) Tj
0 -28 Td
/F1 14 Tf
(CORE TECHNICAL SKILLS) Tj
0 -18 Td
/F2 11 Tf
(Hardware & IoT: Embedded Systems, Arduino, ESP8266, Raspberry Pi, AT89C51, Sensors) Tj
0 -15 Td
(Languages: C Language, JAVA, Python, HTML/CSS/JavaScript) Tj
0 -15 Td
(Simulation & EDA: Proteus Circuit Design, MatLab Signal Simulation) Tj
0 -28 Td
/F1 14 Tf
(KEY PROJECTS) Tj
0 -18 Td
/F2 11 Tf
(1. Traffic Light Controller using Arduino, ESP8266, Raspberry Pi, AT89C51) Tj
0 -15 Td
(2. Automatic Toll Gate System using Proximity Sensors & Microcontroller) Tj
0 -15 Td
(3. Smart Home Automation over Wi-Fi with Relays & Web Interface) Tj
0 -15 Td
(4. Leaf Disease Detection using Image Processing & Python OpenCV) Tj
0 -15 Td
(5. Temperature & Humidity Real-Time Monitoring Web Application) Tj
0 -28 Td
/F1 14 Tf
(EXPERIENCE & LEADERSHIP) Tj
0 -18 Td
/F2 11 Tf
(Treasurer - FEETA Forum (Forum of Electronics & Telecommunication Engineering Associates)) Tj
0 -15 Td
(Former Joint PRO Head - FEETA Forum (1 Year Tenure)) Tj
0 -15 Td
(Placement Co-ordinator - S.B. Jain Institute of Technology, Management & Research) Tj
0 -28 Td
/F1 14 Tf
(CERTIFICATIONS) Tj
0 -18 Td
/F2 11 Tf
(NPTEL: Advance Social Psychology | Mental Health and Wellbeing) Tj
ET`;

const streamLength = Buffer.byteLength(streamData, 'utf8');

const header = `%PDF-1.4\n`;
const obj1 = `1 0 obj\n<< /Title (Triveni Naik - Resume)\n   /Author (Triveni Kamlesh Naik)\n   /Creator (Triveni Portfolio)\n   /Producer (Node.js) >>\nendobj\n`;
const obj2 = `2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n`;
const obj3 = `3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n`;
const obj4 = `4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 5 0 R >>\nendobj\n`;
const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj\n`;

// Calculate offsets
let offset = 0;
const offsets = [0];

offset += Buffer.byteLength(header, 'utf8');
offsets.push(offset);

offset += Buffer.byteLength(obj1, 'utf8');
offsets.push(offset);

offset += Buffer.byteLength(obj2, 'utf8');
offsets.push(offset);

offset += Buffer.byteLength(obj3, 'utf8');
offsets.push(offset);

offset += Buffer.byteLength(obj4, 'utf8');
offsets.push(offset);

offset += Buffer.byteLength(obj5, 'utf8');
const xrefOffset = offset;

let xref = `xref\n0 6\n0000000000 65535 f \n`;
for (let i = 1; i <= 5; i++) {
  xref += String(offsets[i]).padStart(10, '0') + ` 00000 n \n`;
}

const trailer = `trailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, fullPdf, 'binary');
console.log('Resume PDF generated at:', targetPath);
