/**
*   活动controller
*   @author yellow date 2015/11/30
*/
define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('activityController', function ($scope, $$dataBase,$location, $ionicModal, $$commercialService, $ionicScrollDelegate, $filter, $$toast, configService, $$confirmModal) {
        //程序配置
        var appConfig=configService.appConfig;
        $scope.openactivityModal = function () {
            isNew = true;
            var date = new Date();
            $scope.activityData = {
                content: '',
                shopObjectid: $$dataBase.getSelectShop().objectId,
                customerLevel: 0,
                activityType: -1,
                startTime: date,
                endTime:new Date(date.valueOf() + 1 * 24 * 60 * 60 * 1000*365),
            };
            $('#activityModal').modal('show');
        };
        var isNew = true;
        $scope.sumiteActivity = function () {
            $scope.activityData.discountNum = parseFloat($scope.activityData.discountNum)||0;
            if (isNew) {
                $$commercialService.postActivity($scope.activityData).then(function (data) {
                    $('#activityModal').modal('hide');
                    refreshActivity();
                    $$toast(data, 'success');
                }, function (err) {
                    $$toast(err, 'error');
                });
            }
            else {
                $$commercialService.postModifyActivity(modifyActivityId, $scope.activityData).then(function (data) {
                    refreshActivity();
                    $('#activityModal').modal('hide');
                    $$toast(data, 'success');
                }, function (err) {
                    $$toast(err, 'error');
                });
            }
        }
        var refreshActivity = function () {
            if ($$commercialService.getSelectShop() != null)
            $$commercialService.getActivity($$commercialService.getSelectShop().objectId,0).then(function (data) {
                    $scope.activities = data;
            }, function (err) {
                $scope.activities = [];
                $$toast(err,'error');
            });
            pageNumber = 1;
        }
        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                refreshActivity();
                $("#activityTabs a").click(function (e) {
                    e.preventDefault()
                    var selectTabHash = e.currentTarget.hash.replace("#", "");
                    $scope.activityData.activityType = appConfig.EActivityType[selectTabHash];
                });
            }
        });
        //换商店时刷新
        $scope.$on('shopChanged', function () {
            console.log('shopChanged')
            refreshActivity();
        });
        var pageNumber=1;
        $scope.showMoreActivity = function () {
            console.log('click');
            if ($$commercialService.getSelectShop() != null)
                $$commercialService.getActivity($$commercialService.getSelectShop().objectId, pageNumber).then(function (data) {
                    pageNumber++;
                    $scope.activities = $scope.activities.concat(data);
                    $ionicScrollDelegate.resize();
                }, function (err) {
                    $$toast(err, "error");
                });
        };
        //修改活动信息
        var modifyActivityId = null;
        $scope.modify = function (activity) {
            isNew = false;
            $scope.activityData = {
                content: activity.content,
                shopObjectid: activity.shopObjectid,
                customerLevel: activity.customerLevel,
                discountNum: activity.discountNum,
                activityType: activity.activityType,
                startTime: $filter('stringToDateFilter')(activity.startTime),
                endTime: $filter('stringToDateFilter')(activity.endTime),
                threshold: activity.threshold,
                reduce: activity.reduce,
                freeCargoDescription:activity.freeCargoDescription,
            };
            modifyActivityId = activity.objectId;
            $('#activityModal').modal('show');
        }
        //删除活动
        var deleteActivity = null;

        $scope.delete = function (activity) {
            $$confirmModal(' 确认删除此活动？').then(function () {
                $$commercialService.deleteActivity(activity.objectId).then(function (data) {
                    refreshActivity();
                    //可改为其他的
                    $$toast(data, 'success');
                }, function (error) {
                    $$toast(error, 'error');
                    console.log(error);
                });
            }, function (evt) {
                
            })
        };
    });
});