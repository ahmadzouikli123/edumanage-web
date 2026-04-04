# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find the monthly report div and remove it from its current position
old_report_pos = '''      {/* Monthly Report Button */}
      <div style={{ marginTop: 16, background: "linear-gradient(135deg,#1e1e3a,#0d9488)", borderRadius: T.radius, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(13,148,136,.3)" }}>'''

# Check if it exists
if old_report_pos in content:
    # Find the full monthly report block end
    start = content.find('      {/* Monthly Report Button */}')
    end = content.find('      {/* Quick Actions */}', start)
    monthly_block = content[start:end]
    
    # Remove from current position
    content = content[:start] + content[end:]
    
    # Add at the top of Dashboard return
    old_top = '    <div>\n      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 28 }}>'
    new_top = '    <div>\n      ' + monthly_block.strip() + '\n\n      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 28, marginTop: 16 }}>'
    
    if old_top in content:
        content = content.replace(old_top, new_top)
        print('Report moved to top!')
    else:
        print('ERROR: top not found!')
else:
    print('ERROR: monthly report block not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
