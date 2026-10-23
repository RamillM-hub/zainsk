// Настройки подключения к Google Таблице.
// 1) Вставьте ID таблицы между кавычками (он виден в адресе: docs.google.com/spreadsheets/d/ВОТ_ЭТО/edit).
// 2) Если оставить пусто, дашборд покажет демо-данные.
const CONFIG = {
  SHEET_ID: "1gUtxTaioGVKdB1yca8ZGnvCJQna0BjWbu9KADRVVquA",          // например: "1AbCdEfGh...XyZ"
  API_URL: "https://script.google.com/macros/s/AKfycbzdw6gnB3a6UVIqKbVx4TdLSTnuoTNf41uKU4ZgscGfYJ8AMYNRCd3LCwkPSjD1n6ulnQ/exec",           // адрес Apps Script (надёжнее, см. README); если пусто, данные берутся напрямую из таблицы
  SHEET_ORDERS: "Заказы",// название листа с заказами
  TIMEZONE: "Europe/Moscow", // часовой пояс цеха (Казань = Europe/Moscow)
  REFRESH_MIN: 5         // как часто перезагружать данные, в минутах (0 = не перезагружать)
};
