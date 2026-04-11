/**
 * Pitàgores – Google Apps Script Web App
 * ----------------------------------------
 * Despliega como Web App con:
 *   · Ejecutar como: Yo (propietario del sheet)
 *   · Quién tiene acceso: Cualquiera
 *
 * La validación de usuarios se hace internamente comprobando
 * la hoja "Participants" antes de escribir nada.
 * Columnes de Participants: Email | Nom | Cognom | Grup
 */

// ── Nombres de las hojas ────────────────────────────────────────────────────
var SHEET_RESPONSES    = "Respostes";
var SHEET_AUTHORIZED   = "Participants";
var SHEET_SUMMARY      = "Resum_alumnes";

// ── Punto de entrada POST ───────────────────────────────────────────────────
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // 1. Parsear el cuerpo JSON
    var data = JSON.parse(e.postData.contents);

    // 2. Campos obligatorios
    var required = ["email", "questionId", "questionText", "userAnswer", "correctAnswer", "isCorrect", "section", "lang"];
    for (var i = 0; i < required.length; i++) {
      if (data[required[i]] === undefined || data[required[i]] === null) {
        output.setContent(JSON.stringify({ ok: false, error: "Missing field: " + required[i] }));
        return output;
      }
    }

    var email = String(data.email).trim().toLowerCase();

    // 3. Validar que el email está autorizado
    if (!isAuthorized(email)) {
      output.setContent(JSON.stringify({ ok: false, error: "Unauthorized email: " + email }));
      return output;
    }

    // 4. Buscar nom complet i grup a la pestanya Participants
    var studentName  = getStudentName(email);
    var studentGroup = getStudentGroup(email);

    // 5. Deduplicar: si ja hi ha una resposta CORRECTA per aquest email+questionId, no tornar a comptar
    var ss       = SpreadsheetApp.getActiveSpreadsheet();
    var sheetRes = ss.getSheetByName(SHEET_RESPONSES);
    if (data.isCorrect) {
      var existing = sheetRes.getDataRange().getValues();
      for (var j = 1; j < existing.length; j++) {
        if (String(existing[j][1]).trim().toLowerCase() === email &&
            String(existing[j][5]).trim() === String(data.questionId).trim() &&
            String(existing[j][9]).trim() === "SÍ") {
          // Resposta correcta ja enregistrada → no duplicar
          output.setContent(JSON.stringify({ ok: true, message: "Ja enregistrada." }));
          return output;
        }
      }
    }

    // 6. Escriure la resposta a la hoja de Respostes
    sheetRes.appendRow([
      new Date(),                          // Timestamp
      email,                               // Email
      studentName,                         // Nom complet
      studentGroup,                        // Grup
      String(data.section),               // Secció
      String(data.questionId),            // ID pregunta
      String(data.questionText),          // Text pregunta
      String(data.userAnswer),            // Resposta alumne
      String(data.correctAnswer),         // Resposta correcta
      data.isCorrect ? "SÍ" : "NO",       // Correcte?
      String(data.lang),                  // Idioma
      String(data.sessionId || "")        // ID sessió
    ]);

    // 7. Actualizar el resum (upsert per alumne)
    updateSummary(email, studentName, studentGroup, data.isCorrect, data.section);

    output.setContent(JSON.stringify({ ok: true, message: "Resposta enregistrada." }));

  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }

  return output;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Comprova si l'email està a la columna Email de "Participants".
 * Ignora majúscules/minúscules i espais.
 */
function isAuthorized(email) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_AUTHORIZED);
  var values = sheet.getRange("A:A").getValues();

  for (var i = 1; i < values.length; i++) {
    var cell = String(values[i][0]).trim().toLowerCase();
    if (cell === email) return true;
  }
  return false;
}

/**
 * Retorna el nom complet (Nom + Cognom, columnes B i C) a partir de l'email.
 * Participants: A=Email | B=Nom | C=Cognom | D=Grup
 */
function getStudentName(email) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_AUTHORIZED);
  var values = sheet.getRange("A:C").getValues();

  for (var i = 1; i < values.length; i++) {
    var cell = String(values[i][0]).trim().toLowerCase();
    if (cell === email) {
      var nom    = values[i][1] ? String(values[i][1]) : "";
      var cognom = values[i][2] ? String(values[i][2]) : "";
      var full   = (nom + " " + cognom).trim();
      return full || email;
    }
  }
  return email;
}

