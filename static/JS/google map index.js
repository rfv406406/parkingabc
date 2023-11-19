fetchData()
//調用停車場DB數據
async function fetchData(){
    try{
        const response = await getData();
        const data = await handleResponse(response);
        console.log(data);
        displayMarkers(data);
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

//顯示marker
function displayMarkers(dataObject) {
    // 確保 dataObject 中有 data 屬性並且是一個數組
    if (dataObject && Array.isArray(dataObject.data)) {
        dataObject.data.forEach(location => {
            // 使用 location 中的 lat 和 lng 屬性來設置標記的位置
            const latLng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
            const marker = createMarker(location);
            // const marker = new google.maps.Marker({
            //     position: latLng,
            //     map: map,
            //     title: location.name
            // });

            // 為標記添加信息窗口，顯示更多信息
            const infoWindow = createInfoWindow(location);

            marker.addListener('click', () => {
                calculateAndDisplayRoute(directionsService, directionsRenderer, currentPosition, latLng);
                infoWindow.open(map, marker);//???
                setupAppear(marker, [{ elementSelector: '.parking_lot-information-container', classToToggle: 'parking_lot-information-container-appear'}
                  ]);
                const locationData = findDataByLatLng(location.lat, location.lng, dataObject.data);
                console.log(locationData)
                parkingLotInformationTable(locationData);
                // getBookingInformation(locationData);
            });
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
    const marker = new markerWithLabel.MarkerWithLabel({
        position: latLng,
        clickable: true,
        draggable: true,
        map: map,
        labelContent: location.price + "元",
        labelAnchor: new google.maps.Point(-20, -45),
        labelClass: "labels",
        labelStyle: { opacity: 1.0 },
        icon: {
            url: getIconUrl(location.price),
            scaledSize: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(25, 50)
        }
    });

    return marker;
}

  //依照價錢分顏色
function getIconUrl(price) {
    if (price <= 25) {
        return '../static/IMAGE/greenlable.png'; // 低价位图标
    } else if (price <= 50) {
        return '../static/IMAGE/orangelable.png'; // 中价位图标
    } else {
        return '../static/IMAGE/redlable.png'; // 高价位图标
    }
}
 //最短路徑
function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination) {
    directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: destination,
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function findDataByLatLng(lat, lng, data) {
    // 在 data 中查找與給定經緯度匹配的條目
    return data.find(item => item.lat === lat && item.lng === lng);
}
  