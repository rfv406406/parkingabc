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

// 事件監聽設置的通用函式//排除按鈕
function setupToggleNotButtonElements(element, toggles) {
  document.querySelector(element).addEventListener('click', function(event) {
      // 檢查點擊的目標是否不是按鈕
      if (!event.target.matches('button')) {
        toggles.forEach(function(toggle) {
          toggleClass(toggle.elementSelector, toggle.classToToggle);
        });
      }
  });
}

// 事件監聽設置的通用函式
function setupAppear(Selector, toggles) {
  Selector.addListener('click', function() {
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
  { elementSelector: '#signon-container', classToToggle: 'signon-container-toggled' }
]);

setupToggle('#close-signin', [
  { elementSelector: '#signin-container', classToToggle: 'signin-container-toggled' },
  { elementSelector: '#black-back', classToToggle: 'black-back-toggled' },
  { elementSelector: '#menuContent', classToToggle: 'menuContent_toggled' }
]);

setupToggle('#close-signon', [
  { elementSelector: '#signon-container', classToToggle: 'signon-container-toggled' },
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


//parking_lot-information-container go up
setupToggleNotButtonElements('.parking_lot-information-container', [
  { elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-toggled' }
]);

setupRemove(map, [
  { elementSelector: '.parking_lot-information-container', 
  css: ['parking_lot-information-container-toggled', 'parking_lot-information-container-appear'] }
]);

//parking_page block
setupToggle('#parking-page-button-list', [
  { elementSelector: '#packing-page-container', classToToggle: 'packing-page-container-toggled' },
  { elementSelector: '#packing-page-black-back', classToToggle: 'black-back-toggled' }
]);

setupRemoveButton('#close-packing-page', [
  { elementSelector: '#packing-page-container', css: ['packing-page-container-toggled'] },
  { elementSelector: '#packing-page-black-back', css: ['black-back-toggled'] },
  { elementSelector: '#menuContent', css: ['menuContent_toggled'] }
]);
