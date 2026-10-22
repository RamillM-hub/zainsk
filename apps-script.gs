// Вставьте этот код в Google Таблицу: Расширения → Apps Script. Затем Развернуть → Новое развертывание → Веб-приложение.
// Выполнять от имени: Я. Доступ: Все. Скопируйте адрес веб-приложения в config.js (API_URL).
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Заказы") || ss.getSheets()[0];
  var rows = sh.getDataRange().getDisplayValues();
  return ContentService.createTextOutput(JSON.stringify({updated: new Date().toISOString(), rows: rows}))
    .setMimeType(ContentService.MimeType.JSON);
}
