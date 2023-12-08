// 事件監聽設置的通用函式//排除按鈕
function setupToggleNotButtonElements(element, toggles) {
    document.querySelector(element).addEventListener('click', function(event) {
        // 檢查點擊的目標是否不是按鈕
        if (!event.target.matches('button')&&!event.target.matches('#data-type-selector')) {
          toggles.forEach(function(toggle) {
            toggleClass(toggle.elementSelector, toggle.classToToggle);
          });
        }
    });
  }

  // 事件監聽設置的通用函式 //非元件類
function setupRemove(Selector, elementSelectorANDcss) {
    Selector.addListener('click', function() {
      elementSelectorANDcss.forEach(item => {
        removeClass(item.elementSelector, item.css);
    });
  });
  }

//parking_lot-information-container go up顯示
setupToggleNotButtonElements('.parking_lot-information-container', [
    { elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-toggled' }
  ]);
  
  setupRemove(map, [
    { elementSelector: '.parking_lot-information-container', 
    css: ['parking_lot-information-container-toggled', 'parking_lot-information-container-appear'] }
  ]);
//   -------------------------------------------------------------------------------------------

let bookingLocationData;
let lastClickedButton = '';

buttonBooking = document.querySelector('#button-parking-booking')
buttonReservation = document.querySelector('#button-parking-reservation')
carBoardCheckedButton = document.querySelector('#car-board-checked-button')

buttonReservation.addEventListener('click', async function() {
    lastClickedButton = 'reservation';
    let isTokenChecked = await loggingCheck();
    if (!isTokenChecked) {
        return; 
    };
    let isMemberStatusChecked = await memberStatus();
    if (!isMemberStatusChecked) {
        return; 
    };
    let isSquareChecked = await squareChecking();
    if (!isSquareChecked) {
        return; 
    };
    await returnCarBoardData();
    toggleClass('#packing-page-container', 'packing-page-container-toggled');
    toggleClass('#packing-page-black-back', 'black-back-toggled');  
    toggleClass('#packing-page-information-none', 'packing-page-information-none-toggled'); 
    toggleClass('#packing-page-car-board-selected', 'packing-page-car-board-selected-toggled');
});

buttonBooking.addEventListener('click', async function() {
    lastClickedButton = 'booking';
    let isTokenChecked = await loggingCheck();
    if (!isTokenChecked) {
        return; 
    };
    let isMemberStatusChecked = await memberStatus();
    if (!isMemberStatusChecked) {
        return; 
    };
    let isSquareChecked = await squareChecking();
    if (!isSquareChecked) {
        return; 
    };
    await returnCarBoardData();
    toggleClass('#packing-page-container', 'packing-page-container-toggled');
    toggleClass('#packing-page-black-back', 'black-back-toggled');  
    toggleClass('#packing-page-information-none', 'packing-page-information-none-toggled'); 
    toggleClass('#packing-page-car-board-selected', 'packing-page-car-board-selected-toggled');
});

carBoardCheckedButton.addEventListener('click', async function() {
    let isSquareChecked = await carBoardChecking();
    if (!isSquareChecked) {
        return; 
    };
    toggleClass('#packing-page-car-board-selected', 'packing-page-car-board-selected-toggled');
    let squareNumber = document.getElementById('data-type-selector').value
    let carBoardSelected = document.getElementById('car-board-number-selector').value
    let bookingData = bookingLocationData; // return data get
    let bookingTime = await getCurrentDateTime();
    console.log(bookingData)
    // console.log(bookingTime)
    await passBookingData(bookingData, bookingTime, carBoardSelected, squareNumber); 
    await returnBookingData()
    await fetchData()
    // toggleClass('#packing-page-information-none', 'packing-page-information-none-toggled'); 
    // toggleClass('#packing-page-car-board-selected', 'packing-page-car-board-selected-toggled');
    startTimer(updateTimerDisplay);   
});

async function squareChecking(){
    let selector = document.getElementById('data-type-selector');
    // 檢查選擇器是否有值
    if (selector.value === "") {
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '請選擇車位編號';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false; // 終止其他函式執行
    }
    return true; // 繼續執行其他函式
};

async function carBoardChecking(){
    let selector = document.getElementById('car-board-number-selector');
    // 檢查選擇器是否有值
    if (selector.value === "") {
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '請選擇車牌';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false; 
    }
    return true; 
};

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
        renderParkingPage(data)
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

async function passBookingData(bookingData, bookingTime, carBoardSelected, squareNumber){
    try{
        const response = await inputBookingDataToDB(bookingData, bookingTime ,carBoardSelected, squareNumber);
        const data = await handleResponse(response);
        console.log(data);
        // await fetchData();
    }catch(error){
        handleError(error);
    }
}

async function inputBookingDataToDB(bookingData, bookingTime ,carBoardSelected, squareNumber){
    const token = localStorage.getItem('Token');
    const bookingInformationData = {
        bookingData: bookingData,
        bookingTime: bookingTime,
        carBoardSelected: carBoardSelected,
        squareNumber: squareNumber
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
    document.querySelector('#parking-lot-holder-phone').textContent = '連絡電話:'+locationData.cellphone || '連絡電話:'+'無';
    let squaresWithEmptyStatus = locationData.squares ? locationData.squares.filter(square => !square.status).length : 0;
    let totalSquares = locationData.squares ? locationData.squares.length : 0;
    document.querySelector('#parking-space-total-number').textContent = `${squaresWithEmptyStatus} / ${totalSquares} 位`;    
    
    // const parkingLotImageElement = document.querySelector('#parking-lot-image');
    // if (locationData.images && locationData.images[0]) {
    //     parkingLotImageElement.src = locationData.images[0];
    // } else {
    //     parkingLotImageElement.src = ''; // 預設圖片
    // };
    
    let select = document.getElementById('data-type-selector');
    const defaultOption = select.querySelector('option[value=""][disabled]');
    select.innerHTML = '';
    select.appendChild(defaultOption.cloneNode(true));

    locationData.squares.forEach(function(square) {
        if (square.status === null) {
            // 是否存在相同選項
            let exists = Array.from(select.options).some(function(option) {
                return option.textContent === square.square_number;
            });
            if (!exists) {
                let option = document.createElement('option');
                option.textContent = square.square_number;
                select.appendChild(option);
            }
        }
    });
    updateParkingAvailability(locationData)
    rotationImg(locationData)
};

function updateParkingAvailability(locationData) {
    const allOccupied = locationData.squares.every(square => square.status !== null);

    const buttonContainer = document.querySelector('.button-container');

    if (allOccupied) {
        buttonContainer.innerHTML = '<p class="full-capacity-message">目前客滿</p>';
    }
}

//輪播圖
function rotationImg(data) {
    console.log(data)
    let buttonRight = document.getElementById("button-img-right");
    let buttonLeft = document.getElementById("button-img-left");
    let currentImageIndex = 0;
    let imageDiv = document.querySelector('#parking-lot-image');
    let imageURL = data.images;
    let potContainer = document.querySelector(".pot_container");

    for (let i = 0; i < imageURL.length; i++) {
        let pot = document.createElement("div");
        pot.classList.add("pot")
        
        let img = document.createElement("img");
        img.src = imageURL[i];
        imageDiv.appendChild(img);
    
        potContainer.appendChild(pot)
    }

    let pot = document.querySelectorAll(".pot")
    let images = imageDiv.querySelectorAll('.image');
    let potpot = document.createElement("div");
    let potpotlength = 0
    potpot.classList.add("potpot")
    pot[potpotlength].appendChild(potpot)
    
    buttonRight.onclick = function () {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            potpotlength++;
            pot[potpotlength].appendChild(potpot);
        } else {
            currentImageIndex = 0; // return first
            potpotlength = 0;
            pot[potpotlength].appendChild(potpot);
        }
        imageDiv.scrollLeft = images[currentImageIndex].offsetLeft;
    };

    buttonLeft.onclick = function () {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            potpotlength--;
            pot[potpotlength].appendChild(potpot);
        } else {
            currentImageIndex = images.length - 1; // last pic
            potpotlength = pot.length - 1;
            pot[potpotlength].appendChild(potpot);
        }
        imageDiv.scrollLeft = images[currentImageIndex].offsetLeft;
    };    
}

