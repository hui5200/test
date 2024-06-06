import { getRequest, postRequest } from './api.js';


const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
function getTime() {
    const now = new Date();
    const locale = navigator.language || 'zh-CN';
    return now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function getDate() {
    const now = new Date();
    const locale = navigator.language || 'zh-CN';
    return now.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
function updateClock() {
    document.getElementById('clock').innerText = getTime();
}

async function getAsyncCurrentLocation() {
    document.getElementById('currentAdd').innerText = await getCurrentLocation();
}
// 假设后端接口返回的数据结构
async function initClockInDetail() {
    try {
        // const data = await getRequest('`https://your-backend-api.com/getClockInDetails', { code: code });
        const data = [
            { "time": "2024/06/06 09:00:00", "address": "初始化历史打卡地址1" },
            { "time": "2024/06/06 15:23:00", "address": "初始化历史打卡地址2" }
        ]

        data.forEach((item, index) => {
            const timeDiv = document.createElement('div');
            timeDiv.innerText = item.time;
            const locationDiv = document.createElement('div');
            locationDiv.innerText = item.address;
            addClockInDetail(timeDiv, locationDiv);
        });
    } catch (error) {
        console.error('初始化打卡详情失败:', error);
    }
}

async function clockIn() {
    const formattedTime = getDate() + ' ' + getTime();

    const clockElement = document.getElementById('clock');
    clockElement.classList.add('clicked');
    setTimeout(() => {
        clockElement.classList.remove('clicked');
    }, 2000);

    const timeDiv = document.createElement('div');
    timeDiv.innerText = formattedTime;

    const locationDiv = document.createElement('div');
    locationDiv.innerText = await getCurrentLocation();
    // await recordClockInData(code, formattedTime, location);
    addClockInDetail(timeDiv, locationDiv);
}

async function recordClockInData(code, time, location) {
    try {
        const response = await postRequest('https://your-backend-api.com/getClockInDetails', {
            code: code,
            time: time,
            location: location
        });
    } catch (error) {
        console.error('记录打卡数据失败:', error);
    }
}

function addClockInDetail(timeDiv, locationDiv) {
    const details = document.querySelector('.details');
    const newRecord = document.createElement('div');
    newRecord.classList.add('record');

    const clockIcon = document.createElement('img');
    clockIcon.src = 'https://img.icons8.com/ios-filled/50/000000/clock.png';
    clockIcon.alt = 'clock';
    newRecord.appendChild(clockIcon);

    timeDiv.classList.add('time');
    newRecord.appendChild(timeDiv);

    locationDiv.classList.add('location');
    newRecord.appendChild(locationDiv);
    details.appendChild(newRecord);
}

// 获取当前位置
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        const geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                // 进行逆地理编码
                var geoc = new BMap.Geocoder();
                geoc.getLocation(r.point, function (rs) {
                    var detail = rs.addressComponents;
                    var des = (isNaN(detail.country) ? '' : detail.country + "_") + rs.address;
                    resolve(des);
                });
            } else {
                reject('获取位置失败：' + this.getStatus());
            }
        }, { enableHighAccuracy: true });
    });
}

// 页面加载完成后执行初始化
window.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    getAsyncCurrentLocation();
    initClockInDetail();
    updateClock();
    // 绑定 clockIn 函数到 clock 元素
    document.getElementById('clock').onclick = clockIn;
});