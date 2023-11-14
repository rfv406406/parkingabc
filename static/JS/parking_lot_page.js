//新增車位輸入框
let inputCount = 1;
const addButton = document.getElementById('add-input-car-board-container-button')

addButton.addEventListener('click', addInputField);

function addInputField() {
    inputCount++;
    const inputCarBoardContainer = document.getElementById('input-car-board-container');
    const newInputBoxNumber = document.createElement('div');
    const newInputBoxImage = document.createElement('div');
    newInputBoxNumber.className = 'input-box';
    newInputBoxImage.className = 'input-box';
    newInputBoxNumber.innerHTML = 
    `<label for="parking-lot-number${inputCount}" class="consistent-text">車位編號${inputCount}：</label>
    <input type="text" id="parking-lot-number${inputCount}" name="parkingLotNumber${inputCount}" class="text" placeholder="請輸入車牌編號">`;
    newInputBoxImage.innerHTML = 
    `<label for="parking-square-image${inputCount}" class="consistent-text">車位圖片${inputCount}：</label>
    <input type="file" id="parking-square-image${inputCount}" name="parkingSquareImage${inputCount}" class="text" multiple>`;
    inputCarBoardContainer.appendChild(newInputBoxNumber);
    inputCarBoardContainer.appendChild(newInputBoxImage);
}  

// 匯入停車場資訊
const dataStorage = document.querySelector('#parking-lot-information-container-storage-button')
dataStorage.addEventListener('click', passData)

async function getParkingLotInformation(){
    let name = document.querySelector('#parking-lot-name').value;
    let address = document.querySelector('#parking-lot-address').value;
    let nearLandmark = document.querySelector('#parking-lot-near').value;
    let img = document.querySelector('#parking-lot-image')
    let openingTimeAm = document.querySelector('#parking-lot-opening-time-am').value;
    let openingTimePm = document.querySelector('#parking-lot-opening-time-pm').value;
    let space = document.querySelector('#parking-lot-in-out').value;
    let price = document.querySelector('#parking-lot-price').value;
    let carWidth = document.querySelector('#parking-lot-width').value;
    let carHeight = document.querySelector('#parking-lot-height').value;

    let inputCarSpaceContainer = document.querySelector('#input-car-space-container');
    await getCarBoardData(inputCarSpaceContainer);

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


async function getCarSpaceData(inputCarSpaceContainer) {
    let carSpaceData = [];

    inputCarSpaceContainer.addEventListener('change', function(event) {
        if (event.target.matches('input[type="text"]')) {
            // 处理文本输入
            let inputValue = event.target.value;
            let inputName = event.target.name;
            carSpaceData.push({ name: inputName, value: inputValue });
        } else if (event.target.matches('input[type="file"]')) {
            // 处理文件输入，可能包含多个文件
            let inputName = event.target.name;
            for (let file of event.target.files) {
                carSpaceData.push({ name: inputName, value: file });
            }
        }
    });

    return carBoardData;
}
    
    
async function passData(event){
    event.preventDefault();
    let parkingLotData = await getParkingLotInformation();
    let carSpaceData = await getCarSpaceData();
    
    let formData = new FormData();

    formData.append('parkingLotData', parkingLotData); 
    formData.append('carBoarddata', carSpaceData);
    
    try{
        const response = await inputDataToDB(formData);
        const data = await handleResponse(response);
        console.log(data);
        await fetchData();
    }catch(error){
        handleError(error);
    }
};

async function inputDataToDB(formData){
    const response = await fetch("/api/getmessage", {
        method: 'POST',
        body: formData,
    });
    return response;
}

async function getData(){
    const response = await fetch("/api/getmessage", {
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
