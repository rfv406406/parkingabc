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

// //id
// setupToggle('#edit-button', [
//   { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
//   { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
// ]);

// setupToggle('#close-information', [
//   { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
//   { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
// ]);

//plate_board
// setupToggle('#plate-board-edit-button', [
//   { elementSelector: '#plate-board-container-header', classToToggle: 'plate-board-container-header-toggled' },
//   { elementSelector: '#plate-board-information', classToToggle: 'plate-board-information-toggled' }
// ]);

//parking_lot_page
setupToggle('#parking-lot-page-increase', [
  { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
  { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
]);


setupToggle('#parking-lot-information-page-go-button', [
  { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' },
  { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
]);

setupToggle('#parking-lot-information-page-close', [
  { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' },
  { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
]);

setupToggle('#parking-lot-square-page-go-button', [
  { elementSelector: '#parking-lot-square-page', classToToggle: 'parking-lot-square-page-toggled' },
  { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
]);

setupToggle('#parking-lot-information-page-edit-button', [
  { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
  { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
]);

setupToggle('#parking-lot-square-page-close', [
  { elementSelector: '#parking-lot-square-page', classToToggle: 'parking-lot-square-page-toggled' },
  { elementSelector: '#parking-lot-information-page', classToToggle: 'parking-lot-information-page-toggled' }
]);

setupToggle('#parking-lot-information-container-close', [
  { elementSelector: '#parking-lot-information-container', classToToggle: 'parking-lot-information-container-toggled' },
  { elementSelector: '#parking-lot-page', classToToggle: 'parking-lot-page-toggled' }
]);


