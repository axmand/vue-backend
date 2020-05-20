//定时送鲜

define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('communityDSSXController', function (
        $scope, $$confirmModal, $state, $q,$$cutPictureService,
        $$toast, $stateParams, $$dataBase, $$chooseService) {

        $scope.shelf = {};
        $scope.cargos = [];
        $scope.shelfName = "定时送鲜栏目";
        var appConfig = $$dataBase.getAppConfig();
        //默认获取栏目信息
        $scope.$on('$ionicView.enter', function () {
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            });
        });
        //选择店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommunityShopListGet',
                feedParams: {
                    regionId: 'all'
                },
                completeCallback: function (dataArr) {
                    //清空数据
                    $scope.shelf = {};
                    $scope.shelf.shop = dataArr[0];
                    $scope.shelf.shopName = dataArr[0].name;
                    //获取详情
                    $$dataBase.getData('BackendCommunityDSSXGet', {
                        shopObjectId: $scope.shelf.shop.objectId,
                    }).then(function (data) {
                        if (data.status == "ok") {
                            $scope.shelf = JSON.parse(data.content);
                            $scope.cargos = $scope.shelf.cargos || [];
                        }
                        else if (data.status == "fail" && data.code === 401) {
                            $scope.shelf.shopObjectId = dataArr[0].objectId;
                            $$toast("当前社区尚未创建该栏目，处于新建模式", "warning");
                        }
                        else
                            $$toast(data.content, "error");
                    }, function (err) {
                        $$toast(err || err.content, 'error');
                    });

                },
            });
        };
        //添加货架商品
        $scope.addShelfCargo = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: Infinity,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cCargoType: 'all',
                    shopObjectId: $scope.shelf.shopObjectId || 'all',
                    searchWord: 'all',
                    regionId: 'all',
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    dataArr.forEach(function (value, index) {
                        if (this.indexOf(value) === -1)
                            this.push(value);
                    }, $scope.cargos);
                },
            });
        };
        //选择规格
        $scope.chooseStandard = function (cargo) {
            $$chooseStandardService.choose(cargo.objectId).then(function (standard) {
                cargo.selectStandardObjectId = standard.objectId;
            })
        }
        //上传faceimgurl
        $scope.cutFaceImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 1,
                cutPictureCallback: function (imgUrl) {
                    $scope.shelf.faceImgUrl = imgUrl;
                }
            });
        };
        //长传headImgUrl
        $scope.cutHeadImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (imgUrl) {
                    $scope.shelf.headImgUrl = imgUrl;
                }
            });
        };
        //删除指定货架商品
        $scope.deleteCargo = function (cargo) {
            if ($scope.cargos.indexOf(cargo) != -1) {
                $$confirmModal('是否从货架中删除当前商品?').then(function () {
                    $scope.cargos.splice(cargo, 1);
                })
            }
        };
        //修改货架
        $scope.modify = function () {
            //if (!$scope.shelf.regionId) {
            //    return $$toast('请选择城市', 'warning');
            //}
            var postContent = {
                title: $scope.shelf.title,
                regionId: $scope.shelf.regionId,
                objectId: $scope.shelf.objectId,
                cargos: [],
            };
            $scope.cargos.forEach(function (currentValue) {
                console.log(currentValue);
                if (currentValue.hasOwnProperty('selectStandardObjectId')) {
                    this.push({
                        cargoObjectId: currentValue.objectId,
                        shopObjectId: currentValue.shopObjectId,
                        cargoStandardIndex: currentValue.selectStandardObjectId
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
            postContent.modifyType = appConfig.EShelfType.DSSX;
            console.log(postContent);

            $$dataBase.postData('BackendCommonModifyDataPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.shelf');
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
                    modifyType: appConfig.EShelfType.DSSX
                };

                $$dataBase.postData('BackendCommonDeleteDataPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.shelf');
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
        //创建货架
        $scope.shelfPost = function () {
            var postContent = {
                title: "定时送鲜",
                regionId: $scope.shelf.regionId || "all",
                faceImgUrl: $scope.shelf.faceImgUrl,
                headImgUrl: $scope.shelf.headImgUrl,
                eShelfType: appConfig.EShelfType.DSSX,
                content: $scope.shelf.content,
                shopObjectId: $scope.shelf.shop.objectId,
                content: $scope.shelf.content,
                shelfElements: [],
            };
            $scope.cargos.forEach(function (value) {
                if (!!value.selectStandardObjectId) {
                    this.push({
                        cargoObjectId: value.objectId,
                        shopObjectId: value.shopObjectId,
                        cargoStandardObjectId: value.selectStandardObjectId
                    });
                } else
                    return $$toast('商品[' + value.title + ']未选规格', 'warning');
            }, postContent.shelfElements);
            //
            if (!postContent.title)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.faceImgUrl)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.headImgUrl)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.shopObjectId)
                return $$toast('请选择店铺', 'warning');
            if (postContent.shelfElements.length == 0)
                return $$toast('货架内无商品', 'warning');
            //
            $$dataBase.postData('BackendCommercialCreateShelf', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.shelf');
                } else
                    $$toast(data.content, 'error');
            }, function (err) {
                $$toast(err || err.content, 'error');
            });
        }
    });
});