const fs = require('fs');
let content = fs.readFileSync('src/app/school/login/page.tsx', 'utf8');
const oldLine = `              <div style={{textAlign:"center",marginTop:24,fontSize:11,color:"rgba(255,255,255,.25)"}}>
          © 2025 Al-Huffath Academy · Developed by <span style={{color:"rgba(13,148,136,.7)"}}>Eng: Ahmad Zouikli</span>
        </div>`;
const newLine = `              <div style={{textAlign:"center",marginTop:24,fontSize:12,color:"rgba(255,255,255,.6)"}}>
          © 2025 Al-Huffath Academy · Developed by <span style={{color:"#5eead4",fontWeight:600}}>Eng. Ahmad Zouikli</span>
        </div>`;
if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/app/school/login/page.tsx', content, 'utf8');