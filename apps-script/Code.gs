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

    // 5. Escribir la respuesta en la hoja de Respostes
    var ss       = SpreadsheetApp.getActiveSpreadsheet();
    var sheetRes = ss.getSheetByName(SHEET_RESPONSES);

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

    // 6. Actualizar el resum (upsert per alumne)
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

// ── GET: health check i validació d'email ───────────────────────────────────
function doGet(e) {
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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Pitàgores API operativa." }))
    .setMimeType(ContentService.MimeType.JSON);
}
