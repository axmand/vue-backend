/**
*   图片cdn读取模块
*   @module cdn
*   @author yellow date 2016/2/18
*/
define(function () {

    var _imgRootUrl = "http://120.55.166.61/images/"

    var _cdn = function () {

    }

    _cdn.resolve = function (imgName) {
        return _imgRootUrl + imgName;
    }

    return _cdn;
});