/**
 * docx-export.js — Exportar liturgia a Word (.docx)
 * Requiere: js/lib/docx.iife.js (window.docx) y js/lib/FileSaver.min.js (window.saveAs)
 */

async function downloadDocx() {
  const outputEl = document.getElementById('liturgy-output');
  if (!outputEl || outputEl.classList.contains('hidden') || !outputEl.querySelector('.feast-header')) {
    alert('Por favor, genera la liturgia primero.');
    return;
  }

  const btn = document.getElementById('docx-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }

  try {
    const {
      Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType, ImageRun, Header, Footer, PageNumber,
      Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign
    } = window.docx;

    // ── Precarga de Imágenes EN PARALELO ────────────────────────────────────
    const imageCache = {};
    const imgUrls = ['img/woodcut-gospel.png', 'img/woodcut-canon.png', 'img/woodcut-agnus.png'];
    await Promise.all(imgUrls.map(async url => {
      try {
        const res = await fetch(url);
        if (res.ok) imageCache[url] = await res.arrayBuffer();
      } catch (e) { console.warn('No se pudo cargar imagen DOCX', url); }
    }));

    // Ceder el hilo al navegador para que renderice el botón "Generando..."
    await new Promise(resolve => setTimeout(resolve, 0));

    // ── Constantes tipográficas premium (Misal Editorial) ───────────────────
    const FONT  = 'Palatino Linotype';
    const SZ    = 22;   // 11pt - Cuerpo de texto
    const SZ_SM = 18;   // 9pt  - Rúbricas e información menor
    const SZ_MD = 24;   // 12pt - Títulos ordinarios
    const SZ_LG = 28;   // 14pt - Títulos de sección principal
    const SZ_XL = 38;   // 19pt - Nombre de la Solemnidad / Fiesta
    const C_INK = '1E120A';  // Tinta marrón oscura (pergamino premium)
    const C_RUB = 'C00000';  // Rojo cardenalicio litúrgico
    const C_META = '555555'; // Gris para metadatos y encabezados
    const C_GOLD = 'C5A059'; // Dorado litúrgico para bordes decorativos

    // ── Helpers de Formato ───────────────────────────────────────────────────

    const emptyLine = (after = 120) =>
      new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after } });

    const rubricPara = (text, indentLeft = 0) =>
      new Paragraph({
        children: [new TextRun({ text, italics: true, color: C_RUB, size: SZ_SM, font: FONT })],
        indent: indentLeft ? { left: indentLeft } : undefined,
        spacing: { before: 60, after: 60 },
      });

    /**
     * Convierte el contenido de un nodo DOM en TextRun[],
     * respetando rúbricas inline (rojo), números de versículo (superscript) y <br>.
     */
    // ── Sanitizador de texto: elimina caracteres inválidos en XML 1.0 ───────────
    function sanitizeText(t) {
      if (!t) return '';
      // Eliminar caracteres de control inválidos en XML 1.0 (excepto \t \n \r)
      // eslint-disable-next-line no-control-regex
      return String(t).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }

    function buildRuns(node, opts = {}) {
      const { bold = false, italic = false, color = C_INK, size = SZ } = opts;
      const runs = [];

      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const t = sanitizeText(child.textContent);
          if (t) runs.push(new TextRun({ text: t, bold, italics: italic, color, size, font: FONT }));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const cls = child.classList;
          const tag = child.tagName;

          if (cls.contains('lit-rubric') || cls.contains('rubric') || (tag === 'EM' && cls.contains('rubric'))) {
            const t = sanitizeText(child.textContent);
            if (t.trim()) runs.push(new TextRun({ text: t, italics: true, color: C_RUB, size: SZ_SM, font: FONT }));
          } else if (tag === 'SUP' && cls.contains('verse-num')) {
            runs.push(new TextRun({ text: sanitizeText(child.textContent), superScript: true, size: 16, color: '777777', font: FONT }));
          } else if (tag === 'BR') {
            runs.push(new TextRun({ break: 1 }));
          } else if (tag === 'STRONG') {
            runs.push(...buildRuns(child, { bold: true, italic, color, size }));
          } else if (tag === 'EM') {
            runs.push(...buildRuns(child, { bold, italic: true, color, size }));
          } else {
            runs.push(...buildRuns(child, opts));
          }
        }
      }
      return runs.length ? runs : [new TextRun({ text: ' ', size, font: FONT })];
    }

    // ── Recolector de párrafos ────────────────────────────────────────────────
    let paras = [];

    // ── Procesador principal de elementos ────────────────────────────────────
    function walkElement(el) {
      const cls = el.classList;
      const tag = el.tagName;

      // Interceptar filas bilingües — tabla paralela Español | Latín
      if (cls.contains('lit-bilingual-row')) {
        const colLa = el.querySelector('.lit-column-la');
        const colEs = el.querySelector('.lit-column-es');
        if (colLa && colEs) {
          const originalParas = paras;
          const C_TINT = 'F5F1E3'; // Tinte pergamino para distinguir la columna de referencia (Latín)

          // Recolectar párrafos de la columna Español (izquierda)
          const esParas = [];
          paras = esParas;
          for (const child of colEs.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) walkElement(child);
          }
          if (esParas.length === 0) {
            esParas.push(new Paragraph({ children: buildRuns(colEs), spacing: { before: 30, after: 30, line: 264 } }));
          }

          // Recolectar párrafos de la columna Latín (derecha)
          const laParas = [];
          paras = laParas;
          for (const child of colLa.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) walkElement(child);
          }
          if (laParas.length === 0) {
            laParas.push(new Paragraph({ children: buildRuns(colLa), spacing: { before: 30, after: 30, line: 264 } }));
          }

          paras = originalParas;

          // ¿Es el primer renglón de un bloque bilingüe consecutivo? → encabezar columnas
          const isBlockStart = !el.previousElementSibling || !el.previousElementSibling.classList.contains('lit-bilingual-row');
          const isBlockEnd = !el.nextElementSibling || !el.nextElementSibling.classList.contains('lit-bilingual-row');

          if (isBlockStart) {
            const headerCell = (text) => new TableCell({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text, bold: true, size: SZ_SM, color: C_RUB, font: FONT })],
              })],
              width: { size: 4350, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 60, bottom: 60 },
            });
            paras.push(new Table({
              columnWidths: [4350, 4350],
              layout: docx.TableLayoutType ? docx.TableLayoutType.FIXED : "fixed",
              rows: [new TableRow({ children: [headerCell('ESPAÑOL'), headerCell('LATÍN')] })],
              borders: {
                top:              { style: BorderStyle.NONE },
                left:             { style: BorderStyle.NONE },
                right:            { style: BorderStyle.NONE },
                bottom:           { style: BorderStyle.SINGLE, size: 6, color: C_GOLD, space: 0 },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: C_GOLD, space: 0 }
              },
              width: { size: 100, type: WidthType.PERCENTAGE }
            }));
          }

          // Crear tabla paralela Español (izquierda) | Latín (derecha, con tinte de referencia)
          const table = new Table({
            columnWidths: [4350, 4350],
            layout: docx.TableLayoutType ? docx.TableLayoutType.FIXED : "fixed",
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: esParas,
                    width: { size: 4350, type: WidthType.DXA },
                    margins: { top: 40, bottom: 40, right: 200 }
                  }),
                  new TableCell({
                    children: laParas,
                    width: { size: 4350, type: WidthType.DXA },
                    margins: { top: 40, bottom: 40, left: 200 },
                    shading: { type: ShadingType.CLEAR, color: 'auto', fill: C_TINT }
                  })
                ]
              })
            ],
            borders: {
              top:              { style: BorderStyle.NONE },
              bottom:           isBlockEnd ? { style: BorderStyle.NONE } : { style: BorderStyle.DOTTED, size: 4, color: C_GOLD, space: 4 },
              left:             { style: BorderStyle.NONE },
              right:            { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical:   { style: BorderStyle.DOTTED, size: 4, color: C_GOLD, space: 0 }
            },
            width: { size: 100, type: WidthType.PERCENTAGE }
          });

          paras.push(table);
          return;
        }
      }

      // 1. Portada del Misal Premium
      if (cls.contains('cover-page')) {
        // innerText (no textContent) para que el <br> entre "MISSALE" y "ANGLICANUM" se respete como espacio
        const title    = el.querySelector('.cover-title')?.innerText?.trim().replace(/\s+/g, ' ') || 'MISSALE ANGLICANUM';
        const feast    = el.querySelector('.cover-feast')?.textContent?.trim() || '';
        const date     = el.querySelector('.cover-date')?.textContent?.trim() || '';
        const quote    = el.querySelector('.quote-text')?.textContent?.trim() || '';
        const author   = el.querySelector('.quote-author')?.textContent?.trim() || '';

        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '✠', size: 120, color: C_RUB, font: FONT })],
          spacing: { before: 2000, after: 800 },
        }));
        
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: title, bold: true, size: 76, color: C_INK, font: FONT })],
          spacing: { before: 0, after: 1400 },
        }));

        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '❖   ❖   ❖', size: 20, color: C_GOLD, font: FONT })],
          spacing: { before: 0, after: 1400 },
        }));

        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: feast.toUpperCase(), bold: true, size: 44, color: C_RUB, font: FONT })],
          spacing: { before: 0, after: 400 },
        }));

        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: date, italics: true, size: 28, color: C_META, font: FONT })],
          spacing: { before: 0, after: 2800 },
        }));

        if (quote) {
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `« ${quote} »`, italics: true, size: 24, color: C_INK, font: FONT })],
            border: {
              top: { style: BorderStyle.SINGLE, size: 4, color: C_GOLD, space: 10 },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: C_GOLD, space: 10 }
            },
            indent: { left: 720, right: 720 },
            spacing: { before: 200, after: 200 },
          }));
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: author.toUpperCase(), bold: true, size: 18, color: C_RUB, font: FONT })],
            spacing: { before: 100, after: 0 },
          }));
        }

        // SALTO DE PÁGINA TRAS PORTADA
        paras.push(new Paragraph({
          children: [new TextRun({ text: ' ' })],
          pageBreakBefore: true
        }));
        return;
      }

      // 2. Cabecera Elegante de la Misa
      if (cls.contains('feast-header')) {
        const name  = el.querySelector('.feast-name-en')?.textContent?.trim() || '';
        const date  = el.querySelector('.feast-date')?.textContent?.trim() || '';
        const spans = el.querySelectorAll('.feast-meta span');
        const meta  = Array.from(spans).map(s => s.textContent.trim()).join('   ·   ');

        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '✠   PROPÓSITO Y TEXTOS DE LA MISA   ✠', bold: true, size: 22, color: C_RUB, font: FONT })],
          spacing: { before: 200, after: 200 },
        }));
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: name.toUpperCase(), bold: true, size: SZ_XL, color: C_INK, font: FONT })],
          spacing: { before: 0, after: 100 },
        }));
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: date, italics: true, size: 22, color: C_META, font: FONT })],
          spacing: { before: 0, after: 80 },
        }));
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: meta, size: 18, color: C_META, font: FONT })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C_GOLD, space: 8 } },
          spacing: { before: 0, after: 400 },
        }));
        return;
      }

      // 3. Rúbricas y advertencias litúrgicas
      if (cls.contains('omission-notes')) {
        el.querySelectorAll('li').forEach(li => paras.push(rubricPara('⚬ ' + li.textContent.trim(), 180)));
        paras.push(emptyLine(120));
        return;
      }

      // 4. Secciones contenedoras generales
      if (cls.contains('mass-section') || cls.contains('intercessions')) {
        walkChildren(el);
        return;
      }

      // 5. Ilustraciones e Grabados Litúrgicos
      if (tag === 'IMG') {
        const srcAttr = el.getAttribute('src');
        if (srcAttr && imageCache[srcAttr]) {
          let w = 85; let h = 85;
          if (srcAttr.includes('canon')) { w = 110; h = 110; }
          else if (srcAttr.includes('agnus')) { w = 90; h = 90; }
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new ImageRun({
              data: imageCache[srcAttr],
              type: 'png',
              transformation: { width: w, height: h }
            })],
            spacing: { before: 300, after: 300 }
          }));
        }
        return;
      }

      // 6. Título Principal de Sección (e.g. CANON, LITURGIA DE LA PALABRA)
      if (cls.contains('section-title') && cls.contains('main-section')) {
        paras.push(emptyLine(200));
        let pageBreakBefore = el.textContent.includes('CANON') || el.textContent.includes('PUEBLO') || el.textContent.includes('MANUAL');
        paras.push(new Paragraph({
          children: [new TextRun({ text: sanitizeText(el.textContent.trim()).toUpperCase(), bold: true, size: SZ_LG, color: C_RUB, font: FONT })],
          border: {
            top: { style: BorderStyle.SINGLE, size: 6, color: C_GOLD, space: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: C_GOLD, space: 6 }
          },
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 300 },
          pageBreakBefore
        }));
        return;
      }

      // 7. Subtítulos y rúbricas estructurales
      if (cls.contains('section-title') || tag === 'H3' || tag === 'H4') {
        paras.push(new Paragraph({
          children: [new TextRun({ text: el.textContent.trim().toUpperCase(), bold: true, size: SZ_MD, color: C_INK, font: FONT })],
          spacing: { before: 300, after: 120 },
        }));
        return;
      }

      // 8. Contenedor de Texto Litúrgico General (Ordinarios, Diálogos)
      if (cls.contains('liturgical-text-block')) {
        const hasStructuredSpans = el.querySelector('.lit-line, .lit-consecracion, .lit-title, .lit-prayer');
        
        if (!hasStructuredSpans) {
          paras.push(new Paragraph({
            children: buildRuns(el),
            spacing: { before: 120, after: 120, line: 276 },
            alignment: AlignmentType.JUSTIFIED
          }));
        } else {
          for (const child of el.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
              const t = child.textContent.trim();
              if (t) {
                paras.push(new Paragraph({
                  children: [new TextRun({ text: t, size: SZ, font: FONT })],
                  spacing: { before: 60, after: 60, line: 276 },
                }));
              }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              // Las filas bilingües (tabla Español|Latín) son <div>, no spans lit-*: deben
              // pasar por walkElement para llegar a la lógica de tabla, no a walkSpan.
              if (child.classList.contains('lit-bilingual-row')) walkElement(child);
              else walkSpan(child);
            }
          }
        }
        return;
      }

      // 9. Oraciones e Colectas (Con línea decorativa al margen izquierdo)
      if (cls.contains('prayer-text') || cls.contains('collect-text')) {
        paras.push(new Paragraph({
          children: buildRuns(el),
          indent: { left: 450, right: 450 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: C_RUB, space: 15 } },
          spacing: { before: 180, after: 180, line: 300 },
          alignment: AlignmentType.JUSTIFIED,
        }));
        return;
      }

      // 10. Rúbricas entre lecturas o cantos
      if (cls.contains('rubric') || cls.contains('gospel-incensation')) {
        paras.push(new Paragraph({
          children: buildRuns(el, { italic: true, color: C_RUB, size: SZ_SM }),
          spacing: { before: 100, after: 100 },
        }));
        return;
      }

      // 11. Respuestas de Aclamaciones
      if (cls.contains('response')) {
        paras.push(new Paragraph({
          children: buildRuns(el),
          spacing: { before: 100, after: 100 },
        }));
        return;
      }

      // 12. Texto de las Sagradas Escrituras (Lecturas / Evangelios con barra dorada)
      if (cls.contains('scripture-text')) {
        const pTags = el.querySelectorAll('p');
        if (pTags.length > 0) {
          pTags.forEach(p => {
            paras.push(new Paragraph({
              children: buildRuns(p),
              indent: { left: 450, right: 450 },
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: C_GOLD, space: 15 } },
              spacing: { before: 140, after: 140, line: 300 },
              alignment: AlignmentType.JUSTIFIED,
            }));
          });
        } else {
          paras.push(new Paragraph({
            children: buildRuns(el),
            indent: { left: 450, right: 450 },
            border: { left: { style: BorderStyle.SINGLE, size: 18, color: C_GOLD, space: 15 } },
            spacing: { before: 140, after: 140, line: 300 },
            alignment: AlignmentType.JUSTIFIED,
          }));
        }
        return;
      }

      // 13. Peticiones de las preces / intercesiones
      if (cls.contains('petition')) {
        const intro = el.querySelector('.petition-intro');
        const body  = el.querySelector('.petition-text');
        if (intro) paras.push(rubricPara(intro.textContent.trim(), 180));
        if (body) {
          paras.push(new Paragraph({
            children: buildRuns(body),
            indent: { left: 450, right: 360 },
            border: { left: { style: BorderStyle.SINGLE, size: 8, color: C_GOLD, space: 10 } },
            spacing: { before: 60, after: 100 },
          }));
        }
        return;
      }

      // 14. Pie del Documento Misal
      if (cls.contains('liturgy-footer')) {
        paras.push(emptyLine(200));
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: el.textContent.trim().replace(/\s+/g, ' '), italics: true, size: 18, color: C_META, font: FONT })],
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: C_GOLD, space: 12 } },
          spacing: { before: 200, after: 0 },
        }));
        return;
      }

      // Reconocer spans litúrgicos directamente (cuando no están dentro de liturgical-text-block)
      if (
        cls.contains('lit-line') || cls.contains('lit-rubric') ||
        cls.contains('lit-title') || cls.contains('lit-consecracion') ||
        cls.contains('lit-prayer')
      ) {
        walkSpan(el);
        return;
      }

      // Fallback: recursión
      walkChildren(el);
    }

    function walkChildren(container) {
      for (const child of container.children) walkElement(child);
    }

    // ── Procesador de spans litúrgicos (.lit-*) ───────────────────────────────
    function walkSpan(span) {
      const cls = span.classList;

      // Rúbrica autónoma
      if (cls.contains('lit-rubric')) {
        const t = span.textContent.trim();
        if (t) paras.push(rubricPara(t, 180));
        return;
      }

      // Título litúrgico de fragmentos del canon
      if (cls.contains('lit-title')) {
        paras.push(new Paragraph({
          children: [new TextRun({ text: sanitizeText(span.textContent.trim()).toUpperCase(), bold: true, size: SZ, color: C_RUB, font: FONT })],
          spacing: { before: 180, after: 60 },
        }));
        return;
      }

      // Consagración Suprema con Marco Editorial Histórico
      if (cls.contains('lit-consecracion')) {
        const rawLines = (span.innerText || span.textContent).split('\n');
        const lines    = rawLines.map(l => l.trim()).filter(Boolean);
        paras.push(emptyLine(80));
        lines.forEach((line, i) => {
          const border = {
            left: { style: BorderStyle.SINGLE, size: 8, color: C_RUB, space: 20 },
            right: { style: BorderStyle.SINGLE, size: 8, color: C_RUB, space: 20 }
          };
          if (i === 0) border.top = { style: BorderStyle.DOUBLE, size: 12, color: C_RUB, space: 12 };
          if (i === lines.length - 1) border.bottom = { style: BorderStyle.DOUBLE, size: 12, color: C_RUB, space: 12 };
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: sanitizeText(line).toUpperCase(), bold: true, size: 24, color: C_INK, font: FONT })],
            border: border,
            spacing: { before: 40, after: 40 },
          }));
        });
        paras.push(emptyLine(80));
        return;
      }

      // Oración litúrgica
      if (cls.contains('lit-prayer')) {
        paras.push(new Paragraph({
          children: buildRuns(span),
          indent: { left: 450 },
          spacing: { before: 60, after: 60 },
        }));
        return;
      }

      // Línea de Diálogo o Canto alternado (Sacerdote/Pueblo)
      if (cls.contains('lit-line')) {
        const label   = span.querySelector('.lit-label')?.textContent?.trim() ?? '';
        const textEl  = span.querySelector('.lit-text');
        if (!textEl) return;

        // Negrita para pueblo, ministros y todos (el sacerdote solo lleva label en rojo)
        const isPeoplePart = cls.contains('pueblo') || cls.contains('todos') ||
                             cls.contains('ministros') || cls.contains('lector');

        paras.push(new Paragraph({
          children: [
            new TextRun({ text: label + '\t', bold: true, size: SZ, color: C_RUB, font: FONT }),
            ...buildRuns(textEl, { bold: isPeoplePart }),
          ],
          tabStops: [{ type: TabStopType.LEFT, position: 600 }],
          indent: { left: 600, hanging: 600 },
          spacing: { before: 30, after: 30, line: 264 },
        }));
        return;
      }

      // Fallback de elementos span
      let opts = {};
      if (cls.contains('rubric') || cls.contains('lit-rubric') || span.tagName === 'EM') {
        opts = { italic: true, color: C_RUB, size: SZ_SM };
      }
      const runs = buildRuns(span, opts);
      if (runs.length) {
        paras.push(new Paragraph({
          children: runs,
          spacing: { before: 100, after: 100, line: 280 },
        }));
      }
    }

    // ── Recorrer y construir el árbol de elementos ────────────────────────────
    const docContainer = outputEl.querySelector('.liturgy-document') || outputEl;
    walkChildren(docContainer);

    // ── Nombre del archivo ────────────────────────────────────────────────────
    const feastName = outputEl.querySelector('.feast-name-en')?.textContent?.trim() || 'Liturgia';
    const safeName  = feastName.replace(/[^\wáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().substring(0, 40);
    const filename  = ('Misal-' + safeName + '.docx').replace(/\s+/g, '-');

    // ── Ensamblado del Documento Word Premium ───
    const wordDoc = new Document({
      creator: 'Misal Anglicano Premium',
      title: feastName,
      description: 'Generado por el Misal Anglicano',
      styles: {
        default: { document: { run: { font: FONT, size: SZ } } },
      },
      sections: [{
        properties: {
          page: {
            size:   { width: 11906, height: 16838 }, // Formato A4 estándar
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // Márgenes elegantes de 1 pulgada (2.54 cm)
          },
        },
        children: paras,
      }],
    });

    // Packer.toBlob() es verdaderamente asíncrono — no bloquea el hilo principal
    const rawBlob = await Packer.toBlob(wordDoc);
    // Tipo MIME correcto para .docx — evita la advertencia de descarga insegura en Chrome/Edge
    const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = new Blob([rawBlob], { type: DOCX_MIME });

    // Compatibilidad con Edge Legacy
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else if (typeof saveAs === 'function') {
      saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      a.type = DOCX_MIME;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 5000);
    }

  } catch (err) {
    console.error('Error generando DOCX:', err);
    alert('Error al generar el documento Word: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '⬇ DOCX'; }
  }
}
