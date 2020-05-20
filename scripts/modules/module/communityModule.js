/**
*   @date 2015/11/28
*   @author yellow 
*   @description 社区管理模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var communityModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "communityModule";
    }

    extend(communityModule, baseModule);

    communityModule.prototype.createView = function () {
        //定时送鲜
        this.addView('main.communityDSSX', {
            url: '/community/dssx',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/specialShelf.html',
                    controller: 'communityDSSXController',
                }
            }
        });
        //社区热菜
        this.addView('main.communitySQRC', {
            url: '/community/sqrc',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/specialShelf.html',
                    controller: 'communitySQRCController',
                }
            }
        });
        //社区专享
        this.addView('main.communitySQZX', {
            url: '/community/sqzx',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/specialShelf.html',
                    controller:'communitySQZXController',
                }
            }
        })

        //私房菜
        this.addView('main.communitySFCCreate', {
            url: '/community/privateFoodCreate/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/SFCCreate.html',
                    controller: 'communitySFCCreateController',
                }
            }
        })

        this.addView('main.communitySFC', {
            url: '/community/privateFood',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/SFCList.html',
                    controller: 'communitySFCController',
                }
            }
        })

        //今日团购
        this.addView('main.communityBuyGroup', {
            url: '/community/groupPurchase',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/buyGroupList.html',
                    controller: 'communityBuyGroupListController',
                }
            }
        })

        this.addView('main.communityBuyGroupCreate', {
            url: '/community/groupPurchaseCreate',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/buyGroupCreate.html',
                    controller: 'communityBuyGroupCreateController',
                }
            }
        })

        //今日特惠
        this.addView('main.communityExBuyList', {
            url: '/community/exBuyList',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/exBuyList.html',
                    controller: 'communityExBuyListController',
                }
            }
        })

        this.addView('main.communityExBuyCreate', {
            url: '/community/exBuyCreate',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/community/exBuyCreate.html',
                    controller: 'communityExBuyCreateController',
                }
            }
        })
    }

    return communityModule;
});