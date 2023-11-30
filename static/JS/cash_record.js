initCashRecord();
let cashRecords;

async function initCashRecord(){
    try{
        const response = await getCashRecordData();
        const data = await handleResponse(response);
        console.log(data);
        cashRecords = data;
        filterAndDisplayRecords(cashRecords)
    }catch(error){
        await handleError(error);
    }
}

async function getCashRecordData(){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/cash_record", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
}

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Get null from backend');
    }
    return response.json();
}

async function handleError(error) {
    console.error('Backend could got problems', error);
}
// ---------------------------------------------------------------------------------

document.getElementById('data-type-selector').addEventListener('change', function() {
    filterAndDisplayRecords(cashRecords);});
document.getElementById('time-range-selector').addEventListener('change', function() {
    filterAndDisplayRecords(cashRecords);});

function filterAndDisplayRecords(data) {
    const dataTypeSelector = document.getElementById('data-type-selector');
    const timeRange = document.getElementById('time-range-selector').value;

    // 將select選項的值映射到對應的數據鍵
    const dataTypeMapping = {
        'type1': 'transactions',
        'type2': 'consumption_payment',
        'type3': 'consumption_income'
    };

    let selectedDataType = dataTypeMapping[dataTypeSelector.value];
    let relevantData = data[selectedDataType] || []; // 使用 || [] 確保在數據為undefined時返回空數組

    if (selectedDataType === 'transactions') {
        relevantData = relevantData.filter(record => record.Type === 'DEPOSIT');
    }

    // 根據選擇的時間範圍過濾數據
    let filteredRecords = relevantData.filter(record => {
        return matchesTimeRange(record, timeRange);
    });
    // 動態生成HTML內容
    displayRecords(filteredRecords, selectedDataType);
}

function matchesTimeRange(record, timeRange) {
    let recordDate;

    // 確定記錄的類型並解析日期
    if (record.stoptime) { // 對於 'consumption_income' 和 'consumption_payment'
        recordDate = new Date(record.stoptime);
    } else if (record.transactions_time) { // 對於 'transactions'
        recordDate = new Date(record.transactions_time);
    } else {
        return false; // 如果沒有有效的日期，返回 false
    }

    // 根據時間範圍進行比較
    switch (timeRange) {
        case 'this_week':
            return isThisWeek(recordDate);
        case 'this_month':
            return isThisMonth(recordDate);
        case 'all':
            return true; // 對於“全部”，始終返回 true
        default:
            return false; // 如果沒有匹配的時間範圍，返回 false
    }
}

function isThisWeek(date) {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); // 這週的第一天（星期一）
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); // 這週的最後一天（星期天）

    return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

function isThisMonth(date) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return date >= firstDayOfMonth && date <= lastDayOfMonth;
}

function displayRecords(records, dataType) {
    const container = document.getElementById('plate-board-information');
    container.innerHTML = ''; // 清空现有内容

    if (records.length === 0) {
        container.innerHTML = '<div>查無數據</div>';
        return;
    }

    records.forEach(record => {
        let htmlContent = '';
        switch (dataType) {
            case 'transactions':
                // 假设 transactions 类型的记录需要显示 Amount 和 Type
                htmlContent = `<div class="plate-board-information">
                <div>日期: ${record.transactions_time}</div>
                <div>儲值金額: ${record.Amount}${'元'}</div>
                </div>`;
                break;
            case 'consumption_payment':
                // 假设 consumption_payment 类型的记录需要显示不同的字段
                htmlContent = `<div class="plate-board-information">
                               <div>日期: ${record.date}</div>
                               <div>車牌: ${record.car_board}</div>
                               <div>停車場: ${record.parkinglotname}</div>
                               <div>車位編號: ${record.square_number}</div>
                               <div>停車時間: ${record.starttime}</div>
                               <div>結束時間: ${record.stoptime}</div>
                               <div>停車費: ${record.payment}${'元'}</div>
                               </div>`;
                break;
            case 'consumption_income':
                // 假设 consumption_income 类型的记录显示又不同的字段
                htmlContent = `<div class="plate-board-information">
                               <div>日期: ${record.date}</div>
                               <div>停車場: ${record.parkinglotname}</div>
                               <div>車位編號: ${record.parkinglotsquare}</div>
                               <div>停車時間: ${record.starttime}</div>
                               <div>結束時間: ${record.stoptime}</div>
                               <div>收入: ${record.income}${'元'}</div>
                               </div>`;
                break;
        }
        container.innerHTML += htmlContent;
    });
}