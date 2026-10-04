import json
import re

with open('s5_raw_syllabus.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for k in sorted(data.keys()):
    text = data[k]
    code_m = re.search(r'course_code:\s*"?([^\n"]+)"?', text)
    title_m = re.search(r'course_title:\s*"?([^\n"]+)"?', text)
    code = code_m.group(1).lower() if code_m else k
    title = title_m.group(1) if title_m else k
    
    # find modules
    modules = re.findall(r'###\s+Module\s+(\d+)[:\s\-]+([^\n]+)', text, re.IGNORECASE)
    if not modules:
        modules = re.findall(r'##\s+Module\s+(\d+)[:\s\-]+([^\n]+)', text, re.IGNORECASE)
    print(f"{k}: code={code}, title={title}, found {len(modules)} modules")
    for m_num, m_name in modules[:4]:
        print(f"   Mod {m_num}: {m_name}")
