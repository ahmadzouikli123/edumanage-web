const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldTitles = "    teachers:   { title: \"Teachers\",    sub: \"Manage teaching staff & assignments\" },\r\n  };";
const newTitles = "    teachers:   { title: \"Teachers\",    sub: \"Manage teaching staff & assignments\" },\r\n    settings:   { title: \"Settings\",    sub: \"Manage accounts & access\" },\r\n  };";

if (content.includes(oldTitles)) { content = content.replace(oldTitles, newTitles); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');