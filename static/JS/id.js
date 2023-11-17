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
setupToggle('#edit-button', [
  { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
  { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
]);

setupToggle('#close-information', [
  { elementSelector: '#information-page', classToToggle: 'information-page-toggled' },
  { elementSelector: '#information-container', classToToggle: 'information-container-toggled' }
]);

plate_board
setupToggle('#plate-board-edit-button', [
  { elementSelector: '#plate-board-container-header', classToToggle: 'plate-board-container-header-toggled' },
  { elementSelector: '#plate-board-information', classToToggle: 'plate-board-information-toggled' }
]);