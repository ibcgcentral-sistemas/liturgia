import pdfplumber,sys
pdf=pdfplumber.open(sys.argv[1])
for i in range(700,780):
    t=(pdf.pages[i].extract_text() or '')
    if 'lectionary' in t.lower() and ('year a' in t.lower() or 'sunday, holy day' in t.lower()):
        print(i+1, t[:100].replace('\n',' | '), '...', t[-60:].replace('\n',' | '))
