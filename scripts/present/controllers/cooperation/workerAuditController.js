define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('workerAuditController', function ($scope, $$confirmModal, $$toast, $stateParams, $$bootstrapModal, $$dataBase) {

        //刷新商家列表
        $scope.$on('$ionicView.enter', function () {
            console.log($stateParams);
            //获取商家详情
            $scope.workerData = JSON.parse($stateParams.detail) || {};
            console.log($scope.workerData);
        });

        //获取工匠类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.EModifyType.ConvenienceJourneyman).then(function (data) {
            $scope.$$commericalCargoType = data;
        });


        //审核工匠通过
        $scope.modifyWorker = function (targetObjectId) {
            var content = {
                targetObjectId: targetObjectId,
                modifyType: config.EModifyType.ConvenienceJourneyman,
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
        };
        //删除工匠
        $scope.delete = function (targetObjectId) {
            var content = {
                targetObjectId: targetObjectId,
                modifyType: config.EModifyType.ConvenienceJourneyman,
            };

            $$confirmModal('确认删除当前工匠?').then(function () {
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
        };

        //#region 绑定合同modal
        var workerAccountModal = null;
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumWorkerAccount.html', {
            scope: $scope
        }).then(function (modal) {
            workerAccountModal = modal;
        });

        $scope.openModal = function () {
            workerAccountModal.show();
        }

        $scope.closeModal = function () {
            workerAccountModal.hide();
        }

        $scope.$on('$destroy', function () {
            workerAccountModal.remove();
        });

        //打开绑定商家合同modal
        $scope.bindWorkerAccount = function () {
            if (!!$scope.workerData.bargainObjectId) {
                $$toast('店铺已绑定合同', 'error');
            } else {
                $scope.workerAccount = {};
                $scope.openModal();
            }
        };
        //#endregion

        //提交工匠合同
        $scope.postWorkerAccount = function () {

            var content = {
                customerName: $scope.workerAccount.customerName,
                customerMailAddress: $scope.workerAccount.customerMailAddress,
                bargainNumber: $scope.workerAccount.bargainNumber,
                alipayAccount: $scope.workerAccount.alipayAccount,
                weiXinpayAccount: $scope.workerAccount.weiXinpayAccount,
                bargainContent: $scope.workerAccount.bargainContent,
                journeymanObjectId: $scope.workerData.objectId,
            };
            //检查必填项
            $scope.workerAccount.customerName && ($scope.workerAccount.weiXinpayAccount || $scope.workerAccount.alipayAccount) &&
            $scope.workerAccount.customerMailAddress && $scope.workerAccount.bargainNumber ?
            $$dataBase.postData('BackendCreateCommercialBargainPost', content).then(function (data) {
                $scope.closeModal();
                console.log(data);
                $$toast(data, 'success');
                $scope.shopData.bargainObjectId = "anything"; //
            }, function (err) {
                $$toast(err, 'error');
            }) : $$toast('请补全合同必填项', 'error');
        };

    });
});