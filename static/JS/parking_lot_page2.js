fetchMemberParkingLotPData();
async function fetchMemberParkingLotPData(){
    try{
        const response = await getMemberParkingLotData();
        const data = await handleResponse(response);
        memberParkingLotData = data;
        console.log(memberParkingLotData);
        addParkingLotInDiv(data)
    }catch(error){
        await handleError(error);
    }
}

async function getMemberParkingLotData(){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/edit_input_parking_lot_information", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
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

function addParkingLotInDiv(data) {
    const container = document.getElementById('parking-lot-container'); 
    container.innerHTML = ''; 
    if(data.data.length == 0){
        container.textContent = '目前無登記的停車場'
    }
    data.data.forEach(item => {
        
        const parkingLotDiv = document.createElement('div');
        parkingLotDiv.className = 'parking-lot-page-table';

        const imageDiv = document.createElement('div');
        imageDiv.className = 'image';
        const img = document.createElement('img');
        img.src = item.images && item.images.length > 0 ? item.images[0] : '../static/IMAGE/noimage.png';
        imageDiv.appendChild(img);
        parkingLotDiv.appendChild(imageDiv);

        const name = document.createElement('div');
        name.className = 'parking-lot-information-page-go-button';
        name.textContent = item.name;
        parkingLotDiv.appendChild(name);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'parking-lot-delete-button';
        deleteButton.textContent = '刪除';
  
        parkingLotDiv.appendChild(deleteButton);

        container.appendChild(parkingLotDiv);

        const separator = document.createElement('div');
        separator.className = 'separator';
        container.appendChild(separator);
    });
}

document.getElementById('parking-lot-container').addEventListener('click', function(event) {
    let parkingLotTable = event.target.closest('.parking-lot-page-table');

    if (parkingLotTable && this.contains(parkingLotTable)) {
        const parkingLotName = parkingLotTable.querySelector('.parking-lot-information-page-go-button').textContent;
        const parkingLotData = memberParkingLotData.data.find(lot => lot.name === parkingLotName);
        
        if (parkingLotData) {
            fillParkingLotData(parkingLotData);
        }
    }
});

function fillParkingLotData(parkingLotData) {
    // 更新表格中的数据
    document.getElementById('parking-lot-id').textContent = parkingLotData.id || '無';
    document.getElementById('parking-lot-name').textContent = parkingLotData.name || '無';
    document.getElementById('parking-lot-address').textContent = parkingLotData.address || '無';
    document.getElementById('parking-lot-near-landmark').textContent = parkingLotData.landmark || '無';
    document.getElementById('parking-lot-opening-time').textContent = parkingLotData.openingTime+'-'+ parkingLotData.closingTime|| '無';
    document.getElementById('parking-lot-in-out').textContent = parkingLotData.spaceInOut || '無';
    document.getElementById('parking-lot-price').textContent = parkingLotData.price ? `${parkingLotData.price}元` : '無';
    document.getElementById('parking-lot-width').textContent = parkingLotData.widthLimit+'m' || '無';
    document.getElementById('parking-lot-height').textContent = parkingLotData.heightLimit+'m' || '無';
    document.getElementById('parking-space-total-number').textContent = parkingLotData.squares.length+'位' || '無';
    let squareNumbers = parkingLotData.squares && parkingLotData.squares.length > 0
    ? parkingLotData.squares.map(square => square.square_number).join("、")
    : '無';
    document.getElementById('parking-lot-square-page-go-button').textContent = squareNumbers;

    document.getElementById('parking-lot-id-input').value = parkingLotData.id || '';
    document.getElementById('parking-lot-name-input').value = parkingLotData.name || '';
    document.getElementById('parking-lot-address-input').value = parkingLotData.address || '';
    document.getElementById('parking-lot-near-input').value = parkingLotData.landmark || '';
  
    document.getElementById('parking-lot-opening-time-am-input').value = parkingLotData.openingTime || '';
    document.getElementById('parking-lot-closing-time-pm-input').value = parkingLotData.closingTime || '';
    
    document.getElementById('parking-lot-in-out-input').value = parkingLotData.spaceInOut || '';
    document.getElementById('parking-lot-price-input').value = parkingLotData.price || '';
    document.getElementById('parking-lot-width-input').value = parkingLotData.widthLimit || '';
    document.getElementById('parking-lot-height-input').value = parkingLotData.heightLimit || '';

    document.getElementById('parking-lot-number-input').value = parkingLotData.spaces && parkingLotData.spaces.length > 0 ? parkingLotData.spaces[0].number : '';
  }