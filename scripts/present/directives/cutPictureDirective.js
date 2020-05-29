/*  图片裁剪指令
*   /// <reference path="../../../vendor/jquery/dist/jquery.js" />
*   /// <reference path="../../../vendor/jquery/dist/jquery.min.js" /> 
*   /// <reference path="../../../vendor/Croppie/croppie.min.js" />
*   @author xr
*   mum-width,mum-height 裁剪图片尺寸
*   boun-width,boun-height 图片选框尺寸
*   @example<mum-cut mum-height="540" mum-width="304" boun-width="500" boun-height="600"></mum-cut>
*/

define(['baseDirectives', 'croppie', 'jquery'], function (baseDirectives, croppie, $) {
   
    baseDirectives.controller('mumCutController', function ($scope, $element, $attrs, $$toast) {
        var _size = $attrs.mumSize||0.75;

        $uploadCrop = new Croppie(document.getElementById('upload-demo'), {
            viewport: {
                width: $attrs.mumWidth,
                height: $attrs.mumHeight,
                type: 'square'
            },
            boundary: {
                width: $attrs.bounWidth,
                height: $attrs.bounHeight
            },
            showZoomer: false
        });

        $scope.preUpload = function ($file) {
            if (!$file) {
                return;
            } else if ($file.size > 500 * 1024) {
                $$toast('上传的专题图片大小不能超过500kb', 'error');
            } else {
                console.log('upload');
                var reader = new FileReader();
                reader.onload = function (e) {
                    $uploadCrop.bind({
                        url: e.target.result
                    });
                    $('.upload-demo').addClass('ready');
                };
                reader.readAsDataURL($file);
            }
        };

        var _popupResult = function (result) {
            var postImg = null;
            if (result.src) {
                postImg = result.src;
                $$toast('裁剪成功', 'success');
                $scope.$emit('pictureCuttedCompleted',postImg);
            }
        };

        $scope.clickEl = function () {
            console.log('clicked');
            $uploadCrop.result({
                type: 'canvas',
                size: {
                    width: 640,
                    height: 640 * _size
                }
            }).then(function (resp) {
                console.log('resulted');
                _popupResult({
                    src: resp
                });
            });
        };

    }).directive('mumCut', function () {
        return {
            restrict: 'E',
            transclude: true,
            template:'<div class="upload-demo" data-tap-disabled="true" scroll="false">'+
                        '<div class="upload-msg" style="margin-left:auto;">'+
                            '请上传专题图片'+
                        '</div>'+
                        '<div id="upload-demo" class="croppie-container" style="padding:0px;"></div>'+
                        '<div class="button-bar" style="margin-left: auto;margin-right: auto;width: 260px;padding: 0px 50px 5px 50px;margin-top:-15px;">' +
                            '<div class="btn btn-default" ngf-select="preUpload($file)" style="margin-right:10px;">选择上传图片</div>'+
                            '<div class="btn btn-default" ng-click="clickEl()" style="padding: 6px 23px;">裁剪</div>' +
                        '</div>'+
                      '</div>',
            controller:'mumCutController',            
        }
    });
})