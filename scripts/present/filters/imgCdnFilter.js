//cdn显示image所在位置
define(['baseFilters', 'cdn', 'configService'], function (baseFilters, cdn, configService) {

    baseFilters.filter('imgCdnFilter', function (configService) {

        var imgCdn = function (fileUrl) {
            if (!!fileUrl) {
                var index = fileUrl.lastIndexOf('.');
                var fileType = fileUrl.substr(index, 4);
                if (fileType === '.mp3')
                    return configService.urlRequest.musicUrl + fileUrl;
                else
                    return cdn.resolve(fileUrl);
            } else
                return 'resource/images/noPic.jpg';
        };

        return imgCdn;
    });
})