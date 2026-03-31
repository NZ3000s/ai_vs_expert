/**
 * Canonical doPost for the Next.js experiment webhook.
 * Deploy as Web app: Execute as Me, Who has access: Anyone (or your org).
 *
 * Expected JSON (see lib/experimentWebhook.ts):
 * - payload_format_version: 2
 * - participant_id: string
 * - responses: array of row objects (12 keys each)
 * - response_rows: array of 12-element arrays (same order as sheet headers)
 *
 * Do NOT prepend TEST_WRITE, dates, or debug columns — that shifts columns and
 * breaks alignment with the sheet headers.
 */
function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput("no body").setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("experiment_results");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  // Prefer v2: append exactly 12 columns per round, no extra prefix columns.
  if (data.payload_format_version === 2 && data.response_rows && data.response_rows.length) {
    for (var i = 0; i < data.response_rows.length; i++) {
      sheet.appendRow(data.response_rows[i]);
    }
    return ContentService.createTextOutput("ok " + data.response_rows.length).setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  if (data.response_rows && data.response_rows.length) {
    for (var j = 0; j < data.response_rows.length; j++) {
      sheet.appendRow(data.response_rows[j]);
    }
    return ContentService.createTextOutput("ok legacy " + data.response_rows.length).setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  return ContentService.createTextOutput("no response_rows").setMimeType(
    ContentService.MimeType.TEXT
  );
}
