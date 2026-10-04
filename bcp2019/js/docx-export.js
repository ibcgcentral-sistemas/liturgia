/**
 * docx-export.js — Exportar a Word (.docx)
 * Libro de Oración Común (2019), ACNA
 * Requiere: js/lib/docx.iife.js (window.docx) y js/lib/FileSaver.min.js (window.saveAs)
 *
 * Exportador ÚNICO y genérico, reutilizado tanto para el documento principal
 * (#liturgy-output .liturgy-document) como para el Librito del Pueblo
 * (#librito-overlay .librito-document) — en vez de duplicar el transpilador
 * DOM→docx.js una tercera vez (el Misal Anglicano ya tiene dos copias casi
 * gemelas, una en js/docx-export.js y otra dentro de js/librito-pueblo.js).
 * El dispatcher reconoce ambos vocabularios de clase CSS porque no colisionan
 * entre sí (namespace .mass-section/.liturgical-text-block del documento
 * principal vs. .librito-section/.librito-text del Librito).
 */

const BCPDocxExport = (() => {

  const FONT   = 'Palatino Linotype';
  const SZ     = 22;   // 11pt — cuerpo de texto
  const SZ_SM  = 18;   // 9pt  — rúbricas e información menor
  const SZ_MD  = 24;   // 12pt — títulos ordinarios
  const SZ_LG  = 28;   // 14pt — títulos de sección principal
  const SZ_XL  = 38;   // 19pt — nombre de la fiesta
  const C_INK    = '16233A'; // Tinta azul oscura (misma familia que --accent-dark)
  const C_RUB    = 'A4243B'; // Rojo carmesí litúrgico (misma familia que --rubric)
  const C_META   = '555555';
  const C_ACCENT = '2C5C8F'; // Azul (misma familia que --accent, sustituye al dorado del Misal)

  function sanitizeText(t) {
    if (!t) return '';
    // eslint-disable-next-line no-control-regex
    return String(t).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  async function preloadFonts() {
    // Sin grabados/ilustraciones en este generador — nada que precargar,
    // pero se mantiene la cesión de hilo para que el botón alcance a pintar
    // su estado "Generando…" antes del trabajo síncrono pesado.
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // ── Núcleo compartido: recorre un elemento raíz y devuelve un array de Paragraph/Table ──
  function renderToParagraphs(rootEl) {
    const {
      Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType,
    } = window.docx;

    const paras = [];

    const emptyLine = (after = 120) =>
      new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after } });

    const rubricPara = (text, indentLeft = 0) =>
      new Paragraph({
        children: [new TextRun({ text, italics: true, color: C_RUB, size: SZ_SM, font: FONT })],
        indent: indentLeft ? { left: indentLeft } : undefined,
        spacing: { before: 60, after: 60 },
      });

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

    function walkChildren(container) {
      for (const child of container.children) walkElement(child);
    }

    // ── Spans .lit-* (Ordinario, comparte vocabulario con el Misal Anglicano) ──
    function walkSpan(span) {
      const cls = span.classList;

      if (cls.contains('lit-rubric')) {
        const t = span.textContent.trim();
        if (t) paras.push(rubricPara(t, 180));
        return;
      }
      if (cls.contains('lit-title')) {
        paras.push(new Paragraph({
          children: [new TextRun({ text: sanitizeText(span.textContent.trim()).toUpperCase(), bold: true, size: SZ, color: C_RUB, font: FONT })],
          spacing: { before: 180, after: 60 },
        }));
        return;
      }
      if (cls.contains('lit-consecracion')) {
        const rawLines = (span.innerText || span.textContent).split('\n');
        const lines = rawLines.map(l => l.trim()).filter(Boolean);
        paras.push(emptyLine(80));
        lines.forEach((line, i) => {
          const border = {
            left: { style: BorderStyle.SINGLE, size: 8, color: C_RUB, space: 20 },
            right: { style: BorderStyle.SINGLE, size: 8, color: C_RUB, space: 20 },
          };
          if (i === 0) border.top = { style: BorderStyle.DOUBLE, size: 12, color: C_RUB, space: 12 };
          if (i === lines.length - 1) border.bottom = { style: BorderStyle.DOUBLE, size: 12, color: C_RUB, space: 12 };
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: sanitizeText(line).toUpperCase(), bold: true, size: 24, color: C_INK, font: FONT })],
            border, spacing: { before: 40, after: 40 },
          }));
        });
        paras.push(emptyLine(80));
        return;
      }
      if (cls.contains('lit-prayer')) {
        paras.push(new Paragraph({ children: buildRuns(span), indent: { left: 450 }, spacing: { before: 60, after: 60 } }));
        return;
      }
      if (cls.contains('lit-line')) {
        const label = span.querySelector('.lit-label')?.textContent?.trim() ?? '';
        const textEl = span.querySelector('.lit-text');
        if (!textEl) return;
        const isPeoplePart = cls.contains('pueblo') || cls.contains('todos') || cls.contains('lector');
        paras.push(new Paragraph({
          children: [
            new TextRun({ text: label + '\t', bold: true, size: SZ, color: C_RUB, font: FONT }),
            ...buildRuns(textEl, { bold: isPeoplePart }),
          ],
          tabStops: [{ type: TabStopType.LEFT, position: 900 }],
          indent: { left: 900, hanging: 900 },
          spacing: { before: 30, after: 30, line: 264 },
        }));
        return;
      }
      const runs = buildRuns(span, cls.contains('rubric') || span.tagName === 'EM' ? { italic: true, color: C_RUB, size: SZ_SM } : {});
      if (runs.length) paras.push(new Paragraph({ children: runs, spacing: { before: 100, after: 100, line: 280 } }));
    }

    // ── Dispatcher principal ──────────────────────────────────────────────
    function walkElement(el) {
      const cls = el.classList;
      const tag = el.tagName;

      // Portada (compartida entre documento principal y Librito — misma estructura)
      if (cls.contains('cover-page')) {
        const title = el.querySelector('.cover-title')?.innerText?.trim().replace(/\s+/g, ' ') || '';
        const subtitle = el.querySelector('.cover-subtitle')?.textContent?.trim() || '';
        const feast = el.querySelector('.cover-feast')?.textContent?.trim() || '';
        const date = el.querySelector('.cover-date')?.textContent?.trim() || '';

        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '✠', size: 120, color: C_RUB, font: FONT })], spacing: { before: 2000, after: 800 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: title, bold: true, size: 64, color: C_INK, font: FONT })], spacing: { before: 0, after: 300 } }));
        if (subtitle) paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subtitle, italics: true, size: 22, color: C_ACCENT, font: FONT })], spacing: { before: 0, after: 1200 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '❖   ❖   ❖', size: 20, color: C_ACCENT, font: FONT })], spacing: { before: 0, after: 1400 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: feast.toUpperCase(), bold: true, size: 44, color: C_RUB, font: FONT })], spacing: { before: 0, after: 400 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: date, italics: true, size: 28, color: C_META, font: FONT })], spacing: { before: 0, after: 2800 } }));
        paras.push(new Paragraph({ children: [new TextRun({ text: ' ' })], pageBreakBefore: true }));
        return;
      }

      // Encabezado del documento principal
      if (cls.contains('feast-header')) {
        const name = el.querySelector('.feast-name-en')?.textContent?.trim() || '';
        const date = el.querySelector('.feast-date')?.textContent?.trim() || '';
        const meta = Array.from(el.querySelectorAll('.feast-meta span')).map(s => s.textContent.trim()).join('   ·   ');

        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '✠   SANTA EUCARISTÍA — TEXTO ESTÁNDAR ANGLICANO   ✠', bold: true, size: 22, color: C_RUB, font: FONT })], spacing: { before: 200, after: 200 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name.toUpperCase(), bold: true, size: SZ_XL, color: C_INK, font: FONT })], spacing: { before: 0, after: 100 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: date, italics: true, size: 22, color: C_META, font: FONT })], spacing: { before: 0, after: 80 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: meta, size: 18, color: C_META, font: FONT })], border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C_ACCENT, space: 8 } }, spacing: { before: 0, after: 400 } }));
        return;
      }

      // Encabezado del Librito
      if (cls.contains('librito-header')) {
        const title = el.querySelector('h2')?.textContent?.trim() || '';
        const subtitle = el.querySelector('.librito-subtitle')?.textContent?.trim() || '';
        const date = el.querySelector('.librito-date')?.textContent?.trim() || '';
        const feast = el.querySelector('.librito-feast')?.textContent?.trim() || '';
        const meta = el.querySelector('.librito-meta')?.textContent?.trim() || '';

        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: title, bold: true, size: SZ_LG, color: '1A5C42', font: FONT })], spacing: { before: 200, after: 100 } }));
        if (subtitle) paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subtitle, italics: true, size: 20, color: C_META, font: FONT })], spacing: { after: 80 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: date, italics: true, size: 20, color: C_META, font: FONT })], spacing: { after: 80 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: feast.toUpperCase(), bold: true, size: SZ_MD, color: C_RUB, font: FONT })], spacing: { after: 80 } }));
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: meta, size: SZ_SM, color: C_META, font: FONT })], border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '1A5C42', space: 8 } }, spacing: { before: 0, after: 400 } }));
        return;
      }

      // Contenedores genéricos (recursión)
      if (cls.contains('mass-section') || cls.contains('intercessions') || cls.contains('librito-section')) {
        walkChildren(el);
        return;
      }

      // Título principal de sección
      if (cls.contains('section-title') && cls.contains('main-section')) {
        paras.push(emptyLine(200));
        paras.push(new Paragraph({
          children: [new TextRun({ text: sanitizeText(el.textContent.trim()).toUpperCase(), bold: true, size: SZ_LG, color: C_RUB, font: FONT })],
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: C_ACCENT, space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C_ACCENT, space: 6 } },
          alignment: AlignmentType.CENTER, spacing: { before: 480, after: 300 },
        }));
        return;
      }

      // Subtítulos (documento principal y Librito)
      // El <h2> del Librito NO lleva la clase .librito-section (la lleva su
      // <section> padre), así que la condición anterior "tag === 'H2' &&
      // cls.contains('librito-section')" no se cumplía nunca: TODOS los
      // encabezados de sección del Librito ("✠ RITOS INICIALES", "✠ LA COLECTA
      // DEL DÍA", "✠ LA ORACIÓN DE CONSAGRACIÓN"…) caían al fallback
      // walkChildren(), que sobre un <h2> sin hijos-elemento no emite nada: se
      // perdían en silencio al exportar a Word. Los <h2> del documento
      // principal y de las portadas ya se atienden antes, en las ramas
      // .cover-page / .feast-header / .librito-header, con return propio.
      if (cls.contains('section-title') || tag === 'H3' || tag === 'H4' || tag === 'H2') {
        paras.push(new Paragraph({
          children: [new TextRun({ text: el.textContent.trim().toUpperCase(), bold: true, size: SZ_MD, color: tag === 'H2' ? '1A5C42' : C_INK, font: FONT })],
          spacing: { before: 300, after: 120 },
        }));
        return;
      }

      // Bloque de texto litúrgico estructurado (con spans .lit-*)
      if (cls.contains('liturgical-text-block')) {
        const hasStructuredSpans = el.querySelector('.lit-line, .lit-consecracion, .lit-title, .lit-prayer');
        if (!hasStructuredSpans) {
          paras.push(new Paragraph({ children: buildRuns(el), spacing: { before: 120, after: 120, line: 276 }, alignment: AlignmentType.JUSTIFIED }));
        } else {
          for (const child of el.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
              const t = child.textContent.trim();
              if (t) paras.push(new Paragraph({ children: [new TextRun({ text: t, size: SZ, font: FONT })], spacing: { before: 60, after: 60, line: 276 } }));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              walkSpan(child);
            }
          }
        }
        return;
      }

      // Colectas y oraciones destacadas
      if (cls.contains('prayer-text') || cls.contains('collect-text')) {
        paras.push(new Paragraph({
          children: buildRuns(el), indent: { left: 450, right: 450 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: C_RUB, space: 15 } },
          spacing: { before: 180, after: 180, line: 300 }, alignment: AlignmentType.JUSTIFIED,
        }));
        return;
      }

      // Rúbricas sueltas
      if (cls.contains('rubric') || cls.contains('gospel-incensation')) {
        paras.push(new Paragraph({ children: buildRuns(el, { italic: true, color: C_RUB, size: SZ_SM }), spacing: { before: 100, after: 100 } }));
        return;
      }

      // Respuestas breves (documento principal)
      if (cls.contains('response')) {
        paras.push(new Paragraph({ children: buildRuns(el), spacing: { before: 100, after: 100 } }));
        return;
      }

      // Texto de las Escrituras (documento principal)
      if (cls.contains('scripture-text')) {
        const pTags = el.querySelectorAll('p');
        const target = pTags.length ? Array.from(pTags) : [el];
        target.forEach(p => {
          paras.push(new Paragraph({
            children: buildRuns(p), indent: { left: 450, right: 450 },
            border: { left: { style: BorderStyle.SINGLE, size: 18, color: C_ACCENT, space: 15 } },
            spacing: { before: 140, after: 140, line: 300 }, alignment: AlignmentType.JUSTIFIED,
          }));
        });
        return;
      }

      // Pie de página
      if (cls.contains('liturgy-footer') || cls.contains('librito-footer')) {
        paras.push(emptyLine(200));
        const accent = cls.contains('librito-footer') ? '1A5C42' : C_ACCENT;
        const footerPs = el.querySelectorAll('p');
        footerPs.forEach((p, i) => {
          paras.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: p.textContent.trim().replace(/\s+/g, ' '), italics: true, size: 18, color: C_META, font: FONT })],
            spacing: { before: 60, after: 0 },
            border: i === 0 ? { top: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 12 } } : undefined,
          }));
        });
        return;
      }

      // ── Vocabulario propio del Librito ──
      // Rúbrica: instrucción de postura para el fiel, no texto a decir —
      // se imprime en rojo itálico, misma convención que .rubric/.lit-rubric.
      if (cls.contains('librito-instruction')) {
        el.querySelectorAll('p').forEach(p => paras.push(new Paragraph({
          children: buildRuns(p, { italic: true, color: C_RUB, size: SZ_SM }), indent: { left: 360 },
          border: { left: { style: BorderStyle.SINGLE, size: 10, color: '1A5C42', space: 12 } },
          spacing: { before: 80, after: 80, line: 264 },
        })));
        return;
      }
      if (cls.contains('librito-response') || cls.contains('librito-text')) {
        el.querySelectorAll('p').forEach(p => paras.push(new Paragraph({
          children: buildRuns(p), alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80, line: 280 },
        })));
        return;
      }
      if (cls.contains('librito-reading') || cls.contains('librito-gospel')) {
        const ref = el.querySelector('.reading-ref, .gospel-ref')?.textContent?.trim();
        const refSmall = el.querySelector('.reading-ref-small')?.textContent?.trim();
        if (ref) paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ref, bold: true, size: SZ_MD, color: '1A5C42', font: FONT })], spacing: { before: 120, after: 40 } }));
        if (refSmall) paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: refSmall, italics: true, size: SZ_SM, color: C_META, font: FONT })], spacing: { after: 100 } }));
        // Hijos en orden de documento: el Evangelio lleva
        // "Gloria a ti, Cristo Señor" ANTES del texto y "Te alabamos" DESPUÉS.
        // (Antes se recorrían todos los .librito-response y luego el texto, y
        // el .docx imprimía las dos respuestas antes de la lectura.)
        for (const child of el.children) {
          if (child.classList.contains('librito-response')) {
            walkElement(child);
          } else if (child.classList.contains('reading-text')) {
            paras.push(new Paragraph({
              children: buildRuns(child), indent: { left: 450, right: 450 },
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: '1A5C42', space: 15 } },
              spacing: { before: 100, after: 140, line: 300 }, alignment: AlignmentType.JUSTIFIED,
            }));
          }
        }
        return;
      }
      if (cls.contains('librito-psalm')) {
        walkChildren(el);
        return;
      }
      if (cls.contains('psalm-verse')) {
        el.querySelectorAll('p').forEach(p => paras.push(new Paragraph({ children: buildRuns(p), spacing: { before: 40, after: 40, line: 264 } })));
        return;
      }
      if (cls.contains('psalm-response')) {
        paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sanitizeText(el.textContent.trim()), bold: true, italics: true, size: SZ, color: '1A5C42', font: FONT })], spacing: { before: 60, after: 60 } }));
        return;
      }
      if (cls.contains('librito-credo')) {
        for (const child of el.children) {
          if (child.classList.contains('credo-incline')) {
            child.querySelectorAll('p').forEach(p => paras.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              children: buildRuns(p, { bold: true, color: C_RUB }),
              spacing: { before: 40, after: 40 },
            })));
          } else if (child.tagName === 'P') {
            paras.push(new Paragraph({ children: buildRuns(child), alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80, line: 300 } }));
          }
        }
        return;
      }

      // Reconocer spans .lit-* sueltos (fuera de liturgical-text-block)
      if (cls.contains('lit-line') || cls.contains('lit-rubric') || cls.contains('lit-title') || cls.contains('lit-consecracion') || cls.contains('lit-prayer')) {
        walkSpan(el);
        return;
      }

      // Fallback: recursión
      walkChildren(el);
    }

    walkChildren(rootEl);
    return paras;
  }

  async function buildAndDownload(rootEl, filenamePrefix, docTitle) {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Header, Footer, PageNumber } = window.docx;

    await preloadFonts();

    const paras = renderToParagraphs(rootEl);

    // Encabezado corrido y numeración de página (la portada, primera página,
    // va sin ninguno de los dos).
    const blankPara = () => new Paragraph({ children: [new TextRun({ text: '', font: FONT, size: SZ_SM })] });
    const runningHeaderPara = new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: docTitle, italics: true, size: 16, color: C_META, font: FONT })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C_ACCENT, space: 6 } },
      spacing: { before: 0, after: 120 },
    });
    const pageNumberPara = new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '✠  ', size: 16, color: C_ACCENT, font: FONT }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C_META, font: FONT }),
        new TextRun({ text: ' / ', size: 16, color: C_META, font: FONT }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C_META, font: FONT }),
        new TextRun({ text: '  ✠', size: 16, color: C_ACCENT, font: FONT }),
      ],
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: C_ACCENT, space: 6 } },
      spacing: { before: 120, after: 0 },
    });

    const wordDoc = new Document({
      creator: 'Libro de Oración Común (2019) — ACNA',
      title: docTitle,
      description: 'Generado por el generador del Libro de Oración Común (2019)',
      styles: { default: { document: { run: { font: FONT, size: SZ } } } },
      sections: [{
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
          titlePage: true, // la portada no lleva encabezado ni numeración
        },
        headers: {
          default: new Header({ children: [runningHeaderPara] }),
          first:   new Header({ children: [blankPara()] }),
        },
        footers: {
          default: new Footer({ children: [pageNumberPara] }),
          first:   new Footer({ children: [blankPara()] }),
        },
        children: paras,
      }],
    });

    const rawBlob = await Packer.toBlob(wordDoc);
    const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = new Blob([rawBlob], { type: DOCX_MIME });
    const safeName = docTitle.replace(/[^\wáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().substring(0, 40);
    const filename = (filenamePrefix + '-' + safeName + '.docx').replace(/\s+/g, '-');

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
  }

  // ── Documento principal (para el Celebrante) ────────────────────────────
  async function downloadDocx() {
    const outputEl = document.getElementById('liturgy-output');
    if (!outputEl || outputEl.classList.contains('hidden') || !outputEl.querySelector('.feast-header')) {
      alert('Por favor, genera la liturgia primero.');
      return;
    }
    const btn = document.getElementById('docx-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }
    try {
      const docContainer = outputEl.querySelector('.liturgy-document') || outputEl;
      const feastName = outputEl.querySelector('.feast-name-en')?.textContent?.trim() || 'Liturgia';
      await buildAndDownload(docContainer, 'BCP2019', feastName);
    } catch (err) {
      console.error('Error generando DOCX:', err);
      alert('Error al generar el documento Word: ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⬇ DOCX'; }
    }
  }

  // ── Librito del Pueblo ──────────────────────────────────────────────────
  async function downloadLibritoDocx() {
    const overlay = document.getElementById('librito-overlay');
    const docEl = overlay ? overlay.querySelector('.librito-document') : null;
    if (!docEl) {
      alert('Por favor, abre el Librito primero.');
      return;
    }
    const btn = document.getElementById('librito-docx-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }
    try {
      const feastName = docEl.querySelector('.librito-feast')?.textContent?.trim() || 'Liturgia';
      await buildAndDownload(docEl, 'Librito-BCP2019', feastName);
    } catch (err) {
      console.error('Error generando DOCX del Librito:', err);
      alert('Error al generar el documento Word: ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⬇ Descargar DOCX'; }
    }
  }

  return { downloadDocx, downloadLibritoDocx };
})();
