let memberParkingLotData;

let lastClickedButton = '';

// 通用函式來切換類
function toggleClass(elementSelector, classToToggle) {
    let element = document.querySelector(elementSelector);
    if (element) {
      element.classList.toggle(classToToggle);
    };
  };
  
  // 事件監聽設置的通用函式
  function setupToggle(buttonSelector, toggles) {
    document.querySelector(buttonSelector).addEventListener('click', function(event) {
      event.preventDefault();
      toggles.forEach(function(toggle) {
        toggleClass(toggle.elementSelector, toggle.classToToggle);
      });
    });
  };

  //parking_lot_page
setupToggle('#parking-lot-page-increase', [
    { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
  ]);
  
  
//   setupToggle('#parking-lot-information-page-go-button', [
//     { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' },
//     { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
//   ]);
  
  setupToggle('#parking-lot-information-page-close', [
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' },
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
  ]);
  
//   setupToggle('#parking-lot-square-page-go-button', [
//     { elementSelector: '#parking-lot-square-page', classToToggle: 'parking-lot-square-page-toggled' },
//     { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
//   ]);
  
  setupToggle('#parking-lot-information-page-edit-button', [
    { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
  ]);
  
  setupToggle('#parking-lot-square-page-close', [
    { elementSelector: '#parking-lot-square-page', classToToggle: 'parking-lot-square-page-toggled' },
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
  ]);
  
  setupToggle('#parking-lot-information-container-close', [
    { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
  ]);

function setupToggleEventDelegation(parentSelector, buttonSelector, toggles) {
    document.querySelector(parentSelector).addEventListener('click', function(event) {
        if (!event.target.matches(buttonSelector) && !event.target.closest(buttonSelector)) {
            event.preventDefault();
            toggles.forEach(function(toggle) {
                toggleClass(toggle.elementSelector, toggle.classToToggle);
            });
        }
    });
}

setupToggleEventDelegation('#parking-lot-container', '.parking-lot-information-page-go-button, .parking-lot-delete-button', [
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' },
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
]);
// ------------------------------------------------------------------------------------------------
document.getElementById('parking-lot-information-page-edit-button').addEventListener('click', function() {
    lastClickedButton = 'edit';
});
document.getElementById('parking-lot-page-increase').addEventListener('click', function() {
    lastClickedButton = 'storage';
});
// ------------------------------------------------------------------------------------------------
//新增車位輸入框
let inputCount = 1;
const addButton = document.getElementById('add-input-car-space-container-button')

addButton.addEventListener('click', addInputField);

function addInputField() {
    inputCount++;
    const inputCarSpaceContainer = document.getElementById('input-car-space-container');
    const newInputBoxNumber = document.createElement('div');
    const newInputBoxImage = document.createElement('div');
    newInputBoxNumber.className = 'input-box';
    newInputBoxImage.className = 'input-box';
    newInputBoxNumber.innerHTML = 
    `<label for="parking-lot-number${inputCount}" class="consistent-text">*車位編號${inputCount}：</label>
    <input type="text" id="parking-lot-number-input${inputCount}" name="parkingSquareNumber${inputCount}" class="text" placeholder="請輸入車牌編號">`;
    newInputBoxImage.innerHTML = 
    `<label style="display:none" for="parking-square-image${inputCount}" class="consistent-text">車位圖片${inputCount}：</label>
    <input style="display:none" type="file" id="parking-square-image-input${inputCount}" name="parkingSquareImage${inputCount}" class="text" multiple>`;
    // 隐藏 newInputBoxNumber
    newInputBoxImage.style.display = 'none';
    inputCarSpaceContainer.appendChild(newInputBoxNumber);
    inputCarSpaceContainer.appendChild(newInputBoxImage);
}  
//刪除停車場資料
document.querySelector('#parking-lot-container').addEventListener('click', async function(event) {
    if (event.target.matches('.parking-lot-delete-button')) {
        event.preventDefault();

        let parkingLotTable = event.target.closest('.parking-lot-page-table');

        if (parkingLotTable) {
            const parkingLotName = parkingLotTable.querySelector('.parking-lot-information-page-go-button').textContent;
            const parkingLotData = memberParkingLotData.data.find(lot => lot.name === parkingLotName); 
            console.log(parkingLotData)
            try{
                const response = await deleteData(parkingLotData);
                const data = await handleResponse(response);
                console.log(data)
                fetchMemberParkingLotPData()
            }catch(error){
                await handleError(error);
            }
        }
    }
});
// 匯入停車場資訊
const dataStorage = document.querySelector('#parking-lot-information-container-storage-button')
dataStorage.addEventListener('click', async function() {
    let formData = await packingData(); // 等待 packingData 函数完成并获取其返回值
    if (!formData) {
        const parkingLotStorageSuccessMessage = document.querySelector('#parking-lot-storage-success-message')
        parkingLotStorageSuccessMessage.textContent = '*號欄位為必填項目'
        return; // 如果 carSpaceData 为空，中断函数
    }
    await passData(formData); // 将 formData 传递给 passData 函数并等待其执行完成
});

async function getParkingLotInformation(){
    let id = document.querySelector('#parking-lot-id-input').value;
    let name = document.querySelector('#parking-lot-name-input').value;
    let address = document.querySelector('#parking-lot-address-input').value;
    let nearLandmark = document.querySelector('#parking-lot-near-input').value;
    
    let imgArray = [];
    let img = document.querySelector('#parking-lot-image-input').files

    for (let i = 0; i < img.length; i++) {
    imgArray.push(img[i]);
    }
    
    let openingTimeAm = document.querySelector('#parking-lot-opening-time-am-input').value;
    let openingTimePm = document.querySelector('#parking-lot-closing-time-pm-input').value;
    let spaceInOut = document.querySelector('#parking-lot-in-out-input').value;
    let price = document.querySelector('#parking-lot-price-input').value;
    let carWidth = document.querySelector('#parking-lot-width-input').value;
    let carHeight = document.querySelector('#parking-lot-height-input').value;

    if (!name || !address || imgArray.length === 0 || !openingTimeAm || !openingTimePm || !price || !carWidth || !carHeight) {
        return;
    }
    let location = await getLatLonFromAddress(address)

    return {
        id: id,
        name: name,
        address: address,
        nearLandmark: nearLandmark,
        img: imgArray, 
        openingTimeAm: openingTimeAm,
        openingTimePm: openingTimePm,
        spaceInOut: spaceInOut,
        price: price,
        carWidth: carWidth,
        carHeight: carHeight,
        Latitude: location ? location.lat : "", 
        Longitude: location ? location.lng : "" 
    }
};

async function getLatLonFromAddress(address) {
    const apiKey = 'AIzaSyCiz02ZEX650VEundSMH87J_fHaDtmMQP8'; 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return location; // { lat, lng }
        } else {
            console.error('Geocoding failed:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        return null;
    }
}

async function getCarSpaceData() {
    let inputCarSpaceContainer = document.querySelector('#input-car-space-container');

    // 初始化儲存DS
    let organizedData = {
        carSpaceNumber: [],
        carSpaceImage: []
    };
    let isEmptyInputFound = false;
    // 獲取並輸入文本
    let textInputs = inputCarSpaceContainer.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        if (input.value.trim() === "") {
            isEmptyInputFound = true; // 空值輸入
            return;
        }
        organizedData.carSpaceNumber.push({ name: input.name, value: input.value });
    });

    if (isEmptyInputFound) return null; 

    let fileInputs = inputCarSpaceContainer.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        let files = Array.from(input.files);
        organizedData.carSpaceImage.push({ name: input.name, value: files });
    });
    
    return organizedData;
}
    

