/**
   *分数显示指令
   *注意使用时需要icon-pingjia3，icon-pingjia样式
   *@author wk
   * 示例:
   * star的数值为0到5实数
   *     @example
   *     <mum-star star="5"><mum-star>     
   */
define(['baseDirectives'], function (baseDirectives) {
    baseDirectives.directive('mumStar', function () {
        return {
            restrict: 'E',
            scope: false,
            replace: true,
            terminal:true,
            template: '<span style="color:rgb(253, 153, 52);"></span>',
            link: function postLink(scope, iElement, iAttrs) {
                scope.$watch(iAttrs.star, function (newValue, oldValue) {
                    iElement.empty();
                    var star = 0;
                    scope.star = newValue;
                    if (scope.star) {
                        star = parseFloat(scope.star);
                    }
                    if (star > 5) { star = 5 }
                    if (star < 0) { star = 0 }
                    var good = Math.floor(star);
                    for (var i = 0; i < good; i++) {
                        iElement.append('<i class="icon ion-ios-star" style="color:rgb(253, 153, 52);"></i>');
                    }
                    var center = 0;
                    if (star - good > 0) {
                        center = 1;
                        iElement.append('<i class="icon ion-ios-star-half"></i>');
                    }
                    var bad = 5 - good - center;
                    for (var i = 0; i < bad; i++) {
                        iElement.append('<i class="icon ion-ios-star-outline" style="color:rgb(178, 178, 178);"></i>');
                    }
                    iElement.append('&nbsp;&nbsp;&nbsp;' + (good + (center == 0 ? '.0分' : '.5分')));
                        })                       
                    }
                }
    })
})