/**
*   @date 2016/8/2
*   @author xr 
*   @description 日常活动维护模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var dailyModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "dailyModule";
    }

    extend(dailyModule, baseModule);

    dailyModule.prototype.createView = function () {
        //bannerlist
        this.addView('main.banner', {
            url: '/daily/banner',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/banner.html',
                    controller: 'bannerController',
                }
            }
        });
        //新建banner
        this.addView('main.bannerCreate', {
            url: '/daily/bannerCreate',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/bannerCreate.html',
                    controller: 'bannerCreateController',
                }
            }
        });
        //今日团购
        this.addView('main.groupPurchase', {
            url: '/daily/groupPurchase',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/groupPurchase.html',
                    controller: 'groupPurchaseController',
                }
            }
        });
        //创建今日团购
        this.addView('main.groupPurchaseCreate', {
            url: '/daily/groupPurchaseCreate',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/groupPurchaseCreate.html',
                    controller: 'groupPurchaseCreateController',
                }
            }
        });
        //今日特惠购
        this.addView('main.exPurchase', {
            url: '/daily/exPurchase',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/exPurchase.html',
                    controller: 'exPurchaseController',
                }
            }
        })

        //创建今日团购
        this.addView('main.exPurchaseCreate', {
            url: '/daily/exPurchaseCreate',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/exPurchaseCreate.html',
                    controller: 'exPurchaseCreateController',
                }
            }
        });
        //口令活动
        this.addView('main.passwordActivity', {
            url: '/daily/passwordActivity',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/passwordActivity.html',
                    controller: 'passwordActivityController',
                }
            }
        })
        //口令活动编辑
        this.addView('main.passwordActivityDetail', {
            url: '/daily/passwordActivityDetail/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/passwordActivityDetail.html',
                    controller: 'passwordActivityDetailController',
                }
            }
        })
        //视频发布
        this.addView('main.video', {
            url: '/daily/video',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/video.html',
                    controller: 'videoController',
                }
            }
        });
        //视频创建
        this.addView('main.videoCreate', {
            url: '/daily/video/videoCreate/:shopObjectId/:cargoObjectId/:detail/:regionId',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/videoCreate.html',
                    controller: 'videoCreateController',
                }
            }
        });
        //专题list
        this.addView('main.topic', {
            url: '/daily/topic',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/topic.html',
                    controller: 'topicController',
                }
            }
        });
        //创建/编辑专题
        this.addView('main.topicCreate', {
            url: '/daily/topic/topicCreate/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/topicCreate.html',
                    controller: 'topicCreateController',
                }
            }
        });
        //货架展示
        this.addView('main.shelf', {
            url: '/daily/shelf',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/shelf.html',
                    controller: 'shelfController'
                }
            }
        });
        //货架编辑
        this.addView('main.shelfCreate', {
            url: '/daily/shelf/shelfCreate/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/shelfCreate.html',
                    controller: 'shelfCreateController'
                }
            }
        });
        //评审活动
        this.addView('main.appraisal', {
            url: '/daily/appraisal',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/appraisal.html',
                    controller: 'appraisalController',
                }
            }
        });

        //创建评审
        this.addView('main.appraisalCreate', {
            url: '/daily/appraisalCreate/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/appraisalCreate.html',
                    controller: 'appraisalCreateController',
                }
            }
        });
        //查看评审
        this.addView('main.appraisalDetail', {
            url: '/daily/appraisalDetail/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/daily/appraisalDetail.html',
                    controller: 'appraisalDetailController',
                }
            }
        });
    }

    return dailyModule;
});