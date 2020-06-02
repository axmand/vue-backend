/**
*   @date 2015/11/28
*   @author yellow 
*   @description 商户管理模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var commercialModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "commercialModule";
    }

    extend(commercialModule, baseModule);

    commercialModule.prototype.createView = function () {
        //地块管理
        this.addView('main.dikuai', {
            url: '/commercial/dikuai',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/dikuai.html',
                    controller: 'dikuaiController',
                }
            }
        })
        //商品页
        this.addView('main.commercialCargo', {
            url: '/commercial/cargo',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialCargo.html',
                    controller: 'cargoController',
                }
            }
        });
        //商品详情页
        this.addView('main.commercialCargoDetail', {
            url: '/commercial/cargoDetail/:id/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/cargoDetail.html',
                    controller: 'cargoDetailController',
                }
            }
        });
    }

    return commercialModule;
});