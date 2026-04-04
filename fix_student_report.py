# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

idx = content.find('const printReport')
old_write = content[content.find('win.document.write(\n      "<html>', idx):content.find('win.document.close();', idx)+len('win.document.close();')]

new_write = '''win.document.write(
      "<html><head><title>Student Report - " + s.name + "</title>" +
      "<style>" +
      "* { box-sizing: border-box; margin: 0; padding: 0; }" +
      "body { font-family: 'Times New Roman', serif; color: #1a1a1a; background: #fff; padding: 60px; max-width: 800px; margin: 0 auto; }" +
      ".header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; position: relative; }" +
      ".school-info { text-align: left; }" +
      ".school-name { font-size: 22px; font-weight: bold; color: #0d9488; }" +
      ".school-sub { font-size: 13px; color: #64748b; margin-top: 4px; }" +
      ".logo { width: 90px; height: 90px; object-fit: contain; position: absolute; left: 50%; transform: translateX(-50%); }" +
      ".date-block { text-align: right; margin-bottom: 30px; font-size: 14px; color: #374151; }" +
      ".to-block { margin-bottom: 24px; font-size: 14px; }" +
      ".subject-line { font-size: 15px; font-weight: bold; border-bottom: 2px solid #1a1a1a; padding-bottom: 6px; margin-bottom: 28px; text-transform: uppercase; letter-spacing: 1px; }" +
      ".body-text { font-size: 14px; line-height: 2; color: #1a1a1a; margin-bottom: 16px; }" +
      ".info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }" +
      ".info-table td { padding: 9px 14px; border: 1px solid #d1d5db; font-size: 13px; }" +
      ".info-table td:first-child { background: #f9fafb; font-weight: bold; width: 35%; }" +
      ".grades-table { width: 100%; border-collapse: collapse; margin: 12px 0; }" +
      ".grades-table td, .grades-table th { padding: 8px 12px; border: 1px solid #d1d5db; font-size: 13px; text-align: left; }" +
      ".grades-table th { background: #f1f5f9; font-weight: 600; }" +
      "h2 { font-size: 15px; margin-top: 24px; margin-bottom: 8px; color: #0d9488; }" +
      ".sig-line { border-top: 1px solid #1a1a1a; width: 200px; margin-top: 50px; }" +
      ".sig-name { font-size: 13px; margin-top: 6px; font-weight: bold; }" +
      ".sig-title { font-size: 12px; color: #64748b; }" +
      ".footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }" +
      "@media print { button { display: none !important; } body { padding: 40px; } }" +
      "</style></head><body>" +
      "<div class='header'>" +
      "<div class='school-info'>" +
      "<div class='school-name'>Al-Huffath Academy</div>" +
      "<div class='school-sub'>Ilm | Iman | Hifz</div>" +
      "<div class='school-sub' style='font-size:11px;margin-top:2px'>admin@al-huffath.edu</div>" +
      "</div>" +
      "<img src='/logo.png' class='logo' />" +
      "<div style='width:200px'></div>" +
      "</div>" +
      "<div class='date-block'>" + new Date().toLocaleDateString("en-GB") + "</div>" +
      "<div class='to-block'><b>To Whom It May Concern,</b></div>" +
      "<div class='subject-line'>OBJECT: Student Academic Report</div>" +
      "<p class='body-text'>This report is issued by Al-Huffath Academy to provide an official summary of the academic performance and attendance record of the student detailed below:</p>" +
      "<h2>Student Information</h2>" +
      "<table class='info-table'>" +
      "<tr><td>Full Name</td><td>" + s.name + "</td></tr>" +
      "<tr><td>Student ID</td><td>" + s.sid + "</td></tr>" +
      "<tr><td>Class</td><td>" + clsName + "</td></tr>" +
      "<tr><td>Gender</td><td>" + (s.gender||"-") + "</td></tr>" +
      "<tr><td>Phone</td><td>" + (s.phone||"-") + "</td></tr>" +
      "<tr><td>Status</td><td>" + s.status + "</td></tr>" +
      "</table>" +
      "<h2>Attendance Summary</h2>" +
      "<table class='info-table'>" +
      "<tr><td>Present</td><td>" + present + " days</td></tr>" +
      "<tr><td>Absent</td><td>" + absent + " days</td></tr>" +
      "<tr><td>Late</td><td>" + late + " days</td></tr>" +
      "<tr><td>Excused</td><td>" + excused + " days</td></tr>" +
      "<tr><td>Attendance Rate</td><td><b>" + pct + "%</b></td></tr>" +
      "</table>" +
      "<h2>Academic Performance &nbsp; (GPA: " + (gpa||"-") + " — " + gpaLetter + ")</h2>" +
      "<table class='grades-table'><tr><th>Subject</th><th>Quiz</th><th>Homework</th><th>Midterm</th><th>Final</th><th>Total</th><th>Grade</th></tr>" + rows + "</table>" +
      "<p class='body-text' style='margin-top:20px'>This report is provided upon request for administrative and verification purposes.</p>" +
      "<div style='margin-top:50px'>" +
      "<p style='font-size:14px'>Regards,</p>" +
      "<div class='sig-line'></div>" +
      "<div class='sig-name'>School Principal</div>" +
      "<div class='sig-title'>Al-Huffath Academy</div>" +
      "</div>" +
      "<div style='margin-top:30px'><button onclick='window.print()' style='padding:10px 28px;background:#0d9488;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;font-family:inherit'>Print Report</button></div>" +
      "<div class='footer'>Generated by EduManage &nbsp;|&nbsp; Developed by Eng. Ahmad Zouikli &nbsp;|&nbsp; " + new Date().toLocaleDateString() + "</div>" +
      "</body></html>"
    );
    win.document.close();'''

if old_write in content:
    content = content.replace(old_write, new_write)
    print('Student report updated!')
else:
    print('ERROR: not found!')
    # Try partial match
    partial = 'win.document.write(\n      "<html><head><title>Report - " + s.name'
    if partial in content:
        print('Found partial match - need different approach')
        start = content.find(partial, idx)
        end = content.find('win.document.close();', start) + len('win.document.close();')
        old_section = content[start:end]
        content = content.replace(old_section, new_write)
        print('Fixed with partial match!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
