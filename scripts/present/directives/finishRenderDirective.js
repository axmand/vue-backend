/*
在ngrepeat指令渲染完成后执行
*/

define(['baseDirectives'], function (baseDirectives) {

    baseDirectives.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    })

    baseDirectives.directive('mumHeight', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                //高:宽 = 16:9
                var scale = (iAttrs.mumHeight || 0.5625) * 1;
                //img元素宽度
                iElement[0].style.width = "100%";
                //img元素高度
                iElement[0].style.height = (iElement[0].width || $window.innerWidth) * scale + 'px';
            }
        }
    }]);

})