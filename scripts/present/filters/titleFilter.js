define(['baseFilters'], function (filters) {

    return filters.filter('titleFilter', function () {
        var sliceTitle = function (title, length) {
            length = length || 5;
            var _title;
            title = title || "";
            var sliceLenth = length;
            if (title.length >= sliceLenth) {
                _title = title.slice(0, sliceLenth) + "...";
            }
            else
                _title = title;
            return _title;
        }
        return sliceTitle;
    });

});