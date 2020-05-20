define(['baseFilters'], function (baseFilters) {
    baseFilters.filter('dateTimeFilter', function () {
        var dateTimeFilter = function (date, time) {
            var nowDate = new Date();
            if (!time) {
                time='0:0:0';
            }
            if (date) {
                date = date.replace(/([^\u0000-\u00FF])/g, '/')
                date = date.substring(0, date.length - 1);
                var minusDate = nowDate - new Date(date + " " + time);
                var minuteDate = minusDate / 1000 / 60;
                if (minuteDate < 0) {
                    var newDate = date.replace('年', '-');
                    newDate = newDate.replace('月', '-');
                    newDate = newDate.replace('日', ' ');
                    console.log(newDate);
                    newDate = newDate.slice(2);
                    return newDate;
                }
                else if (minuteDate < 5)
                {
                    return '刚刚'
                }
                else if (minuteDate < 60) {
                    return parseInt(minuteDate) + '分钟前'
                }
                else if (minuteDate / 60 < 24) {
                    return parseInt(minuteDate / 60) + '小时前'
                }
                else if (minuteDate / 1440 < 10) {
                    return parseInt(minuteDate / 1440) + '天前'
                }
                else {
                    var newDate = date.replace('年', '-');
                    newDate = newDate.replace('月', '-');
                    newDate = newDate.replace('日', ' ');
                    newDate = newDate.slice(2, -1);
                    return newDate;
                }
            }
        }
        return dateTimeFilter;
    });
})