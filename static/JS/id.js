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

//id
setupToggle('#id_page_edit-button', [
  { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
  { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
]);

setupToggle('#close-information', [
  { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
  { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
]);

//plate_board
// setupToggle('#plate-board-edit-button', [
//   { elementSelector: '#plate-board-container-header', classToToggle: 'plate-board-container-header-toggled' },
//   { elementSelector: '#plate-board-information', classToToggle: 'plate-board-information-toggled' }
// ]);


fetchIdPageData();
async function fetchIdPageData(){
    try{
        const response = await getIdPageData();
        const data = await handleResponse(response);
        console.log(data);
        idDataInTableAndInput(data);
    }catch(error){
        await handleError(error);
    }
}

async function getIdPageData(){
  const token = localStorage.getItem('Token');
    const response = await fetch("/api/get_id_page_data", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
      }
    });
    return response;
}

// async function handleResponse(response) {
//     if (!response.ok) {
//         throw new Error('Get null from backend');
//     }
//     return response.json();
// }

// async function handleError(error) {
//     console.error('Backend could got problems', error);
// }

async function idDataInTableAndInput(data){
  document.querySelector('#id_page_id_number').textContent = data.data.id || '無';
  document.querySelector('#id_page_account').textContent = data.data.account || '無';
  document.querySelector('#id_page_name').textContent = data.data.name || '無';
  document.querySelector('#id_page_e-mail').textContent = data.data.email || '無';
  document.querySelector('#id_page_birthday').textContent = data.data.birthday || '無';
  document.querySelector('#id_page_phone').textContent = data.data.cellphone || '無';
  document.querySelector('#name-information').textContent = data.data.name || '';
  document.querySelector('#email-information').textContent = data.data.email || '';
  document.querySelector('#birthday-information').textContent = data.data.birthday || '';
  document.querySelector('#callPhone-information').textContent = data.data.cellphone || '';
}

const idPageStorageButton = document.querySelector('#id_page_storage-button');

idPageStorageButton.addEventListener('click', InputIdPageData);

async function InputIdPageData(){
  try{
      const response = await inputIdDataToDB();
      const data = await handleResponse(response);
      console.log(data);
      idEditMessage(data)
  }catch(error){
      await handleError(error);
  }
}

async function inputIdDataToDB(){
  const token = localStorage.getItem('Token');
  let idData  = await GetIdDataInInput();
  // 檢查 idData 是否為 null 或空對象
  if (!idData || Object.keys(idData).length === 0) {
      return;
  }
  const response = await fetch("/api/input_id_page_data", {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(idData ), 
  });
  return response;
}

async function GetIdDataInInput() {
  let name = document.querySelector('#name-information').value;
  let email = document.querySelector('#email-information').value;
  let birthday = document.querySelector('#birthday-information').value;
  let cellphone = document.querySelector('#callPhone-information').value;
  let password = document.querySelector('#password-information').value;
  if (!name && !email && !birthday && !cellphone && !password) {
    let messageContainer = document.querySelector('#id-edit-success-message');
    messageContainer.textContent = '請輸入編輯資料!';
    return null; // 或者返回一個特定的值表示沒有數據
  }
  return {
    name: name,
    email: email,
    birthday: birthday,
    cellphone: cellphone,
    password: password
  };
}

function idEditMessage(data){
  let messageContainer = document.querySelector('#id-edit-success-message')
  
  if (data.ok){
      messageContainer.textContent = '編輯成功!';
      window.location.href = '/id'
  }
};