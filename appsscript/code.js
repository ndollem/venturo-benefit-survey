/**
 * Google Apps Script for Benefit Priority Challenge
 * 
 * Instructions:
 * 1. Create a Google Spreadsheet named "Benefit Survey Responses"
 * 2. Rename the active sheet/tab to "Responses"
 * 3. Add the following headers in row 1:
 *    A1: Timestamp
 *    B1: Name
 *    C1: Answers
 *    D1: Stay Reason
 *    E1: Leave Reason
 * 4. Go to Extensions -> Apps Script
 * 5. Replace the default code with this file's contents
 * 6. Save the project
 * 7. Click Deploy -> New Deployment
 * 8. Choose Type: Web app
 * 9. Configure deployment:
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone (required so the frontend can POST without login)
 * 10. Click Deploy, authorize permissions, and copy the Web App URL (this is your submitEndpoint)
 */

function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Empty request body"
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Validation
    if (!data.name || String(data.name).trim() === "") {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Name is required"
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    if (!data.answers || typeof data.answers !== "object" || Object.keys(data.answers).length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Answers must contain at least one response"
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    // Open Spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
    if (!sheet) {
      // Fallback: use first sheet if "Responses" not found
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    }
    
    var timestamp = new Date();
    var name = String(data.name).trim();
    var answersJson = JSON.stringify(data.answers);
    var stayReason = data.stayReason ? String(data.stayReason).trim() : "";
    var leaveReason = data.leaveReason ? String(data.leaveReason).trim() : "";
    
    // Append to sheet: [Timestamp, Name, Answers (JSON), Stay Reason, Leave Reason]
    sheet.appendRow([timestamp, name, answersJson, stayReason, leaveReason]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Server Error: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// Handle preflight CORS requests
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}
