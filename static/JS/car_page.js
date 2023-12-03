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

//car_page edit
setupToggle('#plate-board-edit-button', [
    { elementSelector: '#plate-board-container-header', classToToggle: 'plate-board-container-header-toggled' }
  ]);
// ----------------------------------------------------------------------------------
initCarPage();
let memberCarData;
async function initCarPage(){
    try{
        const response = await getCarBoardData();
        const data = await handleResponse(response);
        memberCarData = data;
        addCarInDiv(data)
    }catch(error){
        await handleError(error);
    }
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


  // 匯入車牌資訊
const carBoardDataStorage = document.querySelector('#plate-board-data-submit')
carBoardDataStorage.addEventListener('click', async function(event) {
  event.preventDefault();
  let formData = await packingCarBoardData(); // 等待 packingData 函数完成并获取其返回值
  await passCarBoardData(formData); // 将 formData 传递给 passData 函数并等待其执行完成
  initCarPage();
});

//刪除停車場資料
document.querySelector('#parking-lot-container').addEventListener('click', async function(event) {
  if (event.target.matches('.parking-lot-delete-button')) {
      event.preventDefault();

      let carTable = event.target.closest('.parking-lot-page-table');

      if (carTable) {
          const cartBoardNumber = carTable.querySelector('.parking-lot-information-page-go-button').textContent;
          const carData = memberCarData.data.find(lot => lot.carboard_unmber === cartBoardNumber); 
          console.log(carData)
          try{
              const response = await deleteCarData(carData);
              const data = await handleResponse(response);
              console.log(data)
              initCarPage();
          }catch(error){
              await handleError(error);
          }
      }
  }
});

async function getCarBoardInformation(){
  let boardNumber = document.querySelector('#plate-board-number').value;
  if(boardNumber == ''){
    let message = document.querySelector('#car-page-message')
    message.textContent = '請輸入車牌'
    return
  }
  let carImgArray = [];
  let img = document.querySelector('#car-img-file').files

  for (let i = 0; i < img.length; i++) {
    carImgArray.push(img[i]);
  }
  return {
      boardNumber: boardNumber,
      img: carImgArray, // 如果是多文件，則用 img.files
  }
};

async function packingCarBoardData(){
  let carBoardData = await getCarBoardInformation();

  let formData = new FormData();

  formData.append('boardNumber', carBoardData.boardNumber);

  if (carBoardData.img && carBoardData.img.length > 0) {
      for (let i = 0; i < carBoardData.img.length; i++) {
          formData.append('img', carBoardData.img[i]);
      }
  } else {
      // 当数组为空时，添加一个空字符串或 null 作为代替值
      formData.append('img', '');
  }

  return formData
};

async function passCarBoardData(formData){
  try{
      const response = await inputCarBoardDataToDB(formData);
      const data = await handleResponse(response);
      console.log(data);
      // await fetchData();
  }catch(error){
      handleError(error);
  }
}

async function inputCarBoardDataToDB(formData){
  const token = localStorage.getItem('Token');
  const response = await fetch("/api/input_car_board_data", {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
      body: formData,
  });
  return response;
}

// async function getData(){
//   const response = await fetch("/api/input_parking_lot_information", {
//       method: 'GET',
//   });
//   return response;
// }

async function handleResponse(response) {
  if (!response.ok) {
      throw new Error('Get null from backend');
  }
  return response.json();
}

async function handleError(error) {
  console.error('Backend could got problems', error);
}

function addCarInDiv(data) {
  const container = document.getElementById('parking-lot-container'); 
  container.innerHTML = ''; 
  if(data.data.length == 0){
      container.textContent = '目前無登記的車牌';
      return;
  }

  data.data.forEach(item => {
      const parkingLotDiv = document.createElement('div');
      parkingLotDiv.className = 'parking-lot-page-table';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'parking-lot-information-page-go-button';
      nameDiv.textContent = item.carboard_unmber;
      parkingLotDiv.appendChild(nameDiv);

      const imageDiv = document.createElement('div');
      imageDiv.className = 'image';
      const img = document.createElement('img');
      img.src = item.images && item.images.length > 0 ? item.images[0] : '../static/IMAGE/noimage.png';
      imageDiv.appendChild(img);
      parkingLotDiv.appendChild(imageDiv);

      // 创建初始隐藏的删除按钮
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'parking-lot-delete-button';
      deleteButton.textContent = '刪除';
      deleteButton.style.display = 'none'; // 初始时隐藏
      parkingLotDiv.appendChild(deleteButton);

      // 点击 parking-lot-page-table 时切换删除按钮的显示
      parkingLotDiv.addEventListener('click', function() {
          deleteButton.style.display = deleteButton.style.display === 'none' ? 'block' : 'none';
      });

      container.appendChild(parkingLotDiv);

      const separator = document.createElement('div');
      separator.className = 'separator';
      container.appendChild(separator);
  });
}

async function deleteCarData(data){
  const token = localStorage.getItem('Token');
  const response = await fetch("/api/input_car_board_data", {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data), 
  });
  return response;
}