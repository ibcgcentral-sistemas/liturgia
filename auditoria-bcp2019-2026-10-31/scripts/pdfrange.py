import pdfplumber,sys,re
pdf=pdfplumber.open(sys.argv[1])
a=int(sys.argv[2]); b=int(sys.argv[3])
out=[]
for pg in range(a,b+1):
    p=pdf.pages[pg-1]
    t=p.extract_text(layout=True, x_density=5, y_density=10)
    t='\n'.join(l.rstrip() for l in t.split('\n') if l.strip())
    out.append('=== PDF p.%d (libro p.%d) ===\n%s\n'%(pg,pg-8,t))
open(sys.argv[4],'w',encoding='utf-8').write('\n'.join(out))
