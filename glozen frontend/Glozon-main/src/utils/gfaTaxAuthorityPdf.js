import {
  PDFDocument,
  StandardFonts,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  rectangle,
  clip,
  endPath,
} from "pdf-lib";

const TEMPLATE_PATH = "/gfa-tax-authority-template.pdf";

/**
 * Measured from `Tax Form Types_GFA.pdf` via pdf.js (page 1, origin bottom-left).
 * “Signature Box” label baseline ≈ 229.7; “Name:” baseline ≈ 145.9.
 */
const TEMPLATE = {
  sigLabelY: 229.7,
  nameLabelY: 145.9,
  nameValueX: 104.5,
  dateLabelY: 133,
  dateValueX: 99.5,
};

/** Inner area for the signature (slightly inset from printed border so strokes don’t bleed out). */
const SIG_BOX = {
  x: 75.5,
  w: 108,
  h: 26,
  y: TEMPLATE.sigLabelY - 35,
};

const PT = {
  firstName: { x: 126, y: 680.8, size: 10 },
  lastName: { x: 412.7, y: 680.8, size: 10 },
  email: { x: 106.8, y: 659.6, size: 10 },
  contact: { x: 384.6, y: 659.6, size: 10 },
  markIndividual: { x: 54, y: 617.3, size: 11 },
  markEntity: { x: 54, y: 595.9, size: 11 },
  tfnIndividual: { x: 236, y: 547.6, size: 10 },
  dobIndividual: { x: 223.7, y: 532.1, size: 10 },
  abnEntity: { x: 285.9, y: 487.3, size: 10 },
  tfnEntity: { x: 236, y: 471.7, size: 10 },
  signature: SIG_BOX,
  name: { x: TEMPLATE.nameValueX, y: TEMPLATE.nameLabelY, size: 10 },
  date: { x: TEMPLATE.dateValueX, y: TEMPLATE.dateLabelY, size: 10 },
};

const BLACK = rgb(0, 0, 0);

function fmtDMY(iso) {
  if (!iso || typeof iso !== "string") return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function dataUrlToUint8(dataUrl) {
  const base64 = dataUrl
    .replace(/^data:image\/png;base64,/, "")
    .replace(/\s/g, "");
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Signature stroke on canvas (opaque white background). */
function isInkPixel(data, i) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a < 8) return false;
  return r < 230 || g < 230 || b < 230;
}

/**
 * Crop ink from full-width signing pad; export PNG with transparent background.
 * @param {string} dataUrl
 */
