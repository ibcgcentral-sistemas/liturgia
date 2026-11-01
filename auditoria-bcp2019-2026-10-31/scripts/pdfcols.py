import pdfplumber,sys,re
pdf=pdfplumber.open(sys.argv[1])
a=int(sys.argv[2]); b=int(sys.argv[3])
out=[]
for pg in range(a,b+1):
    p=pdf.pages[pg-1]
    words=p.extract_words(x_tolerance=1.5,y_tolerance=2,keep_blank_chars=False,use_text_flow=False,extra_attrs=['fontname','size'])
    # header positions
    hdr=[w for w in words if w['text'].lower() in ('year',)]
    ya=yb=yc=None
    xs=[]
    for i,w in enumerate(words):
        if w['text'].lower()=='year' and i+1<len(words):
            nxt=words[i+1]
            xs.append((nxt['text'].lower(), w['x0']))
    xmap={k:v for k,v in xs}
    xa=xmap.get('a'); xb=xmap.get('b'); xc=xmap.get('c')
    out.append('=== PDF p.%d (libro p.%d) colstart A=%s B=%s C=%s width=%s'%(pg,pg-8,xa,xb,xc,p.width))
    if xa is None:
        out.append('  (no header)'); 
        continue
    # lines by (col, y)
    def col_of(w):
        x=w['x0']
        if x < xa-3: return 'L'
        if xb is not None and x < xb-3: return 'A'
        if xc is not None and x < xc-3: return 'B'
        return 'C'
    rows={}
    for w in words:
        top=round(w['top']/1.0)
        c=col_of(w)
        rows.setdefault((c,top),[]).append(w)
    # merge near y
    for col in 'LABC':
        out.append('-- col %s'%col)
        items=sorted([(k[1],v) for k,v in rows.items() if k[0]==col])
        for y,ws in items:
            ws=sorted(ws,key=lambda w:w['x0'])
            it = any('Italic' in w['fontname'] or 'Obl' in w['fontname'] for w in ws)
            out.append('  y=%4d x=%5.1f %s%s'%(y,ws[0]['x0'],' '.join(w['text'] for w in ws),'  [ITALIC]' if it else ''))
open(sys.argv[4],'w',encoding='utf-8').write('\n'.join(out))
