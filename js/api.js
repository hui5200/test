// 封装 GET 请求
async function getRequest(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;
    
    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('网络响应失败');
    }
    
    return response.json();
}

// 封装 POST 请求
async function postRequest(url, data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('网络响应失败');
    }
    
    return response.json();
}

// 导出函数
export { getRequest, postRequest };