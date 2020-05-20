define(['baseFilters'], function (baseFilters) {
    baseFilters.filter('stringToDateFilter', function () {
        var stringToDateFilter = function (dateString) {
            var date = new Date();
            try{
                var index_t = dateString.indexOf('T');
                var index_z = dateString.indexOf('Z');
                var yearString = dateString.substring(0, index_t);
                var dayString = dateString.substring(index_t + 1, dateString.length - 1);
                var year_month_day = yearString.split('-');
                var hour_sec_min = dayString.split(':');
                date.setFullYear(year_month_day[0], year_month_day[1]-1, year_month_day[2]);
                date.setHours(hour_sec_min[0]);
                date.setMinutes(hour_sec_min[1]);
                date.setSeconds(hour_sec_min[2]);
            }
            catch (e) { console.log('stringToDate失败');}
            return date;
        }
        return stringToDateFilter;
    });
})