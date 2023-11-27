initCashRecord()
//調用停車場DB數據
async function initCashRecord(){
    try{
        const response = await getCashRecordData();
        const data = await handleResponse(response);
        console.log(data);
    }catch(error){
        await handleError(error);
    }
}

async function getCashRecordData(){
    const token = localStorage.getItem('Token');
    const response = await fetch("/api/cash_record", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
// ---------------------------------------------------------------------------------
