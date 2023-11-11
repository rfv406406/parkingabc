const rangeMin = document.getElementById('rangeMin');
const rangeMax = document.getElementById('rangeMax');
const minValueDisplay = document.getElementById('minValue');
const maxValueDisplay = document.getElementById('maxValue');

function updateTrack() {
    const minVal = parseInt(rangeMin.value, 10);
    const maxVal = parseInt(rangeMax.value, 10);

    const width = maxVal - minVal;
    const left = minVal;

    const track = document.querySelector('.slider-track');
    track.style.left = left + '%';
    track.style.width = width + '%';

    minValueDisplay.textContent = minVal;
    maxValueDisplay.textContent = maxVal;

    // 更新顯示標籤的位置
    minValueDisplay.style.left = rangeMin.value + '%';
    maxValueDisplay.style.left = rangeMax.value + '%';
}

rangeMin.addEventListener('input', updateTrack);
rangeMax.addEventListener('input', updateTrack);

updateTrack(); // 初始化