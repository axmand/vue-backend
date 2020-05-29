define(['baseModule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _cooperationModule = function (opts) {
        basemodule.call(this, opts || {});
        this.className = "cooperationModule";
    }

    extend(_cooperationModule, basemodule);

    _cooperationModule.prototype.createView = function () {
        //商户管理
        this.addView('main.cooperationShop', {
            url: '/cooperation/shop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationShop.html',
                    controller: 'shopController',
                }
            }
        });
        //商家详情操作
        this.addView('main.shopAudit', {
            url: '/cooperation/shopAudit/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/shopAudit.html',
                    controller: 'shopAuditController',
                }
            }
        });

        //工匠管理
        this.addView('main.cooperationWorker', {
            url: '/cooperation/worker',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationWorker.html',
                    controller: 'workerController',
                }
            }
        })

        //工匠详情操作
        this.addView('main.workerAudit', {
            url: '/cooperation/workerAudit/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/workerAudit.html',
                    controller: 'workerAuditController',
                }
            }
        })

        //便民信息管理
        this.addView('main.cooperationAudit', {
            url: '/cooperation/audit',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationMessage.html',
                    controller: 'auditController',
                }
            }
        });
        //专题展示
        this.addView('main.cooperationPublishTopic', {
            url: '/cooperation/publishTopic',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationTopic.html',
                    controller: 'publishTopicController',
                }
            }
        });
        //专题编辑
        this.addView('main.topicCreate', {
            url: '/cooperation/topicCreate/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/topicCreate.html',
                    controller: 'topicCreateController',
                }
            }
        });

        //视频发布
        this.addView('main.cooperationPublishVideo', {
            url: '/cooperation/publishVideo',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationVideo.html',
                    controller: 'publishVideoController',
                }
            }
        });
        //视频编辑
        this.addView('main.videoCreate', {
            url: '/cooperation/videoCreate/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/videoCreate.html',
                    controller: 'videoCreateController',
                }
            }
        })

        //公告发布
        this.addView('main.cooperationPublishAnno', {
            url: '/cooperation/publishAnno',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationAnno.html',
                    controller: 'publishAnnoController',
                }
            }
        });
        //公告编辑
        this.addView('main.annoCreate', {
            url: '/cooperation/annoCreate/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/annoCreate.html',
                    controller: 'annoCreateController',
                }
            }
        })

        //特约超市
        this.addView('main.cooperationSuperMarket', {
            url: '/cooperation/superMarket',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationSuperMarket.html',
                    controller: 'superMarketController',
                }
            }
        });
    }

    return _cooperationModule;
});