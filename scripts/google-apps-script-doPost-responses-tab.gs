/**
 * doPost for a fixed spreadsheet + tab "responses".
 * Matches payload from lib/experimentWebhook.ts (v2: response_rows or responses).
 *
 * 1. Set SPREADSHEET_ID to your file ID (from the sheet URL).
 * 2. Deploy → New deployment → Web app: Execute as Me, Who has access: Anyone.
 * 3. Put NEXT_PUBLIC_WEBHOOK_URL in .env.local to the /exec URL.
 */
var SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("no body").setMimeType(
        ContentService.MimeType.TEXT
      );
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("responses");
    if (!sheet) {
      throw new Error("Sheet 'responses' not found");
    }

    // Best: use response_rows (12 columns per row, same order as SHEET_ROW_KEYS in experimentWebhook.ts)
    if (data.response_rows && data.response_rows.length > 0) {
      for (var i = 0; i < data.response_rows.length; i++) {
        sheet.appendRow(data.response_rows[i]);
      }
      return ContentService.createTextOutput(
        "ok " + data.response_rows.length
      ).setMimeType(ContentService.MimeType.TEXT);
    }

    // Fallback: build from data.responses (objects with snake_case fields)
    if (!data.responses || !data.responses.length) {
      return ContentService.createTextOutput("no response_rows or responses").setMimeType(
        ContentService.MimeType.TEXT
      );
    }

    var rows = data.responses.map(function (r) {
      return [
        data.participant_id || r.participant_id || "",
        r.round_number,
        r.scenario_id,
        r.asset,
        r.expert_prediction,
        r.ai_prediction,
        r.outcome,
        r.user_choice_source,
        r.user_choice_prediction,
        r.matched_outcome,
        r.response_time_ms,
        r.answered_at,
      ];
    });

    for (var j = 0; j < rows.length; j++) {
      sheet.appendRow(rows[j]);
    }
    return ContentService.createTextOutput("ok legacy " + rows.length).setMimeType(
      ContentService.MimeType.TEXT
    );
  } catch (err) {
    return ContentService.createTextOutput(
      "ERROR: " + (err && err.message ? err.message : String(err))
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}
