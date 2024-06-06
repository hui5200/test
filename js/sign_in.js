function getTime() {
    const now = new Date();
    return now.toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}
function updateClock() {
    document.getElementById('clock').innerText = getTime();
}

async function getAsyncCurrentLocation() {
    document.getElementById('currentAdd').innerText = await getCurrentLocation();
}

async function clockIn() {
    const formattedTime = getTime();

    const clockElement = document.getElementById('clock');
    clockElement.classList.add('clicked');
    setTimeout(() => {
        clockElement.classList.remove('clicked');
    }, 2000);

    const details = document.querySelector('.details');

    const newRecord = document.createElement('div');
    newRecord.classList.add('record');

    const clockIcon = document.createElement('img');
    clockIcon.src = 'https://img.icons8.com/ios-filled/50/000000/clock.png';
    clockIcon.alt = 'clock';

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    timeDiv.innerText = formattedTime;

    const address = await getCurrentLocation();
    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location');
    locationDiv.innerText = address;

    newRecord.appendChild(clockIcon);
    newRecord.appendChild(timeDiv);
    newRecord.appendChild(locationDiv);

    details.appendChild(newRecord);
}

// 获取当前位置
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                // 进行逆地理编码
                var geoc = new BMap.Geocoder();
                geoc.getLocation(r.point, function(rs) {
                    var detail = rs.addressComponents;
                    var des = (isNaN(detail.country) ? '' : detail.country + "_") + rs.address;
                    resolve(des);
                });
            } else {
                reject('获取位置失败：' + this.getStatus());
            }
        }, {enableHighAccuracy: true});
    });
}