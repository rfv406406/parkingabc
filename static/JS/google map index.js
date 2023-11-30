fetchData()
//調用停車場DB數據
async function fetchData(){
    try{
        const response = await getData();
        const data = await handleResponse(response);
        console.log(data);
        await displayMarkers(data);
        let cashPoint = await getMemberStatus();
        showCashPointOnMenu(cashPoint);
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
    // 確保 dataObject 中有 data 屬性並且是一個數組
    if (dataObject && Array.isArray(dataObject.data)) {
        dataObject.data.forEach(location => {
            // 使用 location 中的 lat 和 lng 屬性來設置標記的位置
            const latLng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
            const marker = createMarker(location);
            // 為標記添加訊息窗口，顯示更多訊息
            const infoWindow = createInfoWindow(location);
        
            marker.addListener('click', async function() {
                infoWindow.open(map, marker);//???
                setupAppear(marker, [{ elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-appear'}
                  ]);
                const locationData = findDataByLatLng(location.lat, location.lng, dataObject.data);
                console.log(locationData)
                parkingLotInformationTable(locationData);
                await calculateAndDisplayRoute(directionsService, directionsRenderer, currentPosition, latLng);
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
    const latLng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
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
        labelAnchor: new google.maps.Point(-20, -45),
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
    console.log(origin)
    directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: destination,
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

function showCashPointOnMenu(cashPoint){
    const cashBar = document.getElementById('cash-point')
    cashBar.textContent = '目前點數:'+cashPoint.data[0].Balance+'點';
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
