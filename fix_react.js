const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

content = content.replace(/React\.useState/g, 'useState');

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
console.log('Fixed!');