let slider = document.getElementById("rangeMax");
let output = document.getElementById("Value");
let priceLabelWidth = document.querySelector(".price-label").offsetWidth;
let outputWidth = document.getElementById("Value").offsetWidth;

function updateSliderValuePosition() {
    output.innerHTML = slider.value + "元";
    let percent = (slider.value - slider.min) / (slider.max - slider.min);
    let sliderWidth = slider.offsetWidth;
    console.log(percent)
    let thumbWidth = 8; // 假設滑塊的寬度
    let newPosition = percent * (sliderWidth - thumbWidth) + priceLabelWidth;
    if (percent == 0){
        output.style.left = priceLabelWidth  + 'px';
    }else if(percent <= 0.95){
        output.style.left = newPosition-(outputWidth/2) + 'px';
    }else{
        output.style.left = newPosition-(outputWidth/2) - 10 + 'px';
    };
};

slider.addEventListener('input', updateSliderValuePosition);

// 初始化
updateSliderValuePosition();