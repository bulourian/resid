exports.toEnglishDigit = function (val) {
  return (val + '').replace(/[\u06F0-\u06F9]/g, digit => String.fromCharCode( digit.charCodeAt(0) - 1728 ));
}

exports.toPersianDigit = function(val) {
  return (val + '').replace(/[0-9]/g, digit => String.fromCharCode( digit.charCodeAt(0) + 1728 ));
}
