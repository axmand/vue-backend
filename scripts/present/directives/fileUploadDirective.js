/**
*   文件上传指令
*   @module
*/
define(['baseDirectives','jquery'], function (baseDirectives,$) {
    //
    var _imgDiv = '<div style="position:relative;">' +
                        '<img id="faceImage" style="width:25%;" ng-src="{{imgInfo.faceImgUrl}}">' +
                        '<div class="btn btn-default" ngf-select="upload($file)" style="position:absolute;bottom:0px;margin-left:10px;">请选择上传图片</div>' +
                        '</div>';
    //
    var _progressDiv = '<div class="progress" style="width:25%;height:2px;">' +
                        '<div id="faceImgProgress" class="progress-bar" role="progressbar" style="width:0%;"></div>' +
                        '</div>';
    //
    var _imgUrlDiv = '<label class="item item-input">' +
                        '<span class="input-label">图片地址：</span>' +
                        '<input type="text" ng-model="imgInfo.faceImgUrl">' +
                        '</label>';

    baseDirectives.controller('mumFileUploadController', function ($scope,Upload) {
        //绑定对象
        $scope.imgInfo = {};
        //
        $scope.upload = function (file) {
            if (!file) return;
            return Upload.upload({
                url: _postImageUrl,
                data: { file: file },
                method: 'POST',
            });
        };
    }).directive('mumFileupload', function () {
        return {
            restrice: 'EA',
            transclude: true,
            controller: 'mumFileUploadController',
            compile: function (element, attr) {
                //客户端element取消data-tap事件分发
                element.attr('data-tap-disabled', true);
                //
                var preCompile = function () {
                
                }
                //
                return { pre: preCompile };
            }
        };
    });

});