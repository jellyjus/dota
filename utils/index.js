const randStr = () => {
    let result = '';
    const words = '0123456789qwertyuiopasdfghjklzxcvbnm';
    for (let i = 0; i < 4; i++) {
        let position = Math.floor(Math.random() * (words.length - 1));
        result += words[position]
    }
    return result;
};

const getDateTime = () => {

    const date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return `${day}.${month}.${year} ${hour}:${min}`;
};

module.exports = {
    randStr,
    getDateTime
};
