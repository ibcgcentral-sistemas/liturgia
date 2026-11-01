import pdfplumber,sys
pdf=pdfplumber.open(sys.argv[1])
pg=int(sys.argv[2])
p=pdf.pages[pg-1]
print(p.width,p.height)
t=p.extract_text(layout=True, x_density=5, y_density=10)
print(t)