function renderParkingPage(data){
    if (data.data == '目前尚無停車資訊'){
        return
    }
    let element = document.querySelector('.packing-page-information-none');
    element.style.display = 'none'
    // toggleClass('#packing-page-information-none', 'packing-page-information-none-toggled'); 
    toggleClass('#packing-page-information', 'packing-page-information-toggled'); 
    document.querySelector('#packing-page-parking-lot-id').textContent = data.data[0].id;
    document.querySelector('#packing-page-parking-lot-name').textContent = data.data[0].parkinglotname;
    document.querySelector('#packing-page-parking-lot-address').textContent = data.data[0].address;
    document.querySelector('#packing-page-parking-lot-space-number').textContent = data.data[0].square_number;
    document.querySelector('#packing-page-parking-lot-price').textContent = data.data[0].price;
    document.querySelector('#packing-page-parking-lot-start-time').textContent = data.data[0].starttime;
};

async function returnCarBoardData(){
    try{
        const response = await getCarBoardData();
        const data = await handleResponse(response);
        console.log(data);
        await carBoardNumberToSelector(data);
        return data;
    }catch(error){
        handleError(error);
    }
}

async function carBoardNumberToSelector(data){
    let select = document.getElementById('car-board-number-selector');

    data.data.forEach(function(item) {
        let exists = Array.from(select.options).some(function(option) {
            return option.textContent === item.carboard_unmber;
        });
        if (!exists) {
            let option = document.createElement('option');
            option.textContent = item.carboard_unmber; 
            select.appendChild(option);
        }
    });
}

async function getCarBoardData(){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/input_car_board_data", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
  }
  