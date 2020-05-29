//货架编辑

define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('selfsupportShelfCreateController', function ($scope, $$confirmModal, $$toast, $stateParams, $$dataBase, $$chooseService, $state) {

        $scope.$on('$ionicView.enter', function () {
            $scope.shelf = $stateParams.detail ? JSON.parse($stateParams.detail) : {};
            $scope.cargos = $stateParams.detail ? $scope.shelf.cargos : [];
            console.log($scope.shelf);
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
                console.log($scope.cityList);
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });

        })

        //获取config类别数据
        var config = $$dataBase.getAppConfig();

        //添加货架商品
        $scope.addShelfCargo = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: Infinity,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cargoType: 'all',
                    shopObjectId: 'all',
                    searchword: 'all',
                    regionId: 'all',
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    dataArr.forEach(function (currentValue, index, array) {
                        //若cargos中不存在当前商品,则将当前商品加入
                        !(this.find(function (current, index, arr) {
                            return current.objectId == currentValue.objectId;
                        })) && this.push(currentValue);
                    }, $scope.cargos);
                    console.log($scope.cargos);
                },
            })
        };

        //删除指定货架商品
        $scope.deleteCargo = function (cargo) {
            if ($scope.cargos.indexOf(cargo) != -1) {
                $$confirmModal('是否从货架中删除当前商品?')
                .then(function () {
                    $scope.cargos.splice(cargo, 1);
                })
            }
        };


        //创建货架
        $scope.shelfPost = function () {
            console.log($scope.cargos);

            if (!$scope.shelf.regionId) {
                return $$toast('请选择城市', 'warning');
            }

            var postContent = {
                title: $scope.shelf.title,
                regionId: $scope.shelf.regionId,
                cargos: [],
            };
            $scope.cargos.forEach(function (currentValue) {
                if (currentValue.hasOwnProperty('cargoStandardIndex')) {
                    this.push({
                        cargoObjectId: currentValue.objectId,
                        shopObjectId: currentValue.shopObjectId,
                        cargoStandardIndex: currentValue.cargoStandardIndex
                    });
                } else {
                    return $$toast('请选择商品规格', 'warning');
                }
            }, postContent.cargos);

            if (!$scope.shelf.title) {
                return $$toast('请填写货架名称', 'warning');
            } else if (postContent.cargos.length == 0) {
                return $$toast('请补充货架商品', 'warning');
            };

            $$dataBase.postData('BackendCommercialCreateShelf', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.selfsupportShelf');
                } else {
                    $$toast(data.content, 'error');
                }
                console.log(data);
            }, function (err) {
                console.log(err);
                $$('网络错误,请稍候再试', 'error');
            });
        }

        //修改货架
        $scope.modify = function () {
            console.log($scope.cargos);

            if (!$scope.shelf.regionId) {
                return $$toast('请选择城市', 'warning');
            }

            var postContent = {
                title: $scope.shelf.title,
                regionId: $scope.shelf.regionId,
                cargos: [],
            };
            $scope.cargos.forEach(function (currentValue) {
                if (currentValue.hasOwnProperty('cargoStandardIndex')) {
                    this.push({
                        cargoObjectId: currentValue.objectId,
                        shopObjectId: currentValue.shopObjectId,
                        cargoStandardIndex: currentValue.cargoStandardIndex
                    });
                } else {
                    return $$toast('请选择商品规格', 'warning');
                }
            }, postContent.cargos);

            if (!$scope.shelf.title) {
                return $$toast('请填写货架名称', 'warning');
            } else if (postContent.cargos.length == 0) {
                return $$toast('请补充货架商品', 'warning');
            };
            postContent.targetObjectId = postContent.objectId;
            postContent.modifyType = config.EModifyType.CommercialShelf;

            $$dataBase.postData('BackendCommonModifyDataPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.selfsupportShelf');
                } else {
                    $$toast(data.content, 'error');
                }
                console.log(data);
            }, function (err) {
                console.log(err);
                $$('网络错误,请稍候再试', 'error');
            });
        }

        //删除货架
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前货架？').then(function () {
                var postContent = {
                    targetObjectId: targetObjectId,
                    modifyType: config.EModifyType.CommercialShelf
                };

                $$dataBase.postData('BackendCommonDeleteDataPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.selfsupportShelf');
                    }
                    else {
                        $$toast(data.content, 'error');
                    }
                }, function (error) {
                    $$toast('删除失败', 'error');
                })
            }, function () {
            })
        }

    });
});