/**
 * Retorna el grup (columna D) a partir de l'email.
 */
function getStudentGroup(email) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_AUTHORIZED);
  var values = sheet.getRange("A:D").getValues();

  for (var i = 1; i < values.length; i++) {
    var cell = String(values[i][0]).trim().toLowerCase();
    if (cell === email) {
      return values[i][3] ? String(values[i][3]) : "Sense grup";
    }
  }
  return "Sense grup";
}

/**
 * Fa un upsert a "Resum_alumnes":
 * – Si l'alumne ja existeix, actualitza els comptadors.
 * – Si és nou, afegeix una fila.
 *
 * Columnes: Email | Nom | Grup | Total | Correctes | Incorrectes | % Èxit | Última activitat | Seccions
 */
function updateSummary(email, studentName, studentGroup, isCorrect, section) {
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var sheetSum   = ss.getSheetByName(SHEET_SUMMARY);
  var data       = sheetSum.getDataRange().getValues();
  var now        = new Date();

  // Buscar fila existent (comença a fila 2 → índex 1)
  // Columnes: 0=Email 1=Nom 2=Grup 3=Total 4=Correctes 5=Incorrectes 6=%Èxit 7=Última activitat 8=Seccions
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === email) {
      var row      = i + 1; // 1-based per a Sheets
      var total    = (data[i][3] || 0) + 1;
      var correct  = (data[i][4] || 0) + (isCorrect ? 1 : 0);
      var incorrect= (data[i][5] || 0) + (isCorrect ? 0 : 1);
      var pct      = total > 0 ? Math.round((correct / total) * 100) : 0;

      var sections = data[i][8] ? String(data[i][8]) : "";
      if (section && sections.indexOf(section) === -1) {
        sections = sections ? sections + ", " + section : section;
      }

      // Actualitza des de columna D (índex 4 en 1-based) → 6 valors
      sheetSum.getRange(row, 4, 1, 6).setValues([[total, correct, incorrect, pct + "%", now, sections]]);
      return;
    }
  }

  // Alumne nou
  sheetSum.appendRow([
    email,
    studentName,
    studentGroup,
    1,
    isCorrect ? 1 : 0,
    isCorrect ? 0 : 1,
    isCorrect ? "100%" : "0%",
    now,
    section || ""
  ]);
}

