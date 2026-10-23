// Вставьте этот код в Google Таблицу: Расширения → Apps Script. Затем Развернуть → Новое развертывание → Веб-приложение.
// Выполнять от имени: Я. Доступ: Все. Скопируйте адрес веб-приложения в config.js (API_URL).
//
// ИСТОРИЯ ПО ДНЯМ. Раз в день скрипт сам копирует в лист «История» те строки, где что-то «В работе».
// Так дашборд помнит, что делали вчера (план на вчера и переезд зданий из цеха отливки в основной цех).
// Один раз запустите функцию  включитьИсторию  (она создаст ежедневный запуск между 17:00 и 18:00).
var HIST = "История";
var HEAD = ["Дата","Номер заказа","Объект","Состав","Отливка стен","Отливка основания","Внутренняя покраска","Внешняя покраска","Покрытие крыши","Монтаж лотков и заземления","Отгрузка","Дата готовности"];

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Заказы") || ss.getSheets()[0];
  var rows = sh.getDataRange().getDisplayValues();
  var hist = [];
  var hs = ss.getSheetByName(HIST);
  if (hs && hs.getLastRow() > 1) {
    var all = hs.getDataRange().getDisplayValues();
    var dates = {};
    for (var i = 1; i < all.length; i++) dates[all[i][0]] = 1;
    var keep = Object.keys(dates).sort().slice(-10);            // последние 10 сохранённых дней
    hist = [all[0]].concat(all.slice(1).filter(function (r) { return keep.indexOf(r[0]) >= 0; }));
  }
  return ContentService.createTextOutput(JSON.stringify({updated: new Date().toISOString(), rows: rows, hist: hist}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Сохраняет сегодняшний день: строки, где есть «В работе». Можно запускать вручную в любой момент (повтор за день заменяет запись).
function сохранитьДень() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Заказы") || ss.getSheets()[0];
  var data = sh.getDataRange().getDisplayValues();
  var hs = ss.getSheetByName(HIST);
  if (!hs) {
    hs = ss.insertSheet(HIST);
    hs.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
    hs.setFrozenRows(1);
    hs.getRange(2, 1, hs.getMaxRows() - 1, 1).setNumberFormat("@");   // дата хранится как текст
  }
  var today = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
  for (var r = hs.getLastRow(); r >= 2; r--) if (hs.getRange(r, 1).getDisplayValue() === today) hs.deleteRow(r);
  var ord = "", obj = "", out = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[0]).trim()) ord = row[0];
    if (String(row[1]).trim()) obj = row[1];
    if (!String(row[2]).trim() || !ord) continue;
    var work = false;
    for (var c = 4; c <= 10; c++) if (String(row[c]).trim().toLowerCase() === "в работе") work = true;
    if (work) out.push([today, ord, obj, row[2], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11] || ""]);
  }
  if (out.length) {
    var start = hs.getLastRow() + 1;
    hs.getRange(start, 1, out.length, 1).setNumberFormat("@");
    hs.getRange(start, 1, out.length, HEAD.length).setValues(out);
  }
}

// Запустить ОДИН раз: создаёт ежедневное сохранение (между 17:00 и 18:00) и сразу сохраняет сегодняшний день.
function включитьИсторию() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === "сохранитьДень") ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger("сохранитьДень").timeBased().everyDays(1).atHour(17).create();
  сохранитьДень();
}
