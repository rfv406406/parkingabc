document.addEventListener('DOMContentLoaded', function() {
    let container = document.querySelector('.parking_lot-information-container');
    let isExpanded = false; // 初始状态为未展开

    container.addEventListener('click', function() {
        // 切换容器的高度
        if (isExpanded) {
            container.style.height = '30%'; // 收缩
        } else {
            container.style.height = '100%'; // 展开
        }
        isExpanded = !isExpanded; // 更新展开状态
    });
});