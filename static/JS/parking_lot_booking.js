let bookingLocationData;

buttonBooking = document.querySelector('#button-parking-booking')
buttonReservation = document.querySelector('#button-parking-reservation')

buttonBooking.addEventListener('click', async function() {
    let bookingData = bookingLocationData; // return data get
    let bookingTime = await getCurrentDateTime();
    // console.log(bookingData)
    // console.log(bookingTime)
    await passBookingData(bookingData, bookingTime); 
    await returnBookingData()
    fetchData()
    toggleClass('#packing-page-container', 'packing-page-container-toggled');
    toggleClass('#packing-page-black-back', 'black-back-toggled');  
    startTimer(updateTimerDisplay);   
});
//停車資料取得
async function getBookingInformation(locationData){
    console.log(locationData)
    bookingLocationData = locationData
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

async function returnBookingData(){
    try{
        const response = await showBookingDataOnParkingPage();
        const data = await handleResponse(response);
        console.log(data);
        await renderParkingPage(data)
    }catch(error){
        handleError(error);
    }
}
returnBookingData()

async function showBookingDataOnParkingPage(){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/get_booking_information", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response;
}

async function passBookingData(bookingData, bookingTime){
    try{
        const response = await inputBookingDataToDB(bookingData, bookingTime);
        const data = await handleResponse(response);
        console.log(data);
        // await fetchData();
    }catch(error){
        handleError(error);
    }
}

async function inputBookingDataToDB(bookingData, bookingTime){
    const token = localStorage.getItem('Token');
    const bookingInformationData = {
        bookingData: bookingData,
        bookingTime: bookingTime
    };
    const response = await fetch("/api/input_booking_information", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingInformationData), 
    });
    console.log(bookingInformationData)
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
    const spacesWithEmptyStatus = locationData.spaces ? locationData.spaces.filter(space => !space.status).length : 0;
    const totalSpaces = locationData.spaces ? locationData.spaces.length : 0;
    document.querySelector('#parking-space-total-number').textContent = `${spacesWithEmptyStatus} / ${totalSpaces} 位`;    const parkingLotImageElement = document.querySelector('#parking-lot-image');
    if (locationData.images && locationData.images[0]) {
        parkingLotImageElement.src = locationData.images[0];
    } else {
        parkingLotImageElement.src = ''; // 或設置為一個預設圖片的路徑
    }
};

async function renderParkingPage(data){
    if (data.data == '目前尚無停車資訊'){
        return
    }
    toggleClass('#packing-page-information', 'packing-page-information-toggled'); 
    toggleClass('#packing-page-information-none', 'packing-page-information-none-toggled'); 
    document.querySelector('#packing-page-parking-lot-id').textContent = data.data[0].id;
    document.querySelector('#packing-page-parking-lot-name').textContent = data.data[0].parkinglotname;
    document.querySelector('#packing-page-parking-lot-address').textContent = data.data[0].address;
    document.querySelector('#packing-page-parking-lot-space-number').textContent = data.data[0].square_number;
    document.querySelector('#packing-page-parking-lot-price').textContent = data.data[0].price;
    document.querySelector('#packing-page-parking-lot-start-time').textContent = data.data[0].starttime;
};