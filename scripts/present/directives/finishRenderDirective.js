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
})