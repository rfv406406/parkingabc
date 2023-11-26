TPDirect.setupSDK(137033, 'app_g5H5hXkKSIHANVJsYh99hPcebudiWGo3YokDL3zG8kxYMZT4bX4bQoKJbi7V', 'sandbox')
// console.log(TPDirect);

//顯示儲值金額
document.getElementById('deposit-number').addEventListener('input', function() {
    let inputValue = this.value;
    inputValue = inputValue.replace(/\D/g, '');
    document.getElementById('total_price').textContent = inputValue;
});

let fields = {
    number: {
        // css selector
        element: document.getElementById('card-number'),
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: document.getElementById('card-ccv'),
        placeholder: 'CCV'
    }
};

TPDirect.card.setup({
    styles: {
        // Style all elements
        'input': {
            'color': 'gray',
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    fields: fields,
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
});

document.querySelector('.pay_button').addEventListener('click', function (event) {
    event.preventDefault();

    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    if (tappayStatus.canGetPrime === false) {
        alert('請輸入金額及付款資料');
        return;
    }
    // Get prime
    TPDirect.card.getPrime(function (result) {
        // alert('get prime 成功，prime: ' + result.card.prime);
        depositData(result.card.prime);
    });
});

function depositData(prime) {
    let totalPrice = document.querySelector("#total_price").textContent;

    if (totalPrice=="" || totalPrice==0){
        alert('請輸入金額')
        return;
    }

    const token = localStorage.getItem('Token');
    const json = {
        "prime": prime,
        "deposit": totalPrice,
    };
    fetch("/api/pay", {
            method: 'POST',
            body: JSON.stringify(json), 
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        .then(handleResponse)
        .then(data => {
            if(data.data.payment.message === "付款成功"){
                // let orderNumber = data.data.number;
                // window.location.href = `/thankyou?number=${orderNumber}`;
            }else{
                alert('付款失敗')
            }
        })
    };

// function depositData(data){
   
//     const nameData = data.data.attraction.name;
//     const attractionIdData = data.data.attraction.attractionId;
//     const addressData = data.data.attraction.address;
//     const imageData = data.data.attraction.URL_image;
//     const dateData = data.data.date;
//     const timeData = data.data.time;
//     const priceData = data.data.price;
//     console.log(attractionIdData)
//     return {
//         name: nameData,
//         attractionId: attractionIdData,
//         address: addressData,
//         imageURL: imageData,
//         date: dateData,
//         time: timeData,
//         price: priceData
//     };
// }

function handleResponse(response) {
    if (!response.ok) {
        // 直接将响应对象作为错误的一部分抛出
        throw response;
    }
    return response.json();
}