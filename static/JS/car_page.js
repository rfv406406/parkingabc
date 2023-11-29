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

async function initCarPage(){
    try{
        const response = await getCarBoardData();
        const data = await handleResponse(response);
        console.log(data);
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
});

async function getCarBoardInformation(){
  let boardNumber = document.querySelector('#plate-board-number').value;
  
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