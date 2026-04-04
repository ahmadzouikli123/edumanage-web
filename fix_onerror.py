# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = '"<img src=\'/logo.png\' class=\'logo\' onerror=\\"this.style.display=\'none\'\\\" />" +'
new = '"<img src=\'/logo.png\' class=\'logo\' />" +'

if old in content:
    content = content.replace(old, new)
    print('Fixed!')
else:
    # Try another pattern
    old2 = "\"<img src='/logo.png' class='logo' onerror=\\\"this.style.display='none'\\\" />\" +"
    if old2 in content:
        content = content.replace(old2, '"<img src=\'/logo.png\' class=\'logo\' />" +')
        print('Fixed v2!')
    else:
        idx = content.find('onerror')
        if idx != -1:
            print(repr(content[idx-50:idx+80]))
        else:
            print('onerror not found')
        # Find and fix the logo line
        idx2 = content.find("logo.png' class='logo'")
        if idx2 != -1:
            start = content.rfind('"<img', idx2-20)
            end = content.find('/>" +', idx2) + len('/>" +')
            old_line = content[start:end]
            new_line = '"<img src=\'/logo.png\' class=\'logo\' />" +'
            content = content.replace(old_line, new_line)
            print('Fixed v3!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
