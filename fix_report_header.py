# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old_header = (
    "\"<div class='header'>\" +"
    "\n                        \"<img src='/logo.png' class='logo' />\" +"
    "\n                        \"<div class='school-info'>\" +"
    "\n                        \"<div class='school-name'>Al-Huffath Academy</div>\" +"
    "\n                        \"<div class='school-sub'>Ilm | Iman | Hifz</div>\" +"
    "\n                        \"<div class='school-sub' style='margin-top:2px;font-size:11px'>admin@al-huffath.edu</div>\" +"
    "\n                        \"</div>\" +"
    "\n                        \"</div>\" +"
)

new_header = (
    "\"<div class='header'>\" +"
    "\n                        \"<div class='school-info'>\" +"
    "\n                        \"<div class='school-name'>Al-Huffath Academy</div>\" +"
    "\n                        \"<div class='school-sub'>Ilm | Iman | Hifz</div>\" +"
    "\n                        \"<div class='school-sub' style='margin-top:2px;font-size:11px'>admin@al-huffath.edu</div>\" +"
    "\n                        \"</div>\" +"
    "\n                        \"<img src='/logo.png' class='logo' />\" +"
    "\n                        \"<div style='width:200px'></div>\" +"
    "\n                        \"</div>\" +"
)

if old_header in content:
    content = content.replace(old_header, new_header)
    print('Header fixed!')
else:
    # Try to find and fix manually
    idx = content.find("\"<div class='header'>\"")
    if idx != -1:
        end = content.find("\"</div>\" +\n                        \"<div class='date-block'>\"", idx)
        if end != -1:
            old_block = content[idx:end + len("\"</div>\" +")]
            new_block = (
                "\"<div class='header'>\" +"
                "\n                        \"<div class='school-info'>\" +"
                "\n                        \"<div class='school-name'>Al-Huffath Academy</div>\" +"
                "\n                        \"<div class='school-sub'>Ilm | Iman | Hifz</div>\" +"
                "\n                        \"<div class='school-sub' style='margin-top:2px;font-size:11px'>admin@al-huffath.edu</div>\" +"
                "\n                        \"</div>\" +"
                "\n                        \"<img src='/logo.png' class='logo' />\" +"
                "\n                        \"<div style='width:200px'></div>\" +"
                "\n                        \"</div>\" +"
            )
            content = content.replace(old_block, new_block)
            print('Header fixed v2!')
        else:
            print('ERROR: end not found')
            print(repr(content[idx:idx+500]))
    else:
        print('ERROR: header not found')

# Also update CSS for header to use space-between with logo in center
old_css = "'.header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }'"
new_css = "'.header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }'"

# Update logo CSS to be centered
old_logo_css = "'.logo { width: 80px; height: 80px; object-fit: contain; }'"
new_logo_css = "'.logo { width: 90px; height: 90px; object-fit: contain; position: absolute; left: 50%; transform: translateX(-50%); }'"

# Update header CSS position
old_header_css = "'.header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }'"
new_header_css = "'.header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; position: relative; }'"

for old, new, msg in [(old_logo_css, new_logo_css, 'Logo CSS updated!'), (old_header_css, new_header_css, 'Header CSS updated!')]:
    if old in content:
        content = content.replace(old, new)
        print(msg)

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
