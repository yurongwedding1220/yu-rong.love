/**
 * Yu & Rong Wedding — Google Apps Script
 * 試算表欄位（第一張工作表）：
 *  1 提交時間 | 2 姓名 | 3 親友別 | 4 關係 | 5 是否出席
 *  6 成人 | 7 兒童 | 8 兒童椅 | 9 素食 | 10 紙本喜帖
 *  11 郵遞區號 | 12 地址 | 13 Email | 14 留言 | 15 顯示留言板
 *  16 愛心數 | 17 留言板顯示名稱 | 18 抵達方式 | 19 LINE ID
 *
 * 請在標題列 R、S 欄手動加上「抵達方式」「LINE ID」
 * 貼上後：部署 → 管理部署 → 編輯 → 新版本（權限：所有人）
 */

function formatArrivalMethod(code) {
  if (code === 'car') return '自行開車';
  if (code === 'train') return '台鐵火車';
  if (code === 'hsr') return '高鐵';
  return '';
}

function doPost(e) {
  var lock = LockService.getScriptLock();

  if (!lock.tryLock(10000)) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Server busy' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheets()[0];

    // ==========================================
    // 判斷動作：如果是 'like'，執行更新邏輯
    // ==========================================
    if (data.action === 'like') {
      if (!data.id || !data.id.startsWith('row-')) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Invalid ID' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var rowIndexStr = data.id.replace('row-', '');
      var rowIndex = parseInt(rowIndexStr, 10);
      var sheetRow = rowIndex + 1;

      var lastRow = sheet.getLastRow();
      if (sheetRow > lastRow || sheetRow < 2) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Row not found' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // 愛心數在第 16 欄 (P欄)
      var likeCell = sheet.getRange(sheetRow, 16);
      var currentLikes = likeCell.getValue();

      if (isNaN(currentLikes) || currentLikes === '') {
        currentLikes = 0;
      }

      likeCell.setValue(currentLikes + 1);

      return ContentService.createTextOutput(JSON.stringify({ result: 'success', action: 'like_updated' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ==========================================
    // 預設動作：RSVP（新增留言 / 出席回覆）
    // ==========================================
    var timestamp = new Date();
    var isAttending = data.attendance === 'yes';

    var sideText = '';
    if (data.side === 'groom') sideText = '男方親友';
    else if (data.side === 'bride') sideText = '女方親友';

    var needInvite = data.needPaperInvite === 'yes';
    var displayPropsName = data.guestbookName || data.name;

    var row = [
      timestamp, // 1. 提交時間
      data.name, // 2. 姓名 (本名)
      sideText, // 3. 親友別
      data.relation, // 4. 關係
      isAttending, // 5. 是否出席
      isAttending ? data.adults : 0, // 6. 成人人數
      isAttending ? data.children : 0, // 7. 兒童人數
      isAttending ? data.highChairs : 0, // 8. 兒童椅
      isAttending ? data.vegetarian : 0, // 9. 素食
      needInvite, // 10. 紙本喜帖
      data.zipCode || '', // 11. 郵遞區號
      data.address || '', // 12. 地址
      data.email || '', // 13. 電子信箱
      data.message || '', // 14. 留言
      data.publishToGuestbook === true, // 15. 是否顯示在留言板
      0, // 16. 愛心數
      displayPropsName, // 17. 留言板顯示名稱
      isAttending ? formatArrivalMethod(data.arrivalMethod) : '', // 18. 抵達方式
      isAttending && data.arrivalMethod === 'hsr' ? data.lineId || '' : '', // 19. LINE ID（僅高鐵）
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success', action: 'rsvp_added' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// doGet：留言板讀取，或網站探訪總人數
function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  // ==========================================
  // 網站探訪人數記錄與讀取
  // ==========================================
  if (action === 'visit' || action === 'get_visit') {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var counterSheet = doc.getSheetByName('Counter');

    if (!counterSheet) {
      counterSheet = doc.insertSheet('Counter');
      counterSheet.getRange('A1').setValue(0);
    }

    var range = counterSheet.getRange('A1');
    var count = Number(range.getValue()) || 0;

    if (action === 'visit') {
      count = count + 1;
      range.setValue(count);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', count: count }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ==========================================
  // 預設：讀取留言板資料
  // ==========================================
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rows = sheet.getDataRange().getValues();
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    // 「是否顯示在留言板」第 15 欄 -> index 14
    if (rows[i][14] === true) {
      data.push({
        id: 'row-' + i,
        name: rows[i][16] || rows[i][1],
        message: rows[i][13],
        timestamp: new Date(rows[i][0]).getTime(),
        likes: rows[i][15] || 0,
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
