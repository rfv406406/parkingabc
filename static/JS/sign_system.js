//登入資料
const signupButton = document.querySelector("#signup-button");
const signinButton = document.querySelector("#signin-button");
//註冊
signupButton.addEventListener("click", SignupSubmit);
//登入
signinButton.addEventListener("click", SigninSubmit);
//登入及註冊資料確認後連接對應之傳送API
async function SignupSubmit(event) {
    event.preventDefault();
    const signupInput = await getSignupData();
    const inputResults = await isSignupInputEmpty(signupInput);
    
    if (inputResults) {
        let signupAlert = document.querySelector("#signup-alert");
        signupAlert.textContent = "請輸入完整資訊"
        return;
    }else{
        await signup(signupInput)
    }
}
async function SigninSubmit(event) {
    event.preventDefault();
    const signinInput = await getSigninData();
    const inputResults = await isSigninInputEmpty(signinInput);
    
    if (inputResults) {
        let signinAlert = document.querySelector("#signin-alert");
        signinAlert.textContent = "請輸入帳號與密碼"
        return;
    }else{
        await signin(signinInput)
    }
}
//取得註冊及登入資料
async function getSignupData() {
    const signupAccount = document.querySelector("input[name=account-signup]").value;
    const signupEmail = document.querySelector("input[name=e-mail]").value;
    const signupPassword = document.querySelector("input[name=password-signup]").value;
    return { 
        signupAccount: signupAccount, 
        signupEmail: signupEmail, 
        signupPassword: signupPassword, 
    };
}

async function getSigninData() {
    const account = document.querySelector("input[name=account]").value;
    const password = document.querySelector("input[name=password]").value;
    return { 
        account: account,
        password: password
    };
}
//檢查註冊及登入資料是否有缺失
async function isSignupInputEmpty(signupInput) {
    let signupInputvalues = Object.values(signupInput);
    let threeEmpty = signupInputvalues.slice(0, 3).some(value => value === "");
    return threeEmpty;
}
async function isSigninInputEmpty(signinInput) {
    let signinInputvalues = Object.values(signinInput);
    let twoHasEmpty = signinInputvalues.slice(0,2).some(value => value === "");
    return twoHasEmpty;
}
//連接後端註冊API
async function signup(signSystemInput) {
    try{
        const response = await submitSignSystemForm("/api/user", "POST", signSystemInput);
        const data = await handleSignResponse(response);
        console.log(data);
        displaySignSystemResponse(data)
    }catch(error){
        handleSignError(error);
    }
}
//連接後端登入API
async function signin(signSystemInput) {
    try{
        const response = await submitSignSystemForm("/api/user/auth", "PUT", signSystemInput);
        const data = await handleSignResponse(response);
        console.log(data);
        displaySignSystemResponse(data)
    }catch(error){
        handleSignError(error);
    }
}
//送出表單到後端
async function submitSignSystemForm(api, method, signSystemInput) {
    const response = fetch(api, {
        method: method,
        body: JSON.stringify(signSystemInput),
        headers: {
            "Content-type": "application/json",
        }
    })
   return response;
}

async function handleSignResponse(response) {
    if (!response.ok) {
        // 直接将响应对象作为错误的一部分抛出
        throw response;
    }
    return response.json();
}

async function handleSignError(response) {
    console.error('Backend could got problems', response);

    let errorMessage = "未知錯誤";
    if (response && response.json) {
        // 从响应对象中解析错误信息
        const data = await response.json();
        errorMessage = data.message || errorMessage;
    }
    console.log(errorMessage);
    displaySignSystemResponse({ message: errorMessage });
}

