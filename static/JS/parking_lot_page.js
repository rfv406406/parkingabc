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
    <input type="text" id="parking-lot-number-input${inputCount}" name="parkingLotNumber${inputCount}" class="text" placeholder="請輸入車牌編號">`;
    newInputBoxImage.innerHTML = 
    `<label for="parking-square-image${inputCount}" class="consistent-text">車位圖片${inputCount}：</label>
    <input type="file" id="parking-square-image-input${inputCount}" name="parkingSquareImage${inputCount}" class="text" multiple>`;
    inputCarSpaceContainer.appendChild(newInputBoxNumber);
    inputCarSpaceContainer.appendChild(newInputBoxImage);
}  

// 匯入停車場資訊
const dataStorage = document.querySelector('#parking-lot-information-container-storage-button')
dataStorage.addEventListener('click', passData)

async function getParkingLotInformation(){
    let name = document.querySelector('#parking-lot-name-input').value;
    let address = document.querySelector('#parking-lot-address-input').value;
    let nearLandmark = document.querySelector('#parking-lot-near-input').value;
    let img = document.querySelector('#parking-lot-image-input')
    let openingTimeAm = document.querySelector('#parking-lot-opening-time-am-input').value;
    let openingTimePm = document.querySelector('#parking-lot-closing-time-pm-input').value;
    let space = document.querySelector('#parking-lot-in-out-input').value;
    let price = document.querySelector('#parking-lot-price-input').value;
    let carWidth = document.querySelector('#parking-lot-width-input').value;
    let carHeight = document.querySelector('#parking-lot-height-input').value;

    return {
        name: name,
        address: address,
        nearLandmark: nearLandmark,
        img: img.files, // 如果是多文件，則用 img.files
        openingTimeAm: openingTimeAm,
        openingTimePm: openingTimePm,
        space: space,
        price: price,
        carWidth: carWidth,
        carHeight: carHeight
    };
};


async function getCarSpaceData() {
    let carSpaceData = [];
    let inputCarSpaceContainer = document.querySelector('#input-car-space-container');
    // 直接获取当前的输入值
    let textInputs = inputCarSpaceContainer.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        carSpaceData.push({ name: input.name, value: input.value });
    });

    let fileInputs = inputCarSpaceContainer.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        let files = Array.from(input.files);
        carSpaceData.push({ name: input.name, value: files });
    });
    
    return carSpaceData;
}
    
    
async function passData(event){
    event.preventDefault();
    let parkingLotData = await getParkingLotInformation();
    let carSpaceData = await getCarSpaceData();
    console.log(carSpaceData)
    console.log(parkingLotData)
    let formData = new FormData();

    formData.append('parkingLotData', parkingLotData); 
    formData.append('carSpaceData', carSpaceData);
    // try{
    //     const response = await inputDataToDB(formData);
    //     const data = await handleResponse(response);
    //     console.log(data);
    //     await fetchData();
    // }catch(error){
    //     handleError(error);
    // }
};

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