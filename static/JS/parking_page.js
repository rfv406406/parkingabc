// 事件監聽設置的通用函式
function setupToggle(buttonSelector, toggles) {
    document.querySelector(buttonSelector).addEventListener('click', function(event) {
      event.preventDefault();
      toggles.forEach(function(toggle) {
        toggleClass(toggle.elementSelector, toggle.classToToggle);
      });
    });
  };

  // 事件監聽設置的通用函式 
function setupRemoveButton(Selector, elementSelectorANDcss) {
    let element = document.querySelector(Selector);
    element.addEventListener('click', function() {
      elementSelectorANDcss.forEach(item => {
        removeClass(item.elementSelector, item.css);
    });
  });
  }
  
  //parking_page block顯示
setupToggle('#parking-page-button-list', [
    { elementSelector: '#packing-page-container', classToToggle: 'packing-page-container-toggled' },
    { elementSelector: '#packing-page-black-back', classToToggle: 'black-back-toggled' }
  ]);
  
  setupRemoveButton('#close-packing-page', [
    { elementSelector: '#packing-page-container', css: ['packing-page-container-toggled'] },
    { elementSelector: '#packing-page-black-back', css: ['black-back-toggled'] },
    { elementSelector: '#menuContent', css: ['menuContent_toggled'] },
    // { elementSelector: '#packing-page-information-none', css: ['packing-page-information-none-toggled'] },
    { elementSelector: '#packing-page-car-board-selected', css: ['packing-page-car-board-selected-toggled'] },
    { elementSelector: '.parking_lot-information-container', css: ['parking_lot-information-container-toggled', 'parking_lot-information-container-appear'] }
  ]);

  //alert_page none顯示
setupRemoveButton('#alert-content-checked-button', [
    { elementSelector: '#alert-page-container', css: ['alert-page-container-toggled'] },
    { elementSelector: '#alert-page-black-back', css: ['alert-page-black-back-toggled'] },
  ]);
//   ---------------------------------------------------------------------------------------

let timerInterval; // 用于保存计时器引用的全局变量

function startTimer(updateDisplayCallback) {
    const now = Math.floor(Date.now() / 1000);
    let storedStartTime = localStorage.getItem("timerStart");

    // 如果没有存储的开始时间，则设置现在为开始时间
    if (!storedStartTime) {
        localStorage.setItem("timerStart", now);
    }
    toggleStopButtonReload();
    // 计算已经过去的时间并开始计时
    let elapsedTime = now - parseInt(localStorage.getItem("timerStart"), 10);
    timerInterval = setInterval(() => {
        elapsedTime++;
        updateDisplayCallback(elapsedTime);
    }, 1000);
}
function getElapsedTime() {
    const storedStartTime = localStorage.getItem("timerStart");
    const startTime = parseInt(storedStartTime, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(startTime)) {
        // 如果 localStorage 中没有有效的 startTime，假设计时器刚开始
        // const now = Math.floor(Date.now() / 1000);
        // localStorage.setItem("timerStart", now);
        return 0;
    }
    // const now = Math.floor(Date.now() / 1000);
    return now - startTime;
}

window.addEventListener('load', () => {
    if (localStorage.getItem("timerStart")) {
        startTimer(updateTimerDisplay);
    }
});

function updateTimerDisplay(timerValue) {
    // 如果 timerValue 不是数字，设置为 0
    if (isNaN(timerValue)) {
        timerValue = 0;
    }
    // 將總秒數轉換為天、小時、分、秒
    let seconds = timerValue % 60;
    let totalMinutes = Math.floor(timerValue / 60);
    let minutes = totalMinutes % 60;
    let totalHours = Math.floor(totalMinutes / 60);
    let hours = totalHours % 24;
    let days = Math.floor(totalHours / 24);

    // 創建顯示字符串
    let displayString = `${days}天 ${hours}小時 ${minutes}分 ${seconds}秒`;

    // 更新DOM元素
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = displayString;
}

function stopTimer() {
    clearInterval(timerInterval); // 停止计时器
    localStorage.removeItem("timerStart");
}

function toggleStopButtonReload() {
    const stopButton = document.getElementById('parking-stop-button');
    const cancelMessage = document.getElementById('cancel-message');
    const bookingTime = parseInt(localStorage.getItem('timerStart'), 10);
    console.log(bookingTime)

    if (bookingTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeElapsed = currentTime - bookingTime;

        if (timeElapsed < 30) { // under 5 mins
            if (lastClickedButton === 'reservation') {
                stopButton.textContent = '取消預約';
            } else if (lastClickedButton === 'booking') {
                stopButton.textContent = '取消停車';
            }
            cancelMessage.textContent = '5分鐘內可免費取消';

            setTimeout(() => {
                stopButton.textContent = '結帳'; 
                cancelMessage.textContent = '';
            }, (30 - timeElapsed) * 1000);
        }
    }else{
        console.log("no timer in localStorage")
    }
};

buttonParkingStop = document.querySelector('#parking-stop-button');


buttonParkingStop.addEventListener('click', async function() {
    const parkingLotIdElement = document.querySelector('#packing-page-parking-lot-id');
    const parkingLotIdText = parkingLotIdElement.textContent;
    let ParkingStopTime = await getCurrentDateTime();
    await passParkingStopData(parkingLotIdText, ParkingStopTime); 
    await fetchData();
    await returnBookingData();
    stopTimer();
    removeClass('#packing-page-container', ['packing-page-container-toggled'])
    await thankMessage()
    location.reload();
});

async function thankMessage(){
    const alertContent = document.getElementById("alert-content")
    alertContent.textContent = '感謝您的消費';
    toggleClass('#alert-page-container', 'alert-page-container-toggled');
    toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
};

async function passParkingStopData(parkingLotIdText, ParkingStopTime){
    try{
        const response = await inputParkingStopDataToDB(parkingLotIdText, ParkingStopTime);
        const data = await handleResponse(response);
        console.log(data);
        // await fetchData();
    }catch(error){
        handleError(error);
    }
}

async function inputParkingStopDataToDB(parkingLotIdText, ParkingStopTime){
    const token = localStorage.getItem('Token');
    const ParkingStopData = {
        stopData: parkingLotIdText,
        stopTime: ParkingStopTime
    };
    const response = await fetch("/api/input_stopping_data", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ParkingStopData), 
    });
    console.log(response)
    return response;
};

