const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldLine = `+ '<div class="header"><img src="/logo.png" class="logo" onerror="this.style.display=\'none\'" /><div class="school-center">`;
const newLine = `+ '<div class="header"><img src="/logo.png" class="logo" onerror="this.style.display=\\'none\\';" /><div class="school-center">`;

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  console.log('Fixed!');
} else {
  // find the problematic line
  const idx = content.indexOf("display='none'");
  if (idx !== -1) {
    console.log('Found at:', idx);
    console.log(content.substring(idx-50, idx+50));
  } else {
    console.log('Not found');
  }
}
fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
