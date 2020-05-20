/**
*   @date 2015/11/28
*   @author yellow 
*   @description 仓储模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var storageModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "storageModule";
    }

    extend(storageModule, baseModule);

    storageModule.prototype.createView = function () {
        //分类管理
        this.addView('main.type', {
            url: '/storage/type',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/storage/type.html',
                    controller: 'typeController',
                }
            }
        })
        //仓库管理
        this.addView('main.storehouse', {
            url: '/storage/storehouse',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/storage/storehouse.html',
                    controller: 'storehouseController',
                }
            }
        });
        //城市管理
        this.addView('main.city', {
            url: '/storage/city',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/storage/city.html',
                    controller: 'cityController'
                }
            }
        });

    }

    return storageModule;
});