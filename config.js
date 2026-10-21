// Настройки подключения к Google Таблице.
// 1) Вставьте ID таблицы между кавычками (он виден в адресе: docs.google.com/spreadsheets/d/ВОТ_ЭТО/edit).
// 2) Если оставить пусто, дашборд покажет демо-данные.
const CONFIG = {
  SHEET_ID: "1gUtxTaioGVKdB1yca8ZGnvCJQna0BjWbu9KADRVVquA",          // например: "1AbCdEfGh...XyZ"
  SHEET_ORDERS: "Заказы",// название листа с заказами
  REFRESH_MIN: 5         // как часто перезагружать данные, в минутах (0 = не перезагружать)
};
