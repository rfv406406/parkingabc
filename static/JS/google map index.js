fetchData()
//調用停車場DB數據
async function fetchData(){
    try{
        const response = await getData();
        const data = await handleResponse(response);
        console.log(data);
        await displayMarkers(data);
    }catch(error){
        await handleError(error);
    }
}

async function getData(){
    const response = await fetch("/api/input_parking_lot_information", {
        method: 'GET',
    });
    return response;
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
// ----------------------------------------------------------------------
let markers = []; 
//顯示marker
async function displayMarkers(dataObject) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    if (dataObject && Array.isArray(dataObject.data)) {
        dataObject.data.forEach(location => {
            const marker = createMarker(location);
            const infoWindow = createInfoWindow(location);
        
            marker.addListener('click', async function() {
                infoWindow.open(map, marker);
                setupAppear(marker, [{ elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-appear'}]);
                const locationData = findDataByLatLng(location.lat, location.lng, dataObject.data);
                // console.log(locationData)
                parkingLotInformationTable(locationData);
                // 直接传递包含纬度和经度的 location 对象
                await calculateAndDisplayRoute(directionsService, directionsRenderer, currentPosition, locationData);
                // console.log(location.lat)
                getBookingInformation(locationData);
            });
            markers.push(marker);
        });
    }
};

// 為標記添加信息窗口，顯示更多信息
function createInfoWindow(location) {
    return new google.maps.InfoWindow({
        content: `
            <h3>${location.name}</h3>
            <p>地址: ${location.address}</p>
            <p>價格: ${location.price} 元/小時</p>
            <p>開放時間: ${location.openingTime} - ${location.closingTime}</p>
            <p>附近地標: ${location.landmark}</p>
        `
    });
};

//產稱自定義marker
function createMarker(location) {
    const latLng = {lat: parseFloat(location.lat), lng: parseFloat(location.lng)};
    let labelContent;
    // 检查是否存在停车空间和第一个空间的状态
    if (location.squares && location.squares.every(square => square.status)) {
        labelContent = "使用中";
    }else{
        labelContent = location.price + "元";
    }
    const marker = new markerWithLabel.MarkerWithLabel({
        position: latLng,
        clickable: true,
        draggable: false,
        map: map,
        labelContent: labelContent,
        labelAnchor: new google.maps.Point(-22, -44),
        labelClass: "labels",
        labelStyle: { opacity: 1.0 },
        icon: {
            url: getIconUrl(location.price),
            scaledSize: new google.maps.Size(60, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(25, 50)
        }
    });
    return marker;
}

  //依照價錢分顏色
function getIconUrl(price) {
    if (price <= 25) {
        return '../static/IMAGE/greenlable.png'; 
    } else if (price <= 50) {
        return '../static/IMAGE/orangelable.png'; 
    } else {
        return '../static/IMAGE/redlable.png'; 
    }
}
 //最短路徑
 async function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination) {
    // console.log(origin)
    directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: parseFloat(destination.lat),
            lng: parseFloat(destination.lng) },
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        };
    });
};

function findDataByLatLng(lat, lng, data) {
    // 在 data 中查找與給定經緯度匹配的條目
    return data.find(item => item.lat === lat && item.lng === lng);
};

//返回中心點
document.getElementById('returnToCurrentPosition').addEventListener('click', function() {
    if (currentPosition) {
        map.setCenter(currentPosition);
        map.setZoom(15);
    } else {
        console.log('當前位置未知');
    }
});

document.getElementById('search-goal-button').addEventListener('click',openSearchBar);

function openSearchBar(){
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
    
  }

document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否為首次訪問
    if (!sessionStorage.getItem('firstVisitExecuted')) {
        // 執行您希望在首次訪問時執行的操作
        openSearchBar();

        // 設置 session 標記，以便下次不再執行
        sessionStorage.setItem('firstVisitExecuted', 'true');
    }
});