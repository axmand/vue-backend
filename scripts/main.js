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
        dailyModule: 'scripts/modules/module/dailyModule',
        statisticModule: 'scripts/modules/module/statisticModule',
        storageModule: 'scripts/modules/module/storageModule',
        delegateModule: 'scripts/modules/module/delegateModule',
        supplyModule: 'scripts/modules/module/supplyModule',
        communityModule: 'scripts/modules/module/communityModule',
        accountModule: 'scripts/modules/module/accountModule',
        cardModule: 'scripts/modules/module/cardModule',
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
        //presetn-verification
        cardController: 'scripts/present/controllers/verification/cardController',
        ticketController: 'scripts/present/controllers/verification/ticketController',
        //prestent-controller-account
        accountGroupController: 'scripts/present/controllers/account/accountGroupController',
        //present-controller-commercial
        shopController: 'scripts/present/controllers/commercial/shopController',
        cargoController: 'scripts/present/controllers/commercial/cargoController',
        orderController: 'scripts/present/controllers/commercial/orderController',
        //present-controller-community
        communityDSSXController: 'scripts/present/controllers/community/communityDSSXController',
        communitySQRCController: 'scripts/present/controllers/community/communitySQRCController',
        communitySQZXController: 'scripts/present/controllers/community/communitySQZXController',
        communitySFCCreateController: 'scripts/present/controllers/community/communitySFCCreateController',
        communitySFCController: 'scripts/present/controllers/community/communitySFCController',
        communityBuyGroupListController: 'scripts/present/controllers/community/communityBuyGroupListController',
        communityBuyGroupCreateController: 'scripts/present/controllers/community/communityBuyGroupCreateController',
        communityExBuyListController: 'scripts/present/controllers/community/communityExBuyListController',
        communityExBuyCreateController: 'scripts/present/controllers/community/communityExBuyCreateController',
        //present-controller-daily
        shelfController: 'scripts/present/controllers/daily/shelfController',
        shelfCreateController: 'scripts/present/controllers/daily/shelfCreateController',
        bannerController: 'scripts/present/controllers/daily/bannerController',
        bannerCreateController: 'scripts/present/controllers/daily/bannerCreateController',
        exPurchaseController: 'scripts/present/controllers/daily/exPurchaseController',
        groupPurchaseController: 'scripts/present/controllers/daily/groupPurchaseController',
        passwordActivityController: 'scripts/present/controllers/daily/passwordActivityController',
        videoCreateController: 'scripts/present/controllers/daily/videoCreateController',
        passwordActivityDetailController: 'scripts/present/controllers/daily/passwordActivityDetailController',
        videoController: 'scripts/present/controllers/daily/videoController',
        topicController: 'scripts/present/controllers/daily/topicController',
        topicCreateController: 'scripts/present/controllers/daily/topicCreateController',
        appraisalController: 'scripts/present/controllers/daily/appraisalController',
        //present-controller-storage
        typeController: 'scripts/present/controllers/storage/typeController',
        storehouseController: 'scripts/present/controllers/storage/storehouseController',
        cityController: 'scripts/present/controllers/storage/cityController',
        //present-controller-statistic
        sellStatisticController: 'scripts/present/controllers/statistic/sellStatisticController',
        //present-controller-delegate
        delegateShopController: 'scripts/present/controllers/delegate/delegateShopController',
        delegateCargoController: 'scripts/present/controllers/delegate/delegateCargoController',
        //present-controller-supply
        supplyShopController: 'scripts/present/controllers/supply/supplyShopController',
        supplyCargoController: 'scripts/present/controllers/supply/supplyCargoController',
        //present-services
        groupService: 'scripts/present/services/groupService',
        commonDatabase: 'scripts/present/services/database/commonDatabase',
        dataBase: 'scripts/present/services/database/dataBase',
        storageDatabase: 'scripts/present/services/database/storageDatabase',
        pluginService: 'scripts/present/services/pluginService',
        d3Service: 'scripts/present/services/d3Service',
        bootstrapModal: 'scripts/present/services/modal/bootstrapModal',
        chooseShopService: 'scripts/present/services/modal/chooseShopService',
        chooseCargoService: 'scripts/present/services/modal/chooseCargoService',
        chooseShelfService: 'scripts/present/services/modal/chooseShelfService',
        chooseStandardService: 'scripts/present/services/modal/chooseStandardService',
        confirmService: 'scripts/present/services/modal/confirmService',
        setAdminGroupService: 'scripts/present/services/modal/setAdminGroupService',
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
    'dailyModule',
    'statisticModule',
    'storageModule',
    'delegateModule',
    'supplyModule',
    'communityModule',
    'accountModule',
    'cardModule',
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
    //account-controller
    'accountGroupController',
    //controller-commercial
    'shopController',
    'cargoController',
    'orderController',
    //present-controller-community
    'communityDSSXController',
    'communitySQRCController',
    'communitySQZXController',
    'communitySFCCreateController',
    'communitySFCController',
    'communityBuyGroupListController',
    'communityBuyGroupCreateController',
    'communityExBuyListController',
    'communityExBuyCreateController',
    //present-controller-daily
    'shelfController',
    'shelfCreateController',
    'bannerController',
    'bannerCreateController',
    'exPurchaseController',
    'groupPurchaseController',
    'passwordActivityController',
    'videoCreateController',
    'passwordActivityDetailController',
    'videoController',
    'topicController',
    'topicCreateController',
    'appraisalController',
    //present-controller-storage
    'typeController',
    'storehouseController',
    'cityController',
    //present-controller-statistic
    'sellStatisticController',
    //present-controller-delegate
    'delegateShopController',
    'delegateCargoController',
    //present-controller-supply
    'supplyShopController',
    'supplyCargoController',
    //present-controller-verifcation
    'cardController',
    'ticketController',
    //service
    'groupService',
    'commonDatabase',
    'dataBase',
    'storageDatabase',
    'pluginService',
    'd3Service',
    'bootstrapModal',
    'chooseShopService',
    'chooseCargoService',
    'chooseShelfService',
    'chooseStandardService',
    'confirmService',
    'setAdminGroupService',
    //directive
    'cutPictureDirective',
    'starDirectives',
    'finishRenderDirective'
    ],
    function (appComposite,
        commandManager,
        commercialModule,
        dailyModule,
        statisticModule,
        storageModule,
        delegateModule,
        supplyModule,
        communityModule,
        accountModule,
        cardModule,
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
        //controller-account
        accountGroupController,
       //controller-commercial
        shopController,
        cargoController,
        orderController,
        //present-controllers-community
        communityDSSXController,
        communitySQRCController,
        communitySQZXController,
        communitySFCCreateController,
        communitySFCController,
        communityBuyGroupListController,
        communityBuyGroupCreateController,
        communityExBuyListController,
        communityExBuyCreateController,
        //present-controller-daily
        shelfController,
        shelfCreateController,
        bannerController,
        bannerCreateController,
        exPurchaseController,
        groupPurchaseController,
        passwordActivityController,
        videoCreateController,
        passwordActivityDetailController,
        videoController,
        topicController,
        topicCreateController,
        appraisalController,
         //present-controller-storage
        typeController,
        storehouseController,
        cityController,
        //present-controller-statistic
        sellStatisticController,
        //present-controller-delegate
        delegateShopController,
        delegateCargoController,
        //present-controller-supply
        supplyShopController,
        supplyCargoController,
        //present-controller-verifcation
        cardController,
        ticketController,
        //service
        groupService,
        commonDatabase,
        dataBase,
        storageDatabase,
        pluginService,
        d3Service,
        bootstrapModal,
        chooseShopService,
        chooseCargoService,
        chooseShelfService,
        chooseStandardService,
        confirmService,
        setAdminGroupService,
        //directive
        cutPictureDirective,
        starDirectives,
        finishRenderDirective) {

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
        component.add(new dailyModule(opts));
        component.add(new storageModule(opts));
        component.add(new statisticModule(opts));
        component.add(new delegateModule(opts));
        component.add(new supplyModule(opts));
        component.add(new communityModule(opts));
        component.add(new accountModule(opts));
        component.add(new cardModule(opts));

        component.inilizationComposite();

        return {
            app: app,
            component: component
        }

    });