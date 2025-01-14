initCarPage();
let memberCarData;
async function initCarPage(){
  const token = localStorage.getItem('Token');
  try{
      const getCarBoardData = await fetchAPI("/api/input_car_board_data", token, "GET");
      const data = await handleResponse(getCarBoardData);
      memberCarData = data;
      addCarInDiv(data)
    }catch(error){
      handleError(error);
    }
}

  // 匯入車牌資訊
const carBoardDataStorage = document.querySelector('#plate-board-data-submit')
carBoardDataStorage.addEventListener('click', async (event) => {
  event.preventDefault();
  let formData = await packingCarBoardData(); 
  await passCarBoardData(formData); 
  initCarPage();
});

//刪除停車場資料
document.querySelector('#parking-lot-container').addEventListener('click', async (event) => {
  if (event.target.matches('.parking-lot-delete-button')) {
      event.preventDefault();
      let carTable = event.target.closest('.parking-lot-page-table');

      if (carTable) {
          try{
            const cartBoardNumber = carTable.querySelector('.parking-lot-information-page-go-button').textContent;
            const carData = memberCarData.data.find(lot => lot.carboard_number === cartBoardNumber); 
            const response = await deleteCarData(carData);
            const data = await handleResponse(response);
            initCarPage();
          }catch(error){
            handleError(error);
          }
      }
  }
});

function getCarBoardInformation(){
  let boardNumber = document.querySelector('#plate-board-number').value;
  if(boardNumber == ''){
    let message = document.querySelector('#car-page-message')
    message.textContent = '請輸入車牌'
    return null;
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
  let carBoardData = getCarBoardInformation();

  let formData = new FormData();

  formData.append('boardNumber', carBoardData.boardNumber);

  if (carBoardData.img && carBoardData.img.length > 0) {
      for (let i = 0; i < carBoardData.img.length; i++) {
          formData.append('img', carBoardData.img[i]);
      }
  } else {
      formData.append('img', '');
  }

  return formData
};

async function passCarBoardData(formData){
  try{
      const response = await inputCarBoardDataToDB(formData);
      const data = await handleResponse(response);
      // await fetchData();
  }catch(error){
      handleError(error);
  }
}

async function inputCarBoardDataToDB(formData){
  const token = localStorage.getItem('Token');
  const response = await fetchAPI("/api/input_car_board_data", token, 'POST', formData)
  return response;
}

function addCarInDiv(data) {
  const container = document.querySelector('#parking-lot-container'); 
  container.innerHTML = ''; 
  if(data.data.length == 0){
      container.textContent = '目前無登記的車牌';
      return null;
  }

  data.data.forEach(item => {
      const parkingLotDiv = document.createElement('div');
      parkingLotDiv.className = 'parking-lot-page-table';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'parking-lot-information-page-go-button';
      nameDiv.textContent = item.carboard_number;
      parkingLotDiv.appendChild(nameDiv);

      const imageDiv = document.createElement('div');
      imageDiv.className = 'image';
      const img = document.createElement('img');
      img.src = item.images && item.images.length > 0 ? item.images[0] : '../static/IMAGE/noimage.png';
      imageDiv.appendChild(img);
      parkingLotDiv.appendChild(imageDiv);

      // 創建初始隱藏的刪除紐
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'parking-lot-delete-button';
      deleteButton.textContent = '刪除';
      deleteButton.style.display = 'none'; // 一開始隱藏
      parkingLotDiv.appendChild(deleteButton);

      // 點擊 parking-lot-page-table 切換刪除按鈕成顯示
      parkingLotDiv.addEventListener('click', () => {
          if(deleteButton.style.display === "none") {
            deleteButton.style.display === 'block';
          }else{
            deleteButton.style.display === 'none';
          } 
      });

      container.appendChild(parkingLotDiv);

      const separator = document.createElement('div');
      separator.className = 'separator';
      container.appendChild(separator);
  });
}

async function deleteCarData(data){
  const token = localStorage.getItem('Token');
  const response = await fetchAPI("/api/input_car_board_data", token, 'DELETE', data)
  return response;
}