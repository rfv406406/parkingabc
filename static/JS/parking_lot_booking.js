fetchData()
//調用停車場DB數據
async function fetchData(){
    try{
        const response = await getData();
        const data = await handleResponse(response);
        console.log(data);
        displayMarkers(data);
    }catch(error){
        await handleError(error);
    }
}

async function getData(){
    const response = await fetch("/api/input_parking_lot_information", {
        method: 'GET',
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
// ----------------------------------------------------------------------
buttonBooking = document.querySelector('#button-parking-booking')
buttonReservation = document.querySelector('#button-parking-reservation')

buttonBooking.addEventListener('click', async function() {
    let bookingData = await getBookingInformation(location); // 等待 packingData 函数完成并获取其返回值
    let bookingTime = await getCurrentDateTime();
    await passBookingData(formData); // 将 formData 传递给 passData 函数并等待其执行完成
});
//停車資料取得
async function getBookingInformation(location){
    return location
};
//取得停車當下時間
async function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是從 0 開始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



async function passBookingData(){
    let formData = await packingData();
    try{
        const response = await inputDataToDB(formData);
        const data = await handleResponse(response);
        console.log(data);
        // await fetchData();
    }catch(error){
        handleError(error);
    }
}

async function inputDataToDB(formData){
    const response = await fetch("/api/input_booking_information", {
        method: 'POST',
        body: formData,
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

function parkingLotInformationTable(locationData){
    document.querySelector('#parking-lot-name').textContent = locationData.name || '';
    document.querySelector('#parking-lot-address').textContent = locationData.address || '';
    document.querySelector('#parking-lot-near-landmark').textContent = locationData.landmark || '';
    document.querySelector('#parking-lot-opening-time').textContent = locationData.openingTime && locationData.closingTime 
    ? locationData.openingTime + ' - ' + locationData.closingTime: '';
    document.querySelector('#parking-lot-in-out').textContent = locationData.spaceInOut || '';
    document.querySelector('#parking-lot-price').textContent = locationData.price + '元' || '';
    document.querySelector('#parking-lot-width').textContent = locationData.widthLimit + 'm' || '';
    document.querySelector('#parking-lot-height').textContent = locationData.heightLimit + 'm'|| '';
    document.querySelector('#parking-space-total-number').textContent = locationData.spaces ? locationData.spaces.length.toString() + '位': '';
    const parkingLotImageElement = document.querySelector('#parking-lot-image');
    if (locationData.images && locationData.images[0]) {
        parkingLotImageElement.src = locationData.images[0];
    } else {
        parkingLotImageElement.src = ''; // 或設置為一個預設圖片的路徑
    }
};


