/*
*   过程
*   app调用scripts
*   scripts 作为 package加载，调用script/main
*   main载入module vendor等
*   在$ domready 执行 bootstrap(document) 即可
*   @author yellow date 2016/1/20
*/

requirejs.config({
    urlArgs: 'bust=' + (new Date()).getTime(), //}{hk 调试用，防止缓存
    waitSeconds: 25,
    packages: [
        'scripts'
    ],
    paths: {
        //ionic 库是webapp基础框架，内置angular.js，并提供多种基于ng的元素
        ionic: 'vendor/ionic/release/js/ionic.bundle',
        jquery: "vendor/jquery/dist/jquery.min",
        ngFileUpload: 'vendor/ng-file-upload/ng-file-upload.min',
        bootstrap: 'vendor/bootstrap/dist/js/bootstrap',
        //summernote: 'vendor/summernote/dist/summernote.min',
        //summernoteZhCN: 'vendor/summernote/lang/summernote-zh-CN',
        croppie: 'vendor/Croppie/croppie',
        simplecolor: 'vendor/jquery-simple-color/jquery.simple-color.min',
        toastr: 'vendor/toast/toastr.min',
        d3: 'vendor/d3/d3.min',
        flatpickr: 'vendor/flatpickr/dist/flatpickr.min',
        flatpickrZh: 'vendor/flatpickr/dist/l10n/zh',
    },
    shim: {
        bootstrap:{
            deps:['jquery']
        },
        flatpickr: {
            deps:['jquery']
        },
        flatpickrZh:{
            deps: ['flatpickr']
        },
        //summernote: {
        //    deps: ['bootstrap']
        //},
        //summernoteZhCN: {
        //    deps:['summernote']
        //},
        ngFileUpload: {
            deps:['ionic']
        },
        croppie: {
            deps:['jquery'],
            exports: ['Croppie']
        },
        simplecolor: {
            deps: ['jquery']
        },
        toastr:{
            deps: ['jquery'],
            exports: 'toastr'
        }
    }
});
//加载进度
window.loadCount = 0;
//
var requireTick = function (event) {
    window.loadCount++;
    document.getElementById('loadingProgress').innerText = "正在加载，请稍后(" + (window.loadCount * 100 / 55).toFixed(1) + '%)';
}
//重写 createNode ，提供计数器功能
requirejs.createNode = function (config, moduleName, url) {
    var node = config.xhtml ?
            document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
            document.createElement('script');
    node.type = config.scriptType || 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    //添加事件
    if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0)) {
        node.attachEvent('onreadystatechange', requireTick);
    } else {
        node.addEventListener('load', requireTick, false);
    }
    return node;
};
//
requirejs(['ionic', 'bootstrap', 'flatpickrZh', 'ngFileUpload', 'jquery', 'scripts'], function (ionic, bootstrap, flatpickrZh, ngFileUpload, jquery, scripts) {
    //设置日期控件语言
    Flatpickr.localize(Flatpickr.l10ns.zh);
    //启动,
    scripts.app.run(function ($ionicPlatform, $location, $ionicPopup) {
        $ionicPlatform.ready(function () {
            //导航至首页
            $location.url("/login");
        });
    }).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        //设置视图缓存数目
        $ionicConfigProvider.views.maxCache(10);
        //指定导航条在下方
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        //设定默认回退字样
        $ionicConfigProvider.backButton.text('返回').icon('ion-chevron-left');
        //设定安卓设备头部显示区域
        $ionicConfigProvider.tabs.style('standard');
        //事件导航
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: 'scripts/present/views/login/login.html',
                controller: 'loginController'
            })
           .state('main', {
               url: "/main",
               templateUrl: "scripts/present/views/mainView.html",
               controller: 'mainController'
           });
        $urlRouterProvider.otherwise('/login');
    }).config(['$sceDelegateProvider', function ($sceDelegateProvider) {
        //跨域资源访问
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '*',
            'http://www.baidu.com/**',
            'http://resource.qiongrenkeji.com/**'
        ]);
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }]).config(['$httpProvider', function ($httpProvider) {
        //分割方式，multipart/form-data ，主要策略依然是 form-data
        $httpProvider.defaults.headers.post['Content-Type'] = ['multipart/form-data;'];
        //$httpProvider.defaults.useXDomain = true;
        //重写pram头
        //参考 http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? JSON.stringify(data) : data;
        }];
    }]).config(['$rootScopeProvider', function ($rootScopeProvider) {
        $rootScopeProvider.digestTtl(10000000);
    }]);
    //传统页面驱动
    angular.bootstrap(document, ['wgApp']);
    //region载入完成后的回调
    angular.$allloaded = function () {
        scripts.component.inilizationFunction();
    };
});