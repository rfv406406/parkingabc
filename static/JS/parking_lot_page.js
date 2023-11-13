//文件的內容
let inputCount = 1;
const addButton = document.getElementById('add-button')

addButton.addEventListener('click', addInputField);

function addInputField() {
    inputCount++;
    const inputBoxContainer = document.getElementById('input-box-container');
    const newInputBoxNumber = document.createElement('div');
    const newInputBoxImage = document.createElement('div');
    newInputBoxNumber.className = 'input-box';
    newInputBoxImage.className = 'input-box';
    newInputBoxNumber.innerHTML = `<label for="parking-lot-number${inputCount}" class="consistent-text">車位編號${inputCount}：</label>
    <input type="text" id="parking-lot-number${inputCount}" name="parking-lot-number" class="text" placeholder="請輸入車牌編號">`;
    newInputBoxImage.innerHTML = `<label for="parking-square-image${inputCount}" class="consistent-text">車位圖片${inputCount}：</label>
    <input type="file" id="parking-square-image${inputCount}" name="parking-square-image-information" class="text" placeholder="車位圖片">`;
    inputBoxContainer.appendChild(newInputBoxNumber);
    inputBoxContainer.appendChild(newInputBoxImage);
}  