//後端註冊及登入回應處理
function displaySignSystemResponse(data) {
    let signupAlert = document.querySelector("#signup-alert");
    let signinAlert = document.querySelector("#signin-alert");
    
    if (data.ok) {
        signupForsuccess(signupAlert, data);
    }  

    if (data.token) {
        signinForsuccess(signinAlert, data);
        saveToken(data.token);
    } 
    
    switch (data.message) {
        case "Email已經註冊帳戶":
            signupForfailure(signupAlert, data);
            break;
        case "帳號或密碼錯誤":
            signinForfailure(signinAlert, data);
            break;
        case "databaseError":
            signupForfailure(signupAlert, data);
            signinForfailure(signinAlert, data);
            break;
    }
}
//註冊成功文字顯示
function signupForsuccess(signupAlert, data) {
    signupAlert.innerHTML = "<div>註冊成功，請登入系統</div>";
    console.log(data);
}
//註冊失敗文字顯示
function signupForfailure(signupAlert, data) {
    signupAlert.innerHTML = `<div>${data.message}</div>`;
    console.log(data.message);
}
//登入成功文字顯示
function signinForsuccess(signinAlert, data) {
    signinAlert.innerHTML = "<div>登入成功</div>";
    location.reload(); 
    console.log(data);
}
//登入失敗文字顯示
function signinForfailure(signinAlert, data) {
    signinAlert.innerHTML = `<div>${data.message}</div>`;
    console.log(data);
}
//登出_監聽事件
// buttonSignout.addEventListener('click', logout);

//token儲存
function saveToken(token){
    localStorage.setItem('Token', token);
}
//使用者登入狀態確認
async function init(){
    const token = localStorage.getItem('Token');
    // console.log(token)
    if (token == null){
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
        toggleClasses('.list', 'list-toggled');
    }else{
        try{
            const response = await submitToken("/api/user/auth", 'GET', token);
            const data = await handleResponse(response);
            // console.log(data);
            await loginCheck(data)
        }catch(error){
            handleError(error);
        }
    }
}

async function submitToken(api, method, token) {
    const response = fetch(api, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
   return response;
}

//確認登入狀態後之事件處理
async function loginCheck(data){
    let signOutButtonList = document.querySelector('#signout-button-list');
    // console.log(data);
    if (data !== null) {
        console.log(data);   
        signOutButtonList.addEventListener('click', logout);
        toggleClass('#signin-button-list', 'list-sign-in-toggled');
        toggleClass('#signout-button-list', 'list-sign-out-toggled'); 
    } else {
        logout();
    }
}
//登出
function logout() {
    localStorage.removeItem('Token');
    if(window.location.pathname !== '/') {
        window.location.href = '/'; 
    } else {
        location.reload(); 
    }
}
//F5
window.addEventListener('load', init);



//使用者登入狀態for booking
async function loggingCheck(){
    const token = localStorage.getItem('Token');
    // console.log(token)
    if (token == null){
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '請先登入以使用完整功能';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false; // 終止其他函式執行
    }
    return true; // 繼續執行其他函式
};

//使用者停車狀態for booking
async function memberStatus(){
    let parkingStatus = await getMemberStatus()
    let memberCar = await returnCarBoardData()
    
    if (memberCar.data[0] == null){
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '請先登記車輛!';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false;
    }
    if (parkingStatus.data[0].status !== null){
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '您目前已經在停車囉';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false;
    }
    if (parkingStatus.data[0].Balance <= 0){
        const alertContent = document.getElementById("alert-content")
        alertContent.textContent = '餘額不足，請儲值';
        toggleClass('#alert-page-container', 'alert-page-container-toggled');
        toggleClass('#alert-page-black-back', 'alert-page-black-back-toggled');
        return false; 
    }
    return true;
};

//連接後端登入API
async function getMemberStatus() {
    const token = localStorage.getItem('Token');
    try{
        const response = await getMemberDataApi("/api/get_member_data", "GET", token);
        const data = await handleSignResponse(response);
        console.log(data)
        return data
    }catch(error){
        handleSignError(error);
    }
}
//送出表單到後端
async function getMemberDataApi(api, method, token) {
    const response = fetch(api, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
   return response;
}

async function handleSignResponse(response) {
    if (!response.ok) {
        // 直接将响应对象作为错误的一部分抛出
        throw response;
    }
    return response.json();
}

async function handleSignError(response) {
    console.error('Backend could got problems', response);

    let errorMessage = "未知錯誤";
    if (response && response.json) {
        // 从响应对象中解析错误信息
        const data = await response.json();
        errorMessage = data.message || errorMessage;
    }
    console.log(errorMessage);
    displaySignSystemResponse({ message: errorMessage });
}
