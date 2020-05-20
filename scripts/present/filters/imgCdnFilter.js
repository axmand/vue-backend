//cdn显示image所在位置
define(['baseFilters', 'cdn'], function (baseFilters, cdn) {

    baseFilters.filter('imgCdnFilter', function () {
        var imgUrl = "http://resource.liangshisq.com/images/";
        var imgCdn = function (fileUrl) {
            var resultImgUrl = '';
            if (!!fileUrl) {
                var imgType = fileUrl.substr(0, 4);
                if (imgType == 'http') {
                    resultImgUrl = fileUrl;
                } else {
                    resultImgUrl = imgUrl + fileUrl;
                }
            } else {
                resultImgUrl = 'resource/images/noPic.jpg';
            }
            return resultImgUrl;
        };

        return imgCdn;
    });
})