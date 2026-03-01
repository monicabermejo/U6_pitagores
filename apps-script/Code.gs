/**
 * Pitàgores – Google Apps Script Web App
 * ----------------------------------------
 * Despliega como Web App con:
 *   · Ejecutar como: Yo (propietario del sheet)
 *   · Quién tiene acceso: Cualquiera
 *
 * La validación de usuarios se hace internamente comprobando
 * la hoja "Alumnes_autoritzats" antes de escribir nada.
 */

// ── Nombres de las hojas ────────────────────────────────────────────────────
var SHEET_RESPONSES    = "Respostes";
var SHEET_AUTHORIZED   = "Alumnes_autoritzats";
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

    // 4. Buscar el nombre del alumno en la hoja de autorizados
    var studentName = getStudentName(email);

    // 5. Escribir la respuesta en la hoja de Respostes
    var ss       = SpreadsheetApp.getActiveSpreadsheet();
    var sheetRes = ss.getSheetByName(SHEET_RESPONSES);

    sheetRes.appendRow([
      new Date(),                          // A: Timestamp
      email,                               // B: Email
      studentName,                         // C: Nom alumne
      String(data.section),                // D: Secció
      String(data.questionId),             // E: ID pregunta
      String(data.questionText),           // F: Text pregunta
      String(data.userAnswer),             // G: Resposta alumne
      String(data.correctAnswer),          // H: Resposta correcta
      data.isCorrect ? "SÍ" : "NO",        // I: Correcte?
      String(data.lang),                   // J: Idioma
      String(data.sessionId || "")         // K: ID sessió
    ]);

    // 6. Actualizar el resum (opcional – upsert per alumne)
    updateSummary(email, studentName, data.isCorrect, data.section);

    output.setContent(JSON.stringify({ ok: true, message: "Resposta enregistrada." }));

  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }

  return output;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Comprova si l'email està a la columna A de "Alumnes_autoritzats".
 * Ignora majúscules/minúscules i espais.
 */
function isAuthorized(email) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_AUTHORIZED);
  var values = sheet.getRange("A:A").getValues();

  for (var i = 1; i < values.length; i++) { // fila 0 és la capçalera
    var cell = String(values[i][0]).trim().toLowerCase();
    if (cell === email) return true;
  }
  return false;
}

/**
 * Retorna el nom de l'alumne (columna B) a partir del seu email (columna A).
 * Retorna l'email si no té nom assignat.
 */
function getStudentName(email) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_AUTHORIZED);
  var values = sheet.getRange("A:B").getValues();

  for (var i = 1; i < values.length; i++) {
    var cell = String(values[i][0]).trim().toLowerCase();
    if (cell === email) {
      return values[i][1] ? String(values[i][1]) : email;
    }
  }
  return email;
}

/**
 * Fa un upsert a "Resum_alumnes":
 * – Si l'alumne ja existeix, actualitza els comptadors.
 * – Si és nou, afegeix una fila.
 *
 * Columnes: Email | Nom | Total respostes | Correctes | Incorrectes | % Èxit | Última activitat | Seccions completades
 */
function updateSummary(email, studentName, isCorrect, section) {
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var sheetSum   = ss.getSheetByName(SHEET_SUMMARY);
  var data       = sheetSum.getDataRange().getValues();
  var now        = new Date();

  // Buscar fila existent (comença a fila 2 → índex 1)
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === email) {
      var row      = i + 1; // 1-based per a Sheets
      var total    = (data[i][2] || 0) + 1;
      var correct  = (data[i][3] || 0) + (isCorrect ? 1 : 0);
      var incorrect= (data[i][4] || 0) + (isCorrect ? 0 : 1);
      var pct      = total > 0 ? Math.round((correct / total) * 100) : 0;

      // Afegir la secció a la llista si no hi és
      var sections = data[i][7] ? String(data[i][7]) : "";
      if (section && sections.indexOf(section) === -1) {
        sections = sections ? sections + ", " + section : section;
      }

      sheetSum.getRange(row, 3, 1, 6).setValues([[total, correct, incorrect, pct + "%", now, sections]]);
      return;
    }
  }

  // Alumne nou
  sheetSum.appendRow([
    email,
    studentName,
    1,
    isCorrect ? 1 : 0,
    isCorrect ? 0 : 1,
    isCorrect ? "100%" : "0%",
    now,
    section || ""
  ]);
}

// ── GET per comprovar que el desplegament funciona ──────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Pitàgores API operativa." }))
    .setMimeType(ContentService.MimeType.JSON);
}
