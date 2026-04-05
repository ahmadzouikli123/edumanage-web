const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldBtn = `>Delete</button>
                </div>
              )}
            </div>
          </div>`;

const newBtn = `>Delete</button>
                  <button onClick={() => printTeacherReport(teacher)} className="text-green-600 hover:underline">Report</button>
                </div>
              )}
            </div>
          </div>`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Teacher report button added!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