// ── GET: health check, validació d'email i progrés ────────────────────────
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ?action=validate&email=xxx → comprova si l'email és a Participants
  if (e && e.parameter && e.parameter.action === "validate") {
    var email = String(e.parameter.email || "").trim().toLowerCase();
    if (!email) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Missing email" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, authorized: isAuthorized(email) }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ?action=progress&email=xxx → retorna les seccions completades per l'alumne
  if (e && e.parameter && e.parameter.action === "progress") {
    var email = String(e.parameter.email || "").trim().toLowerCase();
    if (!email || !isAuthorized(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var sheetSum = ss.getSheetByName(SHEET_SUMMARY);
    var data = sheetSum.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === email) {
        return ContentService
          .createTextOutput(JSON.stringify({
            ok: true,
            sections: String(data[i][8] || ""),
            total:    data[i][3] || 0,
            correct:  data[i][4] || 0
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    // Alumne sense dades encara
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, sections: "", total: 0, correct: 0 }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Pitàgores API operativa." }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Capçaleres estàndard (s'afegeixen si falten) ────────────────────────────
var HEADER_RESPONSES = ["Timestamp", "Email", "Nom", "Grup", "Secció", "ID pregunta", "Pregunta", "Resposta alumne", "Resposta correcta", "Correcte?", "Idioma", "Sessió"];
var HEADER_SUMMARY   = ["Email", "Nom", "Grup", "Total", "Correctes", "Incorrectes", "% Èxit", "Última activitat", "Seccions"];

/**
 * Assegura que la fulla tinui capçalera. Si la fila 1 no conté el text
 * esperat a la primera cel·la, insereix la capçalera al davant.
 */
function ensureHeader(sheet, expectedHeader) {
  if (!sheet || sheet.getLastRow() === 0) {
    // Full completament buit → escriure capçalera
    sheet.appendRow(expectedHeader);
    return;
  }
  var firstCell = String(sheet.getRange(1, 1).getValue()).trim().toLowerCase();
  var expected  = String(expectedHeader[0]).trim().toLowerCase();
  if (firstCell !== expected) {
    // La fila 1 és dades, no capçalera → inserir-la
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, expectedHeader.length).setValues([expectedHeader]);
  }
}

// ── Crear fulls filtrats per grup ───────────────────────────────────────────
/**
 * Executa des de l'editor d'Apps Script (▶ Run) o des del menú personalitzat.
 * Llegeix els grups únics de "Participants" (columna D) i crea:
 *   · Resum_<grup>     → dades de Resum_alumnes filtrades per grup (col C)
 *   · Respostes_<grup> → dades de Respostes filtrades per grup (col D)
 *
 * Escriu les dades directament (sense fórmules) per evitar problemes de locale.
 * Si el full ja existeix, l'esborra i el recrea amb les dades actualitzades.
 * Comparacions normalitzades (trim + toLowerCase) per evitar falsos negatius.
 */
function crearFullsPerGrup() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_AUTHORIZED);

  // 0. Assegurar capçaleres a les fulles font
  var sheetResum = ss.getSheetByName(SHEET_SUMMARY);
  var sheetResp  = ss.getSheetByName(SHEET_RESPONSES);
  ensureHeader(sheetResum, HEADER_SUMMARY);
  ensureHeader(sheetResp, HEADER_RESPONSES);

  // 1. Construir mapa email → grup des de Participants (font de veritat)
  var partAll = sheet.getRange(1, 1, sheet.getLastRow(), 4).getValues();
  var emailToGrup = {};
  var grups = {};
  var grupOriginal = {};
  for (var i = 1; i < partAll.length; i++) {
    var email = String(partAll[i][0]).trim().toLowerCase();
    var g     = String(partAll[i][3]).trim();
    if (email && g && g !== "undefined" && g !== "null") {
      emailToGrup[email] = g;
      var key = g.toLowerCase();
      grups[key] = true;
      grupOriginal[key] = g;
    }
  }

  var grupKeys = Object.keys(grups).sort();
  Logger.log("Grups: " + JSON.stringify(grupKeys));

  // 2. Llegir dades font
  var resumAll = sheetResum.getDataRange().getValues();
  var respAll  = sheetResp.getDataRange().getValues();
  Logger.log("Resum: " + resumAll.length + " files | Respostes: " + respAll.length + " files");

  // 3. Pre-classificar files per grup usant el mapa email→grup
  //    (ignora la columna "Grup" guardada, que pot ser "Sense grup")
  var resumByGrup = {};
  var respByGrup  = {};
  for (var k = 0; k < grupKeys.length; k++) {
    resumByGrup[grupKeys[k]] = [resumAll[0]]; // capçalera
    respByGrup[grupKeys[k]]  = [respAll[0]];
  }

  // Resum: email a col 0 (índex 0)
  for (var r = 1; r < resumAll.length; r++) {
    var email = String(resumAll[r][0]).trim().toLowerCase();
    var g = emailToGrup[email];
    if (g) {
      var key = g.toLowerCase();
      if (resumByGrup[key]) resumByGrup[key].push(resumAll[r]);
    }
  }

  // Respostes: email a col 1 (índex 1)
  for (var r = 1; r < respAll.length; r++) {
    var email = String(respAll[r][1]).trim().toLowerCase();
    var g = emailToGrup[email];
    if (g) {
      var key = g.toLowerCase();
      if (respByGrup[key]) respByGrup[key].push(respAll[r]);
    }
  }

  // 4. Crear pestanyes per grup
  var creats = [];
  for (var j = 0; j < grupKeys.length; j++) {
    var grupNorm = grupKeys[j];
    var grupDisp = grupOriginal[grupNorm];

    // ── Resum ──
    var nomResum = "Resum_" + grupDisp;
    var existResum = ss.getSheetByName(nomResum);
    if (existResum) ss.deleteSheet(existResum);
    var sResum = ss.insertSheet(nomResum);

    var resumRows = resumByGrup[grupNorm];
    Logger.log(nomResum + ": " + (resumRows.length - 1) + " alumnes");
    if (resumRows.length > 1) {
      sResum.getRange(1, 1, resumRows.length, resumRows[0].length).setValues(resumRows);
    } else {
      sResum.getRange(1, 1, 1, resumAll[0].length).setValues([resumAll[0]]);
      sResum.getRange(2, 1).setValue("(Cap alumne en aquest grup encara)");
    }
    sResum.setTabColor("#6d28d9");
    creats.push(nomResum);

    // ── Respostes ──
    var nomResp = "Respostes_" + grupDisp;
    var existResp = ss.getSheetByName(nomResp);
    if (existResp) ss.deleteSheet(existResp);
    var sResp = ss.insertSheet(nomResp);

    var respRows = respByGrup[grupNorm];
    Logger.log(nomResp + ": " + (respRows.length - 1) + " respostes");
    if (respRows.length > 1) {
      sResp.getRange(1, 1, respRows.length, respRows[0].length).setValues(respRows);
    } else {
      sResp.getRange(1, 1, 1, respAll[0].length).setValues([respAll[0]]);
      sResp.getRange(2, 1).setValue("(Cap resposta en aquest grup encara)");
    }
    sResp.setTabColor("#0284c7");
    creats.push(nomResp);
  }

  if (creats.length > 0) {
    SpreadsheetApp.getUi().alert("Fulls creats/actualitzats: " + creats.join(", "));
  } else {
    SpreadsheetApp.getUi().alert("No s'han trobat grups a la pestanya Participants.");
  }
}

/**
 * Diagnòstic complet: escriu els resultats a una pestanya "Diagnòstic"
 * perquè sigui fàcil veure què passa sense haver de consultar els logs.
 * Executa amb ▶ Run → diagnose
 */
function diagnose() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("=== INICI DIAGNÒSTIC ===");
  Logger.log("Nom spreadsheet: " + ss.getName());

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    Logger.log("Pestanya: '" + sheets[i].getName() + "' | lastRow=" + sheets[i].getLastRow() + " | lastCol=" + sheets[i].getLastColumn());
  }

  var p = ss.getSheetByName(SHEET_AUTHORIZED);
  if (p) {
    Logger.log("Participants fila 1: " + JSON.stringify(p.getRange(1, 1, 1, 4).getValues()[0]));
    if (p.getLastRow() >= 2) Logger.log("Participants fila 2: " + JSON.stringify(p.getRange(2, 1, 1, 4).getValues()[0]));
  } else {
    Logger.log("❌ Pestanya Participants NO trobada");
  }

  var r = ss.getSheetByName(SHEET_RESPONSES);
  if (r) {
    Logger.log("Respostes fila 1: " + JSON.stringify(r.getRange(1, 1, 1, Math.min(r.getLastColumn(), 5)).getValues()[0]));
    if (r.getLastRow() >= 2) Logger.log("Respostes fila 2 col D (grup): '" + r.getRange(2, 4).getValue() + "'");
    if (r.getFilter()) Logger.log("⚠️ Respostes té FILTRE ACTIU");
  } else {
    Logger.log("❌ Pestanya Respostes NO trobada");
  }

  var s = ss.getSheetByName(SHEET_SUMMARY);
  if (s) {
    Logger.log("Resum fila 1: " + JSON.stringify(s.getRange(1, 1, 1, Math.min(s.getLastColumn(), 5)).getValues()[0]));
    if (s.getLastRow() >= 2) Logger.log("Resum fila 2 col C (grup): '" + s.getRange(2, 3).getValue() + "'");
    if (s.getFilter()) Logger.log("⚠️ Resum té FILTRE ACTIU");
  } else {
    Logger.log("❌ Pestanya Resum_alumnes NO trobada");
  }

  Logger.log("=== FI DIAGNÒSTIC ===");
}

/**
 * Afegeix un menú personalitzat "Pitàgores" al full de càlcul
 * perquè el professor pugui executar la creació de fulls fàcilment.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📐 Pitàgores")
    .addItem("Crear / actualitzar fulls per grup", "crearFullsPerGrup")
    .addItem("Diagnòstic", "diagnose")
    .addToUi();
}
