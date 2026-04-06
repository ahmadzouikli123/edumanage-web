const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Replace T.* references in Settings with direct values
const oldSettings = `function Settings({ teachers, setTeachers, students }) {`;
const newSettings = `function Settings({ teachers, setTeachers, students }) {
  const S = { primary: "#0d9488", border: "#e2e8f0", textMain: "#1e293b", textSub: "#64748b", textMuted: "#94a3b8" };`;

if (content.includes(oldSettings)) {
  content = content.replace(oldSettings, newSettings);
  // Replace T. with S. inside Settings only
  const settingsStart = content.indexOf('function Settings(');
  const settingsEnd = content.indexOf('\n// ─── App Root');
  const before = content.substring(0, settingsStart);
  const settingsBlock = content.substring(settingsStart, settingsEnd).replace(/\bT\./g, 'S.');
  const after = content.substring(settingsEnd);
  content = before + settingsBlock + after;
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');