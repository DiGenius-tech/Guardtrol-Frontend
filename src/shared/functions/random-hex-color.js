
exports.randomHexColor = () => {
    var color = "#" + Math.floor(Math.random() * 16777215)?.toString(16); // Random value between 0 and FFFFFF
    return color;
}

exports.formatNumberWithCommas = (number)  => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}