async function packingData(event){
    // event.preventDefault();
    let parkingLotData = await getParkingLotInformation();
    if (!parkingLotData) {
        return; 
    }
    let carSpaceData = await getCarSpaceData();
    if (!carSpaceData) {
        return; 
    }
    // console.log(carSpaceData)
    console.log(parkingLotData)
    let formData = new FormData();

    formData.append('id', parkingLotData.id);
    formData.append('name', parkingLotData.name);
    formData.append('address', parkingLotData.address);
    formData.append('nearLandmark', parkingLotData.nearLandmark);
    formData.append('openingTimeAm', parkingLotData.openingTimeAm);
    formData.append('openingTimePm', parkingLotData.openingTimePm);
    formData.append('spaceInOut', parkingLotData.spaceInOut);
    formData.append('price', parkingLotData.price);
    formData.append('carWidth', parkingLotData.carWidth);
    formData.append('carHeight', parkingLotData.carHeight);
    formData.append('Latitude', parkingLotData.Latitude);
    formData.append('Longitude', parkingLotData.Longitude);

    if (parkingLotData.img && parkingLotData.img.length > 0) {
        for (let i = 0; i < parkingLotData.img.length; i++) {
            formData.append('img', parkingLotData.img[i]);
        }
    } else {
        formData.append('img', '');
    }
    
    carSpaceData.carSpaceNumber.forEach(item => {
        formData.append(item.name, item.value);
    });

    carSpaceData.carSpaceImage.forEach(item => {
        if (item.value.length > 0) {
            item.value.forEach(file => {
                formData.append(item.name, file);
            });
        } else {
            formData.append(item.name, '');
        }
    });

    return formData
};

async function displayFormData(formData) {
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
}

async function passData(){
    let formData = await packingData();
    await displayFormData(formData) 
    try{
        let response;

        if (lastClickedButton === 'storage') {
            response = await inputDataToDB(formData);
        } else if (lastClickedButton === 'edit') {
            response = await inputEditDataToDB(formData);
        }

        const data = await handleResponse(response);    
        if (data.ok){
            const parkingLotStorageSuccessMessage = document.querySelector('#parking-lot-storage-success-message')
            parkingLotStorageSuccessMessage.textContent = '儲存成功!';
            location.reload();
        }
    }catch(error){
        handleError(error);
    }
}

async function inputDataToDB(formData){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/input_parking_lot_information", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    return response;
}

async function inputEditDataToDB(formData){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/edit_input_parking_lot_information", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    return response;
}

async function deleteData(data){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/edit_input_parking_lot_information", {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data), 
    });
    return response;
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

// async function getMemberParkingLotData(){
//     const response = await fetch("/api/edit_input_parking_lot_information", {
//         method: 'GET',
//     });
//     return response;
// }

