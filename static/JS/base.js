// 通用函式來切換類
function toggleClass(elementSelector, classToToggle) {
  let element = document.querySelector(elementSelector);
  // console.log("Toggling class on:", elementSelector);
  if (element) {
    element.classList.toggle(classToToggle);
    // console.log("Class after toggle:", element.classList);
  };
};
// 複數通用函式來切換類
function toggleClasses(elementSelector, classToToggle) {
  let elements = document.querySelectorAll(elementSelector);
  elements.forEach(element => {
    element.classList.toggle(classToToggle);
  });
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

// 事件監聽設置的通用函式//排除按鈕
function setupToggleNotButtonElements(element, toggles) {
  document.querySelector(element).addEventListener('click', function(event) {
      // 檢查點擊的目標是否不是按鈕
      if (!event.target.matches('button')&&!event.target.matches('#data-type-selector')) {
        toggles.forEach(function(toggle) {
          toggleClass(toggle.elementSelector, toggle.classToToggle);
        });
      }
  });
}

// 事件監聽設置的通用函式
async function setupAppear(Selector, toggles) {
  Selector.addListener('click',function() {
      toggles.forEach(function(toggle) {
        toggleClass(toggle.elementSelector, toggle.classToToggle);
    });
  });
}

// 事件監聽設置的通用函式
function removeClass(elementSelector, classesToRemove) {
  let element = document.querySelector(elementSelector);
  if (element) {
      classesToRemove.forEach(cssClass => {
          if (element.classList.contains(cssClass)) {
              element.classList.remove(cssClass);
          }
      });
  }
}

// 事件監聽設置的通用函式 //非元件類
function setupRemove(Selector, elementSelectorANDcss) {
  Selector.addListener('click', function() {
    elementSelectorANDcss.forEach(item => {
      removeClass(item.elementSelector, item.css);
  });
});
}

// 事件監聽設置的通用函式 
function setupRemoveButton(Selector, elementSelectorANDcss) {
  let element = document.querySelector(Selector);
  element.addEventListener('click', function() {
    elementSelectorANDcss.forEach(item => {
      removeClass(item.elementSelector, item.css);
  });
});
}

//base
//使用函式來設置事件監聽器
setupToggle('#menu', [
  { elementSelector: '#menuContent', classToToggle: 'menuContent_toggled' }
]);

setupToggle('#signin-button-list', [
  { elementSelector: '#signin-container', classToToggle: 'signin-container-toggled' },
  { elementSelector: '#black-back', classToToggle: 'black-back-toggled' }
]);

setupToggle('#go-signon', [
  { elementSelector: '#signin-container', classToToggle: 'signin-container-toggled' },
  { elementSelector: '#signon-container', classToToggle: 'signup-container-toggled' }
]);

setupToggle('#return-signin', [
  { elementSelector: '#signin-container', classToToggle: 'signin-container-toggled' },
  { elementSelector: '#signon-container', classToToggle: 'signup-container-toggled' }
]);

setupToggle('#close-signin', [
  { elementSelector: '#signin-container', classToToggle: 'signin-container-toggled' },
  { elementSelector: '#black-back', classToToggle: 'black-back-toggled' },
  { elementSelector: '#menuContent', classToToggle: 'menuContent_toggled' }
]);

setupToggle('#close-signon', [
  { elementSelector: '#signon-container', classToToggle: 'signup-container-toggled' },
  { elementSelector: '#black-back', classToToggle: 'black-back-toggled' },
  { elementSelector: '#menuContent', classToToggle: 'menuContent_toggled' }
]);

//turn to parking_lot_page
function turnPage(renderTemplate){
  window.location.href = renderTemplate;
}

function clickButton(buttonSelector, renderTemplate) {
  document.querySelector(buttonSelector).addEventListener('click', function(event) {
    event.preventDefault();
    turnPage(renderTemplate)
  });
};

clickButton('#parking-lot-button-list','/parkinglotpage')
clickButton('#home','/')
clickButton('#selector','/selector')
clickButton('#car_page','/car_page')
clickButton('#id','/id')
clickButton('#deposit-and-pay-page-button','/deposit_and_pay_page')
clickButton('#cash-record-page-button','/cash_flow_record')

//使用者登入狀態確認
async function init(){
  const token = localStorage.getItem('Token');
  // console.log(token)
  if (token == null){
      if (window.location.pathname !== '/') {
          window.location.href = '/';
      }
      toggleClasses('.list', 'list-toggled');
  }else{
      try{
          const response = await submitToken("/api/user/auth", 'GET', token);
          const data = await handleResponse(response);
          let cashPoint = await getMemberStatus();
          showCashPointOnMenu(cashPoint);
          // console.log(data);
          await loginCheck(data)
      }catch(error){
          handleError(error);
      }
  }
}

function showCashPointOnMenu(cashPoint){
  const cashBar = document.getElementById('cash-point')
  cashBar.textContent = '目前點數:'+cashPoint.data[0].Balance+'點';
};

async function submitToken(api, method, token) {
  const response = fetch(api, {
      method: method,
      headers: {
          'Authorization': `Bearer ${token}`,
      }
  });
 return response;
}

//連接後端登入API
async function getMemberStatus() {
  const token = localStorage.getItem('Token');
  try{
      const response = await getMemberDataApi("/api/get_member_data", "GET", token);
      const data = await handleResponse(response);
      console.log(data)
      return data
  }catch(error){
      handleError(error);
  }
}
//送出表單到後端
async function getMemberDataApi(api, method, token) {
  const response = fetch(api, {
      method: method,
      headers: {
          'Authorization': `Bearer ${token}`,
      }
  });
 return response;
}

//確認登入狀態後之事件處理
async function loginCheck(data){
  let signOutButtonList = document.querySelector('#signout-button-list');
  // console.log(data);
  if (data !== null) {
      console.log(data);   
      signOutButtonList.addEventListener('click', logout);
      toggleClass('#signin-button-list', 'list-sign-in-toggled');
      toggleClass('#signout-button-list', 'list-sign-out-toggled'); 
  } else {
      logout();
  }
}
//登出
function logout() {
  localStorage.removeItem('Token');
  if(window.location.pathname !== '/') {
      window.location.href = '/'; 
  } else {
      location.reload(); 
  }
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
//F5
window.addEventListener('load', init);

//註冊後車牌頁面導向
document.addEventListener('DOMContentLoaded', function() {
  if (document.cookie.includes('registrationCompleted=true')) {
      const alertContent = document.getElementById("alert-content")
      alertContent.textContent = '請先前往"你的車車"頁面，登入至少一個車牌才可以使用停車服務喔!';
      toggleClass('#alert-page-container', 'alert-page-container-toggled');
      toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
      document.cookie = 'registrationCompleted=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
});