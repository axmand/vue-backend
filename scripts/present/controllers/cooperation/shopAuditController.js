define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('shopAuditController', function ($scope, $$confirmModal, $$toast, $stateParams, $$bootstrapModal, $$dataBase) {

        //刷新商家列表
        $scope.$on('$ionicView.enter', function () {
            //获取商家详情
            $scope.shopData = JSON.parse($stateParams.detail) || {};
            console.log($scope.shopData);
        });

        //获取店铺类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.EModifyType.CommercialShop).then(function (data) {
            $scope.$$commericalCargoType = data;
        });

        //#region  提交通过,删除请求
        //提交通过店铺审核
        $scope.passShopCommit = function (targetObjectId) {
            var content = {
                targetObjectId: targetObjectId,
                modifyType: config.EModifyType.CommercialShop,
            };

            $$confirmModal('确认当前店铺通过审核?').then(function () {
                $$dataBase.postData('BackendSetPassPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                    } else {
                        $$toast(data.content, 'error');
                    }

                    console.log(data);
                }, function (err) {
                    console.log(err);
                })
            })
        }

        //提交删除店铺
        $scope.deleteShopCommit = function (targetObjectId) {
            var content = {
                targetObjectId: targetObjectId,
                modifyType: config.EModifyType.CommercialShop,
            };

            $$confirmModal('确认删除当前店铺').then(function () {
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                    } else {
                        $$toast(data.content, 'error');
                    }

                    console.log(data);
                }, function (err) {
                    console.log(err);
                })
            })
        }
        //#endregion


        //#region 商家绑定合同modal
        var shopAccountModal = null;
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumShopAccount.html', {
            scope: $scope
        }).then(function (modal) {
            shopAccountModal = modal;
        });

        $scope.openModal = function () {
            shopAccountModal.show();
        }

        $scope.closeModal = function () {
            shopAccountModal.hide();
        }

        $scope.$on('$destroy', function () {
            shopAccountModal.remove();
        });
        //#endregion


        //#region 绑定账号
        //打开绑定商家合同modal
        $scope.bindShopAccount = function () {
            if (!!$scope.shopData.bargainObjectId) {
                $$toast('店铺已绑定合同', 'error');
            } else {
                $scope.account = {};
                $scope.openModal();
            }
        };

        //提交商家合同
        $scope.postAccount = function () {
            var content = {
                customerName: $scope.account.customerName,
                customerMailAddress: $scope.account.customerMailAddress,
                bargainNumber: $scope.account.bargainNumber,
                alipayAccount: $scope.account.alipayAccount,
                weiXinpayAccount: $scope.account.weiXinpayAccount,
                bargainContent: $scope.account.bargainContent,
                shopObjectId: $scope.shopData.objectId,
            };

            //检查必填项
            content.customerMailAddress && content.customerName &&
            content.bargainNumber && (content.alipayAccount || content.weiXinpayAccount) &&
            content.shopObjectId ? $$dataBase.postData('BackendCreateCommercialBargainPost', content).then(function (data) {
                $scope.closeModal();
                console.log(data);
                $$toast(data, 'success');
                $scope.shopData.bargainObjectId = "anything"; //
            }, function (err) {
                $$toast(err, 'error');
            }) : $$toast('请补全合同必填项', 'error');
        };

        //#endregion

    });
});