function cropSignatureDataUrl(dataUrl) {
  if (typeof document === "undefined") return Promise.resolve(dataUrl);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      const scratch = document.createElement("canvas");
      scratch.width = w;
      scratch.height = h;
      const sctx = scratch.getContext("2d");
      if (!sctx) {
        resolve(dataUrl);
        return;
      }
      sctx.drawImage(img, 0, 0);
      const { data } = sctx.getImageData(0, 0, w, h);

      let minX = w;
      let minY = h;
      let maxX = 0;
      let maxY = 0;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const idx = (py * w + px) * 4;
          if (isInkPixel(data, idx)) {
            minX = Math.min(minX, px);
            maxX = Math.max(maxX, px);
            minY = Math.min(minY, py);
            maxY = Math.max(maxY, py);
          }
        }
      }
      if (maxX < minX) {
        resolve(dataUrl);
        return;
      }

      const pad = 4;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(w - 1, maxX + pad);
      maxY = Math.min(h - 1, maxY + pad);
      const cw = maxX - minX + 1;
      const ch = maxY - minY + 1;

      const out = document.createElement("canvas");
      out.width = cw;
      out.height = ch;
      const octx = out.getContext("2d");
      if (!octx) {
        resolve(dataUrl);
        return;
      }

      const cropped = sctx.getImageData(minX, minY, cw, ch);
      const px = cropped.data;
      for (let i = 0; i < px.length; i += 4) {
        if (!isInkPixel(px, i)) {
          px[i + 3] = 0;
        }
      }
      octx.putImageData(cropped, 0, 0);
      resolve(out.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Scale ink slightly smaller than the inner box — avoids anti-alias rounding past border. */
function fitSignatureDims(imgW, imgH, box) {
  const pad = 5;
  const maxW = box.w - pad * 2;
  const maxH = box.h - pad * 2;
  let scale = Math.min(maxW / imgW, maxH / imgH) * 0.96;
  if (scale > 1) scale = 1;
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  return {
    x: box.x + pad + (maxW - drawW) / 2,
    y: box.y + pad + (maxH - drawH) / 2,
    width: drawW,
    height: drawH,
  };
}

/** Hard clip — nothing can paint outside this rect (fixes tiny overflow from scaling). */
function drawSignatureClipped(page, png, dims, box) {
  const inset = 0.85;
  const cx = box.x + inset;
  const cy = box.y + inset;
  const cw = box.w - inset * 2;
  const ch = box.h - inset * 2;
  page.pushOperators(
    pushGraphicsState(),
    rectangle(cx, cy, cw, ch),
    clip(),
    endPath(),
  );
  page.drawImage(png, dims);
  page.pushOperators(popGraphicsState());
}

/**
 * @param {{
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 *   phone?: string;
 *   phoneNumber?: string;
 *   businessType: "individual" | "entity" | "company";
 *   tfn?: string;
 *   panId?: string;
 *   dob?: string;
 *   abn?: string;
 *   corporateId?: string;
 *   signatoryName?: string;
 *   signatureName?: string;
 *   signDate?: string;
 *   signatureDate?: string;
 * }} record
 * @param {string} signatureDataUrl
 * @param {string} [declaration] — optional declaration text (accepted for API compatibility; not rendered)
 * @returns {Promise<Blob>}
 */
export async function buildGfaTaxAuthorityPdfBlob(
  record,
  signatureDataUrl,
  declaration, // accepted but unused — reserved for future template update
) {
  // Silence unused-var lint warnings in dev; keep for future template revision.
  void declaration;

  const safeRecord = record || {};

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = origin ? `${origin}${TEMPLATE_PATH}` : TEMPLATE_PATH;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Missing template PDF (${TEMPLATE_PATH}). Add Tax Form Types_GFA.pdf to public as gfa-tax-authority-template.pdf.`,
    );
  }

  const templateBytes = new Uint8Array(await res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes, {
    ignoreEncryption: true,
  });
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const draw = (text, pos) => {
    const t = String(text ?? "").trim();
    if (!t) return;
    const { x, y, size } = pos;
    page.drawText(t, {
      x,
      y,
      size: size ?? 10,
      font,
      color: BLACK,
    });
  };

  // ---------------------------------------------
  // PERSONAL INFORMATION
  // ---------------------------------------------

  draw(safeRecord.firstName, PT.firstName);
  draw(safeRecord.lastName, PT.lastName);
  draw(safeRecord.email, PT.email);
  draw(safeRecord.phone || safeRecord.phoneNumber, PT.contact);

  // ---------------------------------------------
  // BUSINESS TYPE MARK
  // ---------------------------------------------

  if (safeRecord.businessType === "individual") {
    page.drawCircle({
      x: PT.markIndividual.x + 2.8,
      y: PT.markIndividual.y - 2,
      size: 2.6,
      color: BLACK,
    });
  } else {
    page.drawCircle({
      x: PT.markEntity.x + 2.8,
      y: PT.markEntity.y - 2,
      size: 2.6,
      color: BLACK,
    });
  }

  // ---------------------------------------------
  // TAX IDENTIFIERS
  // ---------------------------------------------

  if (safeRecord.businessType === "individual") {
    draw(safeRecord.tfn || safeRecord.panId, PT.tfnIndividual);
    draw(fmtDMY(safeRecord.dob), PT.dobIndividual);
  } else {
    draw(safeRecord.abn || safeRecord.corporateId, PT.abnEntity);
    draw(safeRecord.tfn || safeRecord.panId, PT.tfnEntity);
  }

  // ---------------------------------------------
  // SIGNATURE IMAGE
  // ---------------------------------------------

  if (signatureDataUrl && signatureDataUrl.length > 80) {
    try {
      const cropped = await cropSignatureDataUrl(signatureDataUrl);
      const pngBytes = dataUrlToUint8(cropped);
      const png = await pdfDoc.embedPng(pngBytes);
      const dims = fitSignatureDims(png.width, png.height, PT.signature);
      drawSignatureClipped(page, png, dims, PT.signature);
    } catch {
      /* ignore bad signature data */
    }
  }

  // ---------------------------------------------
  // SIGNATORY NAME + DATE
  // ---------------------------------------------

  draw(
    safeRecord.signatoryName || safeRecord.signatureName,
    PT.name,
  );
  draw(
    fmtDMY(safeRecord.signDate || safeRecord.signatureDate),
    PT.date,
  );

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export function buildPDFName(payload) {
  const first = payload?.firstName || "Client";
  const last = payload?.lastName || "User";

  return `GFA-${first}-${last}-${Date.now()}.pdf`;
}