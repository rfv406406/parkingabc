// 通用函式來切換類
function toggleClass(elementSelector, classToToggle) {
  let element = document.querySelector(elementSelector);
  console.log("Toggling class on:", elementSelector);
  if (element) {
    element.classList.toggle(classToToggle);
    console.log("Class after toggle:", element.classList);
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


//parking_lot-information-container go up顯示
setupToggleNotButtonElements('.parking_lot-information-container', [
  { elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-toggled' }
]);

setupRemove(map, [
  { elementSelector: '.parking_lot-information-container', 
  css: ['parking_lot-information-container-toggled', 'parking_lot-information-container-appear'] }
]);

//parking_page block顯示
setupToggle('#parking-page-button-list', [
  { elementSelector: '#packing-page-container', classToToggle: 'packing-page-container-toggled' },
  { elementSelector: '#packing-page-black-back', classToToggle: 'black-back-toggled' }
]);

setupRemoveButton('#close-packing-page', [
  { elementSelector: '#packing-page-container', css: ['packing-page-container-toggled'] },
  { elementSelector: '#packing-page-black-back', css: ['black-back-toggled'] },
  { elementSelector: '#menuContent', css: ['menuContent_toggled'] },
  // { elementSelector: '#packing-page-information-none', css: ['packing-page-information-none-toggled'] },
  { elementSelector: '#packing-page-car-board-selected', css: ['packing-page-car-board-selected-toggled'] },
  { elementSelector: '.parking_lot-information-container', css: ['parking_lot-information-container-toggled', 'parking_lot-information-container-appear'] }
]);

//alert_page none顯示
setupRemoveButton('#alert-content-checked-button', [
  { elementSelector: '#alert-page-container', css: ['alert-page-container-toggled'] },
  { elementSelector: '#alert-page-black-back', css: ['alert-page-black-back-toggled'] },
]);

document.getElementById('search-goal-button').addEventListener('click', function() {
  let blackBackBackground = document.querySelector('.black-back-background');
  let searchBar = document.querySelector('.search-bar');

  if (!blackBackBackground) {
      blackBackBackground = document.createElement('div');
      blackBackBackground.classList.add('black-back-background');
      blackBackBackground = document.createElement('div');
      blackBackBackground.classList.add('black-back');
      blackBackBackground.style.position = 'fixed';
      blackBackBackground.style.top = '0';
      blackBackBackground.style.left = '0';
      blackBackBackground.style.width = '100%';
      blackBackBackground.style.height = '100%';
      blackBackBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
      blackBackBackground.style.zIndex = '100';
      blackBackBackground.style.display = 'block';
      document.body.appendChild(blackBackBackground);
      if (searchBar) {
        searchBar.style.display = 'block';
    }
      // 為新創建的 blackBackBackground 添加點擊事件監聽器
      blackBackBackground.addEventListener('click', function() {
          document.body.removeChild(blackBackBackground);
          if (searchBar) {
              searchBar.style.display = 'none';
          }
      });
  }

  // 切換 searchBar 的顯示狀態
  
});