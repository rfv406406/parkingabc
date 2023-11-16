




// const markerr = new google.maps.Marker(
//     {
//         position:{},
//         map:map,
//     }
// );
fetchData()
async function fetchData(){
    try{
        const response = await getData();
        const data = await handleResponse(response);
        console.log(data);
        displayMarkers(data);
    }catch(error){
        handleError(error);
    }
}

function displayMarkers(dataObject) {
    // 確保 dataObject 中有 data 屬性並且是一個數組
    if (dataObject && Array.isArray(dataObject.data)) {
        dataObject.data.forEach(location => {
            // 使用 location 中的 lat 和 lng 屬性來設置標記的位置
            const latLng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));


            // const marker = new google.maps.Marker({
            //     position: latLng,
            //     map: map,
            //     title: location.name
            // });
            const marker = new markerWithLabel.MarkerWithLabel({
                position: latLng,
                clickable: true,
                draggable: true,
                map: map,
                labelContent: location.price + "元", // can also be HTMLElement
                labelAnchor: new google.maps.Point(5, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },
                icon: {
                    url: '../static/IMAGE/pngwing.com.png', // 自定义图标的URL
                    scaledSize: new google.maps.Size(40, 40), // 调整图标大小
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                }
            });

            // 為標記添加信息窗口，顯示更多信息
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <h3>${location.name}</h3>
                    <p>地址: ${location.address}</p>
                    <p>價格: ${location.price} 元/小時</p>
                    <p>開放時間: ${location.openingTime} - ${location.closingTime}</p>
                    <p>附近地標: ${location.landmark}</p>
                ` // 這裡可以根據需要顯示更多信息
            });

            marker.addListener('click', () => {
                calculateAndDisplayRoute(directionsService, directionsRenderer, currentPosition, latLng);
                infoWindow.open(map, marker);
            });
        });
    }
}

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
  