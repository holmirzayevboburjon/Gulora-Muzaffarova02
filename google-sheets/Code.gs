// Ushbu kod Google Apps Script muharririga qo‘yiladi.
const SPREADSHEET_ID = '1NrhRas-PERK_9JW5K59ay0xW_01qb04GnU-cB-47Y9U';
const TAB_NAME = 'IELTS arizalar';
const HEADERS = ['Sana (Toshkent)', 'Ism', 'Telefon', 'Sayt', 'Ariza ID'];

function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('LEAD_WEBHOOK_TOKEN')) {
    props.setProperty('LEAD_WEBHOOK_TOKEN', Utilities.getUuid() + Utilities.getUuid());
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { getLeadSheet_(); }
  finally { lock.releaseLock(); }
  // Faqat Vercel Environment Variables bo‘limiga ko‘chiring, sayt kodiga yozmang.
  console.log('LEAD_WEBHOOK_TOKEN: ' + props.getProperty('LEAD_WEBHOOK_TOKEN'));
}

function getLeadSheet_() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = book.getSheetByName(TAB_NAME) || book.insertSheet(TAB_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setBackground('#142f53').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 70);
    sheet.setColumnWidth(5, 290);
  } else {
    const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (JSON.stringify(existing) !== JSON.stringify(HEADERS)) {
      throw new Error('IELTS arizalar varag‘i ustunlari mos emas. Mavjud ma’lumotlar o‘zgartirilmadi.');
    }
  }
  return sheet;
}

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 4096) return json_({ok: false});
    const data = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('LEAD_WEBHOOK_TOKEN');
    if (!token || data.token !== token) return json_({ok: false});
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.replace(/[\s()-]/g, '') : '';
    const requestId = typeof data.requestId === 'string' ? data.requestId : '';
    if (name.length < 2 || name.length > 80 || !/^\+?\d{9,15}$/.test(phone)
      || !/^[a-zA-Z0-9-]{16,80}$/.test(requestId) || !['01', '02', '03'].includes(data.variant)) return json_({ok: false});
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return json_({ok: false});
    const sheet = getLeadSheet_();
    const lastRow = sheet.getLastRow();
    // Takror yuborish tugmasi ayni arizani ikkinchi marta yozmaydi.
    if (lastRow > 1 && sheet.getRange(2, 5, lastRow - 1, 1).createTextFinder(requestId)
      .matchEntireCell(true).useRegularExpression(false).findNext()) return json_({ok: true});
    const row = lastRow + 1;
    const values = [[Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyy-MM-dd HH:mm:ss'),
      "'" + name, "'" + phone, '01', requestId]];
    sheet.getRange(row, 1, 1, 5).setNumberFormat('@').setValues(values);
    SpreadsheetApp.flush();
    return json_({ok: true});
  } catch (_) {
    return json_({ok: false});
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
