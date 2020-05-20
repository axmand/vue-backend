/**
*   @date 2016/8/2
*   @author xr
*   @description 统计模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var statisticModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "statisticModule";
    }

    extend(statisticModule, baseModule);

    statisticModule.prototype.createView = function () {
        //销量等统计
        this.addView('main.sellStatistic', {
            url: '/statistic/sell',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/statistic/sellStatistic.html',
                    controller:'sellStatisticController',
                }
            }
        })


    }

    return statisticModule;
});