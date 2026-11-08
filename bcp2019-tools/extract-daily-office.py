# Extrae del PDF «Daily Office Lectionary» (BCP 2019, St. Andrew's Day Final Revision, 2018) la tabla de lecturas por fecha.
# La tabla es de CITAS bíblicas, por día del mes: Oración Matutina y Oración Vespertina, cada una con primera y segunda
# lección, y el salmo del ciclo de 60 días. El texto de las lecturas sale de la Biblia de Jerusalén, no de aquí.
# Uso: python -P bcp2019-tools/extract-daily-office.py Daily-Office-Lectionary-FINAL.pdf [salida.json]
# Necesita pdfplumber. El PDF NO está en el repositorio; el JSON generado sí (bcp2019-tools/data/daily-office.json) y
# bcp2019-tools/build-daily-office.js lo convierte en bcp2019/js/daily-office.js. Los datos del PDF son DATOS: se leen, no se ejecutan.
# Cada mes viene dos veces en el PDF, (i) y (ii), con el mismo contenido y el diseño desplazado una página de ancho: se leen las dos
# y el script falla a la vista si no coinciden.
import json, re, sys
import pdfplumber

MESES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
DIAS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
ANCHO = 387.0
# Límites de columna (x0 de la primera palabra de cada celda), medidos en las páginas de la tabla.
COLS = [('d1', 0, 95), ('l1a', 95, 200), ('l1b', 200, 290), ('psMP', 290, 425), ('psEP', 425, 488),
        ('d2', 488, 545), ('l2a', 545, 640), ('l2b', 640, 999)]


def col(x):
    for n, a, b in COLS:
        if a <= x < b:
            return n
    return None


def paginas_de_mes(pdf):
    out = {}
    for p in pdf.pages:
        t = ' '.join((p.extract_text() or '').lower().split())
        m = re.match(r'^(' + '|'.join(MESES) + r') \((i|ii)\)', t)
        if m:
            out[(m.group(1), m.group(2))] = p
    return out


def celdas(page, ndias):
    words = page.extract_words(x_tolerance=1.5, y_tolerance=2)
    # Las páginas (ii) están desplazadas una página de ancho a la izquierda: se vuelven a poner en su sitio.
    if min(w['x0'] for w in words) < -50:
        for w in words:
            w['x0'] += ANCHO
    # Anclas: el número de día de la columna izquierda, en orden y sin pasar del último día del mes (las notas al pie
    # de la página también empiezan por un número).
    anclas = {}
    for w in sorted(words, key=lambda w: w['top']):
        if re.fullmatch(r'\d{1,2}', w['text']) and 40 <= w['x0'] < 60 and w['top'] > 85:
            d = int(w['text'])
            if 1 <= d <= ndias and d not in anclas:
                anclas[d] = w['top']
    filas = {d: {n: [] for n, _, _ in COLS} for d in anclas}
    lista = sorted((t, d) for d, t in anclas.items())
    for w in words:
        c = col(w['x0'])
        if c is None or w['top'] < 85:
            continue
        top, dia = min(lista, key=lambda a: abs(a[0] - w['top']))
        if abs(top - w['top']) > 7:
            continue
        filas[dia][c].append((round(w['top'], 1), w['x0'], w['text']))
    return filas


def ordenar(celda):
    return sorted(celda, key=lambda e: (round(e[0] / 3), e[1]))


def texto(celda):
    return ' '.join(t for _, _, t in ordenar(celda))


def leccion(celda):
    t = re.sub(r'\s+', ' ', texto(celda)).strip()
    if not t:
        return None
    base, _, corta = t.partition('†')
    r = {'ref': base.strip()}
    if corta.strip():
        r['abrev'] = corta.strip()
    return r


def salmos(celda):
    t = re.sub(r'\s+', ' ', texto(celda)).strip()
    return [s.strip() for s in re.split(r',\s*', t) if s.strip()] if t else []


def nombre(celda):
    # La columna de fecha trae el número y, a veces, el nombre de la fiesta (All Saints, Holy Name…) o la marca ‡.
    toks = [t for _, x, t in ordenar(celda) if not re.fullmatch(r'\d{1,2}|‡', t)]
    return ' '.join(toks) or None


def mes(page, ndias):
    filas = celdas(page, ndias)
    out = {}
    for dia, c in sorted(filas.items()):
        n2 = [t for _, _, t in c['d2'] if re.fullmatch(r'\d{1,2}', t)]
        v = {
            'name': nombre(c['d1']) or nombre(c['d2']),
            'mp': {'first': leccion(c['l1a']), 'second': leccion(c['l1b']), 'psalms': salmos(c['psMP'])},
            'ep': {'first': leccion(c['l2a']), 'second': leccion(c['l2b']), 'psalms': salmos(c['psEP'])},
        }
        if any(t == '‡' for _, _, t in c['d1']):
            v['movable'] = True
        if n2 != [str(dia)]:
            v['_fecha2'] = n2
        out[dia] = v
    return out


def main():
    pdf = pdfplumber.open(sys.argv[1])
    ruta = sys.argv[2] if len(sys.argv) > 2 else 'bcp2019-tools/data/daily-office.json'
    paginas = paginas_de_mes(pdf)
    data, problemas = {}, []
    for i, m in enumerate(MESES, 1):
        nd = DIAS[i - 1]
        a, b = paginas.get((m, 'i')), paginas.get((m, 'ii'))
        if a is None or b is None:
            problemas.append(f'{m}: falta una de las dos páginas')
            continue
        ma, mb = mes(a, nd), mes(b, nd)
        # La marca ‡ (día de una fiesta móvil) cae en el margen y no siempre sale en las dos páginas: no es dato de lectura.
        sin = lambda m_: {d: {k: x for k, x in v.items() if k != 'movable'} for d, v in m_.items()}
        if sin(ma) != sin(mb):
            dif = [d for d in sorted(set(ma) | set(mb)) if sin(ma).get(d) != sin(mb).get(d)]
            problemas.append(f'{m}: las páginas (i) y (ii) difieren en los días {dif}')
        faltan = [d for d in range(1, nd + 1) if d not in ma]
        if faltan:
            problemas.append(f'{m}: faltan los días {faltan}')
        for d, v in ma.items():
            if '_fecha2' in v:
                problemas.append(f'{m} {d}: la fecha de la columna derecha dice {v["_fecha2"]}')
            for of in ('mp', 'ep'):
                for k in ('first', 'second'):
                    if v[of][k] is None:
                        problemas.append(f'{m} {d}: sin {of} {k}')
                if not v[of]['psalms']:
                    problemas.append(f'{m} {d}: sin salmos {of}')
        data[f'{i:02d}'] = {str(d): {k: x for k, x in v.items() if k != '_fecha2'} for d, v in sorted(ma.items())}
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
    print(f'escrito {ruta}: {sum(len(v) for v in data.values())} días')
    for p in problemas:
        print('PROBLEMA', p)
    sys.exit(1 if problemas else 0)


main()
