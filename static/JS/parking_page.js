let timerInterval; // 用于保存计时器引用的全局变量

function startTimer(updateDisplayCallback) {
    let timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        updateDisplayCallback(timer);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval); // 停止计时器
}

buttonParkingStop = document.querySelector('#parking-stop-button');


buttonParkingStop.addEventListener('click', async function() {
    const parkingLotIdElement = document.querySelector('#packing-page-parking-lot-id');
    const parkingLotIdText = parkingLotIdElement.textContent;
    let ParkingStopTime = await getCurrentDateTime();
    await passParkingStopData(parkingLotIdText, ParkingStopTime); // 将 formData 传递给 passData 函数并等待其执行完成   
    fetchData();
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
    const ParkingStopData = {
        stopData: parkingLotIdText,
        stopTime: ParkingStopTime
    };
    const response = await fetch("/api/input_stopping_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ParkingStopData), 
    });
    console.log(response)
    return response;
}