let timerInterval; // 用于保存计时器引用的全局变量

function startTimer(updateDisplayCallback, elapsedTime = 0) {
    // 獲取當前時間的Unix時間戳（秒）
    const now = Math.floor(Date.now() / 1000);

    // 存儲開始時間
    localStorage.setItem("timerStart", now - elapsedTime);

    // 設置計時器
    let timer = elapsedTime;
    timerInterval = setInterval(() => {
        timer++;
        updateDisplayCallback(timer);
    }, 1000);
}

function getElapsedTime() {
    const startTime = parseInt(localStorage.getItem("timerStart"), 10);
    const now = Math.floor(Date.now() / 1000); // 當前時間的Unix時間戳（秒）
    return now - startTime; // 返回已經過去的時間（秒）
};

startTimer(updateTimerDisplay, getElapsedTime());

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

buttonParkingStop = document.querySelector('#parking-stop-button');


buttonParkingStop.addEventListener('click', async function() {
    const parkingLotIdElement = document.querySelector('#packing-page-parking-lot-id');
    const parkingLotIdText = parkingLotIdElement.textContent;
    let ParkingStopTime = await getCurrentDateTime();
    await passParkingStopData(parkingLotIdText, ParkingStopTime); // 将 formData 传递给 passData 函数并等待其执行完成   
    await fetchData();
    stopTimer();
});

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
}