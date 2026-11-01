import pdfplumber,sys
pdf=pdfplumber.open(sys.argv[1])
print(len(pdf.pages))
for i in (0,1,2):
    print(i, repr((pdf.pages[i].extract_text() or '')[:150]))
