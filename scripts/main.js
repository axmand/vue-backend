/**
*   app package目录打包
*   @author }{hk date 2014/10/13
*   @package scripts
*/
requirejs.config({
    paths: {
        //modules-modules
        baseModule: 'scripts/modules/baseModule',
        baseComposite: 'scripts/modules/baseComposite',
        appComposite: 'scripts/modules/composite/appComposite',
        //module
        commercialModule: 'scripts/modules/module/commercialModule',
        cooperationModule: 'scripts/modules/module/cooperationModule',
        frontdeskModule: 'scripts/modules/module/frontdeskModule',
        selfsupportModule: 'scripts/modules/module/selfsupportModule',
        //components-commands
        baseCommand: 'scripts/components/commands/baseCommand',
        commandManager: 'scripts/components/commands/commandManager',
        //components-base
        baseControllers: 'scripts/components/controllers/baseControllers',
        baseDirectives: 'scripts/components/directives/baseDirectives',
        baseFilters: 'scripts/components/filters/baseFilters',
        baseServices: 'scripts/components/services/baseServices',
        //components-directives

        //present-controller
        mainController: 'scripts/present/controllers/mainController',
        loginController: 'scripts/present/controllers/login/loginController',
        //present-controller-commercial
        shopDetailController: 'scripts/present/controllers/commercial/shopDetailController',
        activityController: 'scripts/present/controllers/commercial/activityController',
        cargoController: 'scripts/present/controllers/commercial/cargoController',
        cargoDetailController: 'scripts/present/controllers/commercial/cargoDetailController',
        orderController: 'scripts/present/controllers/commercial/orderController',
        reviewController: 'scripts/present/controllers/commercial/reviewController',
        //present-controller-cooperation
        superMarketController: 'scripts/present/controllers/cooperation/superMarketController',
        shopController: 'scripts/present/controllers/cooperation/shopController',
        shopAuditController: 'scripts/present/controllers/cooperation/shopAuditController',
        auditController: 'scripts/present/controllers/cooperation/auditController',
        workerController: 'scripts/present/controllers/cooperation/workerController',
        workerAuditController: 'scripts/present/controllers/cooperation/workerAuditController',
        publishAnnoController: 'scripts/present/controllers/cooperation/publishAnnoController',
        annoCreateController: 'scripts/present/controllers/cooperation/annoCreateController',
        publishTopicController: 'scripts/present/controllers/cooperation/publishTopicController',
        topicCreateController: 'scripts/present/controllers/cooperation/topicCreateController',
        publishVideoController: 'scripts/present/controllers/cooperation/publishVideoController',
        videoCreateController: 'scripts/present/controllers/cooperation/videoCreateController',
        //present-controller-frontdesk
        branchManagementController: 'scripts/present/controllers/frontdesk/branchManagementController',
        orderManagementController: 'scripts/present/controllers/frontdesk/orderManagementController',
        categoryManagementController: 'scripts/present/controllers/frontdesk/categoryManagementController',
        //present-controller-selfsupport
        selfsupportShelfCreateController: 'scripts/present/controllers/selfsupport/selfsupportShelfCreateController',
        selfsupportShelfController: 'scripts/present/controllers/selfsupport/selfsupportShelfController',
        selfsupportCargoController: 'scripts/present/controllers/selfsupport/selfsupportCargoController',
        selfsupportOrderController: 'scripts/present/controllers/selfsupport/selfsupportOrderController',
        selfsupportCargoDetailController: 'scripts/present/controllers/selfsupport/selfsupportCargoDetailController',
        selfsupportOrderDetailController: 'scripts/present/controllers/selfsupport/selfsupportOrderDetailController',
        ////present-database
        commonDatabase: 'scripts/present/services/commonDatabase',
        commercialDatabase: 'scripts/present/services/commercialDatabase',
        cooperationDatabase: 'scripts/present/services/cooperationDatabase',
        frontdeskDatabase: 'scripts/present/services/frontdeskDatabase',
        dataBase: 'scripts/present/services/dataBase',
        //function-service
        bootstrapModal:'scripts/present/services/modal/bootstrapModal',
        chooseCargoService: 'scripts/present/services/modal/chooseCargoService',
        chooseShopService: 'scripts/present/services/modal/chooseShopService',
        //present-services
        loginService: 'scripts/present/services/loginService',
        configService: 'scripts/present/services/configService',
        groupService: 'scripts/present/services/groupService',
        commercialService: 'scripts/present/services/commercialService',
        cooperationService: 'scripts/present/services/cooperationService',
        frontdeskService: 'scripts/present/services/frontdeskService',
        pluginService: 'scripts/present/services/pluginService',
        //present-directives
        cutPictureDirective: 'scripts/present/directives/cutPictureDirective',
        starDirectives: 'scripts/present/directives/starDirective',
        finishRenderDirective: 'scripts/present/directives/finishRenderDirective',
        //present-filters
        titleFilter: 'scripts/present/filters/titleFilter',
        dateTimeFilter: 'scripts/present/filters/dateTimeFilter',
        orderStatusFilter: 'scripts/present/filters/orderStatusFilter',
        typeFilter: 'scripts/present/filters/typeFilter',
        stringToDateFilter: 'scripts/present/filters/stringToDateFilter',
        imgcdnFilter: 'scripts/present/filters/imgcdnFilter',
        //utils
        objutil: 'scripts/utils/objutil',
        cdn: 'scripts/utils/cdn',
    }
});
//模块载入,启动app应用框架
define(
    ['appComposite',
    'commandManager',
    'commercialModule',
    'cooperationModule',
    'frontdeskModule',
    'selfsupportModule',
    //base
    'baseControllers',
    'baseDirectives',
    'baseFilters',
    'baseServices',
    //directive
    //过滤器
    'titleFilter',
    'dateTimeFilter',
    'orderStatusFilter',
    'typeFilter',
    'stringToDateFilter',
    'imgcdnFilter',
    //controller
    'loginController',
    'mainController',
    'shopDetailController',
    'activityController',
    'cargoController',
    'cargoDetailController',
    'orderController',
    'reviewController',
    'shopController',
    'shopAuditController',
    'auditController',
    'workerController',
    'workerAuditController',
    'publishAnnoController',
    'annoCreateController',
    'publishTopicController',
    'topicCreateController',
    'publishVideoController',
    'videoCreateController',
    'branchManagementController',
    'orderManagementController',
    'categoryManagementController',
    'superMarketController',
    'selfsupportCargoController',
    'selfsupportOrderController',
    'selfsupportCargoDetailController',
    'selfsupportOrderDetailController',
    'selfsupportShelfController',
    'selfsupportShelfCreateController',
    //service
    'commonDatabase',
    'commercialDatabase',
    'cooperationDatabase',
    'frontdeskDatabase',
    'dataBase',
    //function-service
    'bootstrapModal',
    'chooseCargoService',
    'chooseShopService',
    'loginService',
    'groupService',
    'configService',
    'commercialService',
    'cooperationService',
    'frontdeskService',
    'pluginService',
    //directive
    'cutPictureDirective',
    'starDirectives',
    'finishRenderDirective'
    ],
    function (appComposite,
        commandManager,
        commercialModule,
        cooperationModule,
        frontdeskModule,
        selfsupportModule,
        //base
        baseControllers,
        baseDirectives,
        baseFilters,
        baseServices,
        //directive
        //过滤器
        titleFilter,
        dateTimeFilter,
        orderStatusFilter,
        typeFilter,
        stringToDateFilter,
        imgcdnFilter,
        //controller
        loginController,
        mainController,
        shopDetailController,
        activityController,
        cargoController,
        cargoDetailController,
        orderController,
        reviewController,
        shopController,
        shopAuditController,
        auditController,
        workerController,
        workerAuditController,
        publishAnnoController,
        annoCreateController,
        publishTopicController,
        topicCreateController,
        publishVideoController,
        videoCreateController,
        branchManagementController,
        orderManagementController,
        categoryManagementController,
        superMarketController,
        selfsupportCargoController,
        selfsupportOrderController,
        selfsupportCargoDetailController,
        selfsupportOrderDetailController,
        selfsupportShelfController,
        selfsupportShelfCreateController,
        //service
        commonDatabase,
        commercialDatabase,
        cooperationDatabase,
        frontdeskDatabase,
        dataBase,
        //function-service
        bootstrapModal,
        chooseCargoService,
        chooseShopService,
        loginService,
        groupService,
        configService,
        commercialService,
        cooperationService,
        frontdeskService,
        pluginService,
        //directive
        cutPictureDirective,
        starDirectives,
        finishRenderDirective){
        var app = angular.module('wgApp', ['ionic', 'controllers', 'services', 'filters', 'directives', 'ngFileUpload']);
        //添加模版到angular里
        app.addView = function (name, config) {
            this.config(function ($stateProvider) {
                $stateProvider.state(name, config);
            });
        };
        //配置
        var opts = {
            hook: {},
            app: app,
            cmds: new commandManager()
        };
        //构建应用组建库
        var component = new appComposite(opts);
        component.add(new commercialModule(opts));
        component.add(new cooperationModule(opts));
        component.add(new frontdeskModule(opts));
        component.add(new selfsupportModule(opts));
        component.inilizationComposite();
        return {
            app: app,
            component: component
        }
    });