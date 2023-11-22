//登入資料
const signupButton = document.querySelector("#signup-button");
const signinButton = document.querySelector("#signin-button");
//註冊
signupButton.addEventListener("click", SignSystemSubmit);
//登入
signinButton.addEventListener("click", SignSystemSubmit);
//登入及註冊資料確認後連接對應之傳送API
async function SignSystemSubmit(event) {
    event.preventDefault();
    const signSystemInput = await getSignSystemData();
    const inputResults = await isInputEmpty(signSystemInput);
    
    if (inputResults[0]) {
        let signupAlert = document.querySelector("#signup-alert");
        signupAlert.textContent = "請輸入完整資訊"
        return;
    }
    if (inputResults[1]) {
        let signinAlert = document.querySelector("#signin-alert");
        signinAlert.textContent = "請輸入帳號與密碼"
        return;
    }

    if (!inputResults[0]){
        await signup(signSystemInput)
    }else{
        await signin(signSystemInput)
    }
}
//取得註冊及登入資料
async function getSignSystemData() {
    const signupAccount = document.querySelector("input[name=account-signup]").value;
    const signupEmail = document.querySelector("input[name=e-mail]").value;
    const signupPassword = document.querySelector("input[name=password-signup]").value;
    const account = document.querySelector("input[name=account]").value;
    const password = document.querySelector("input[name=password]").value;
    return { 
        signupAccount: signupAccount, 
        signupEmail: signupEmail, 
        signupPassword: signupPassword, 
        account: account,
        password: password
    };
}
//檢查註冊及登入資料是否有缺失
async function isInputEmpty(signSystemInput) {
    let firstThreeEmpty = signSystemInput.slice(0, 3).some(value => value === "");
    let lastTwoHasEmpty = signSystemInput.slice(3).some(value => value === "");
    return [firstThreeEmpty,lastTwoHasEmpty];
}
//連接後端註冊API
async function signup(signSystemInput) {
    try{
        const response = await submitSignSystemForm("/api/user", "POST", signSystemInput);
        const data = await handleResponse(response);
        console.log(data);
        displaySignSystemResponse(data)
    }catch(error){
        handleError(error);
    }
}
//連接後端登入API
async function signin(signSystemInput) {
    try{
        const response = await submitSignSystemForm("/api/user/auth", "PUT", signSystemInput);
        const data = await handleResponse(response);
        console.log(data);
        displaySignSystemResponse(data)
    }catch(error){
        handleError(error);
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

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Get null from backend');
    }
    return response.json();
}

async function handleError(error) {
    console.error('Backend could got problems', error);
}

//後端註冊及登入回應處理
function displaySignSystemResponse(data) {
    let signupAlert = document.querySelector("#signup-alert");
    let signinAlert = document.querySelector("#signin-alert");
    
    if (data.ok) {
        signupForsuccess(signupAlert, data);
    }  

    if (data.token) {
        signinForsuccess(signininfor, data);
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
buttonSignout.addEventListener('click', logout);

//token儲存
function saveToken(token){
    localStorage.setItem('Token', token);
}
//使用者登入狀態確認
async function init(){
    const token = localStorage.getItem('Token');
    if (token == null){
        window.location.href = '/'; 
    }
    try{
        const response = await submitToken("/api/user/auth", 'GET', token);
        const data = await handleResponse(response);
        console.log(data);
        loginCheck(data, buttonSignin, buttonSignout)
    }catch(error){
        handleError(error);
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
function loginCheck(data){
    let signButtonList = document.querySelector('#signin-button-list');
    console.log(data);
    if (data !== null) {
        signButtonList.textContent = '登出';
        if (signButtonList.value = '登出'){
            signButtonList.addEventListener('click', logout);
        }
        
        console.log(data.data.name)
        // const usernameData = data.data.name;
        // const userName = document.querySelector('#user_name');
        // userName.textContent = usernameData;
    } else {
        signButtonList.textContent = '';
        logout();
    }
}
//登出
function logout() {
    localStorage.removeItem('Token');
    if(window.location.pathname === '/booking') {
        window.location.href = '/'; 
    } else {
        location.reload(); 
    }
}
//F5
window.addEventListener('load', init);