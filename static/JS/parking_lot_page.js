//文件的內容
let inputCount = 1;
const addButton = document.getElementById('add-button')

addButton.addEventListener('click', addInputField);

function addInputField() {
    inputCount++;
    const inputBoxContainer = document.getElementById('input-box-container');
    const newInputBox = document.createElement('div');
    newInputBox.className = 'input-box';
    newInputBox.innerHTML = `<label for="parking-lot-number${inputCount}" class="consistent-text">車位編號${inputCount}：</label>
                             <input type="text" id="parking-lot-number${inputCount}" name="parking-lot-number" class="text" placeholder="請輸入車牌編號">`;
    inputBoxContainer.appendChild(newInputBox);
}  