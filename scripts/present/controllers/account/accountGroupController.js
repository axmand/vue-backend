/**
*   
*   @description 用户权限组以及优惠券储值卡配额
*   @author yellow
*/
define(['baseControllers', 'cdn', 'setAdminGroupService'], function (baseControllers, cdn, setAdminGroupService) {

    baseControllers.controller('accountGroupController', function (
        $scope, $$dataBase, $$toast, $state,
        $$dataCache, $$setAdminGroupService) {
        //
        var userInfo = $$dataBase.getUserInfo();
        //
        var customerManagerListFeed = new $$dataBase.Feed({
            url: 'BackendCustomerManagerListGet',
            params: {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
            },
            scope: $scope,
            name: 'managerList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {

                },
                error: function (err) {
                    $scope.managerList = [];
                    $$toast("刷新失败", "error");
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data)
                },
                error: function (err) {
                    //$$toast(err || err.content, "error");
                }
            }
        });
        //
        $scope.setAdminGroup = function () {
            $$setAdminGroupService.show();
        };
        //获取信息
        $scope.$on('$ionicView.beforeEnter', function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.managerListRefresh();
            }
        });
        //
        $scope.adminConfig = {};
        //配置卡券配额
        $scope.chooseManager = function (manager) {
            $scope.selectManager = manager;
            $$dataBase.getData('BackendCustomerConfigGet', {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                waitCustomerObjectId: manager.objectId,
            }).then(function (data) {
                if (data.status == 'ok') {
                    $scope.adminConfig = JSON.parse(data.content);
                } else {
                    $scope.adminConfig = {};
                    $$toast("账户可设置", "success");
                }
            }, function (err) {
                $$toast(err || err.content, 'error');
            });
        };
        //
        $scope.createConfig = function (config) {
            //
            var postContent = {
                customerObjectId: $scope.selectManager.objectId,
                customerName: $scope.selectManager.phoneNumber,
                cardLimit: config.cardLimit,
                ticketLimit: config.ticketLimit,
                cardCurrent: config.cardCurrent,
                ticketCurrent: config.ticketCurrent,
            }
            //
            if (!postContent.customerObjectId)
                return $$toast("未选择用户", "warning");
            if (!postContent.cardLimit)
                return $$toast("未设置卡金额上限", "warning");
            if (!postContent.ticketLimit)
                return $$toast("未设置优惠券金额上限", "warning");
            //
            $$dataBase.postData('BackendCustomerSetConfigPost', postContent).then(function (data) {
                if (data.status == 'ok') {

                }
            }, function (err) {
                $$toast(err || err.content, "error");
            });
        }

    });
});