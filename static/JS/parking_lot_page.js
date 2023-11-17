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
  
  
  setupToggle('#parking-lot-information-page-go-button', [
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' },
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
  ]);
  
  setupToggle('#parking-lot-information-page-close', [
    { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' },
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
  ]);
  
  setupToggle('#parking-lot-square-page-go-button', [
    { elementSelector: '#parking-lot-square-page', classToToggle: 'parking-lot-square-page-toggled' },
    { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
  ]);
  
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
    `<label for="parking-lot-number${inputCount}" class="consistent-text">車位編號${inputCount}：</label>
    <input type="text" id="parking-lot-number-input${inputCount}" name="parkingSquareNumber${inputCount}" class="text" placeholder="請輸入車牌編號">`;
    newInputBoxImage.innerHTML = 
    `<label for="parking-square-image${inputCount}" class="consistent-text">車位圖片${inputCount}：</label>
    <input type="file" id="parking-square-image-input${inputCount}" name="parkingSquareImage${inputCount}" class="text" multiple>`;
    inputCarSpaceContainer.appendChild(newInputBoxNumber);
    inputCarSpaceContainer.appendChild(newInputBoxImage);
}  

// 匯入停車場資訊
const dataStorage = document.querySelector('#parking-lot-information-container-storage-button')
dataStorage.addEventListener('click', async function() {
    let formData = await packingData(); // 等待 packingData 函数完成并获取其返回值
    await passData(formData); // 将 formData 传递给 passData 函数并等待其执行完成
});

async function getParkingLotInformation(){
    let name = document.querySelector('#parking-lot-name-input').value;
    let address = document.querySelector('#parking-lot-address-input').value;
    let nearLandmark = document.querySelector('#parking-lot-near-input').value;
    
    let imgArray = [];
    let img = document.querySelector('#parking-lot-image-input').files
// 将文件添加到数组中
    for (let i = 0; i < img.length; i++) {
    imgArray.push(img[i]);
    }
    
    let openingTimeAm = document.querySelector('#parking-lot-opening-time-am-input').value;
    let openingTimePm = document.querySelector('#parking-lot-closing-time-pm-input').value;
    let space = document.querySelector('#parking-lot-in-out-input').value;
    let price = document.querySelector('#parking-lot-price-input').value;
    let carWidth = document.querySelector('#parking-lot-width-input').value;
    let carHeight = document.querySelector('#parking-lot-height-input').value;
   
    let location = await getLatLonFromAddress(address)

    return {
        name: name,
        address: address,
        nearLandmark: nearLandmark,
        img: imgArray, // 如果是多文件，則用 img.files
        openingTimeAm: openingTimeAm,
        openingTimePm: openingTimePm,
        space: space,
        price: price,
        carWidth: carWidth,
        carHeight: carHeight,
        Latitude: location ? location.lat : "", // 如果无法获取则显示空值
        Longitude: location ? location.lng : "" // 如果无法获取则显示空值
    }
};

async function getLatLonFromAddress(address) {
    const apiKey = 'AIzaSyCiz02ZEX650VEundSMH87J_fHaDtmMQP8'; // 替换为您的 Google Maps API 密钥
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return location; // { lat: 纬度, lng: 经度 }
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

    // 初始化存储结构
    let organizedData = {
        carSpaceNumber: [],
        carSpaceImage: []
    };

    // 获取并处理文本输入
    let textInputs = inputCarSpaceContainer.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        organizedData.carSpaceNumber.push({ name: input.name, value: input.value });
    });

    // 获取并处理文件输入
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
    let carSpaceData = await getCarSpaceData();
    // console.log(carSpaceData)
    console.log(parkingLotData)
    let formData = new FormData();

    formData.append('name', parkingLotData.name);
    formData.append('address', parkingLotData.address);
    formData.append('nearLandmark', parkingLotData.nearLandmark);
    formData.append('openingTimeAm', parkingLotData.openingTimeAm);
    formData.append('openingTimePm', parkingLotData.openingTimePm);
    formData.append('space', parkingLotData.space);
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
        // 当数组为空时，添加一个空字符串或 null 作为代替值
        formData.append('img', '');
    }
    
    // 处理 carSpaceData 中的文本字段
    carSpaceData.carSpaceNumber.forEach(item => {
        formData.append(item.name, item.value);
    });

    // 处理 carSpaceData 中的文件
    carSpaceData.carSpaceImage.forEach(item => {
        if (item.value.length > 0) {
            item.value.forEach(file => {
                formData.append(item.name, file);
            });
        } else {
            // 如果没有文件，则添加空值
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
        const response = await inputDataToDB(formData);
        const data = await handleResponse(response);
        console.log(data);
        // await fetchData();
    }catch(error){
        handleError(error);
    }
}

async function inputDataToDB(formData){
    const response = await fetch("/api/input_parking_lot_information", {
        method: 'POST',
        body: formData,
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

// function parkingLotInformationTable(){
//     let parkingLotName = document.querySelector('#parking-lot-name').textContent;
//     let parkingLotAddress = document.querySelector('#parking-lot-address').textContent;
//     let parkingLotNearLandmark = document.querySelector('#parking-lot-near-landmark').textContent;
//     let parkingLotOpeningTime = document.querySelector('#parking-lot-opening-time').textContent;
//     let parkingLotInOut = document.querySelector('#parking-lot-in-out').textContent;
//     let parkingLotPrice = document.querySelector('#parking-lot-price').textContent;
//     let parkingLotWidth = document.querySelector('#parking-lot-width').textContent;
//     let parkingLotHeight = document.querySelector('#parking-lot-height').textContent;
//     let parkingSpaceTotalNumber = document.querySelector('#parking-space-total-number').textContent;
//     let parkingLotSquarePageGoButton = document.querySelector('#parking-lot-square-page-go-button').textContent;
// };