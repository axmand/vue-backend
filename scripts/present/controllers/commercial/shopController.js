/**
*
*   @module shop
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers
        .controller('shopController', function ($scope, $state, $$confirmModal, $q, $$toast, groupService, $$dataCache, $$cutPictureService, $$dataBase, $$upload) {
            //刷新商家列表
            $scope.$on('$ionicView.enter', function () {
                //刷新shoplist
                $scope.shopListRefresh();
                //if (arguments[0].targetScope == arguments[0].currentScope) { }
            });
            //获取店铺
            var shopListFeed = new $$dataBase.Feed({
                url: 'BackendCommercialShopListGet',
                params: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    searchWord: 'all',
                    location: [0, 0],
                    pageNumber: 0,
                    eSortMethod: -1,
                    radius: 500000000,
                    regionId: 'all',
                },
                scope: $scope,
                name: 'shopList',
                autoRefreshAndLoadMore: true,
                refreshCallback: {
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (err) {
                        $scope.shopList = [];
                        $$toast(err.content || '未查询到数据', 'error');
                    }
                },
                loadMoreCallback: {
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (err) {
                        $$toast(err.content || '未查询到更多数据', 'error');
                    }
                },
            });
            //查看店铺详情
            $scope.goToShopDetail = function (shop) {
                if (!!shop)
                    $$dataCache.setData("shopDetail", shop, true)
                $state.go('main.shopDetail', { model: !shop ? 1 : 2 });
            }
            var config = $$dataBase.getAppConfig();
            //获取店铺类型
            $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialMerchant).then(function (data) {
                $scope.$$cMerchantType = data;
            });
            //关键词搜索
            $scope.searchwordGet = function (searchword, eshoptype, cMerchantType) {
                shopListFeed.setParam('searchWord', searchword || 'all');
                shopListFeed.setParam('cShoptype', 'all');
                shopListFeed.setParam('cMerchantType', cMerchantType || 'all');
                $scope.shopListRefresh();
            }
        })
        .controller('shopDetailController', function ($scope, $window, $$bootstrapModal, $ionicHistory, $stateParams,$$confirmModal, $q, $$toast, $$dataCache,$$cutPictureService, $$dataBase, $$upload) {
            //编辑模式=1，修改模式=2
            $scope.model;
            $scope.$on('$ionicView.enter', function () {
                //获取操作模式
                $scope.model = $stateParams.model;
                //获取商家详情
                $scope.shopData = $scope.model == 1 ? {} : $$dataCache.getData("shopDetail");
                //获取城市列表
                $$dataBase.getCityList().then(function (data) {
                    $scope.cityList = data;
                }, function () {
                    $$toast('获取城市列表失败', 'error');
                });
            });
            //获取店铺类别
            var config = $$dataBase.getAppConfig();
            $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialMerchant).then(function (data) {
                $scope.$$shopMerchantType = data;
                console.log($scope.$$shopMerchantType);
            });
            //切封面 1：1
            $scope.cutFaceImgUrl = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 1,
                    cutPictureCallback: function (data) {
                        console.log(data);
                        $scope.shopData.faceImgUrl = data;
                    }
                });
            };
            //切封面 16：9
            $scope.cutHeadImgUrl = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
                        $scope.shopData.headImgUrl = data;
                    }
                });
            };
            //提交创建店铺
            $scope.createShopCommit = function () {
                var postContent = $scope.shopData;
                if (!postContent.name || !postContent.address || !postContent.cMerchantType || !postContent.faceImgUrl) {
                    return $$toast('缺少必填信息,请检查提交表格', 'warning');
                }
                //补全兼容字段
                postContent.album = null;
                postContent.location = "[30, 114]";
                postContent.cShopType = "none";
                //根据店铺类型设置店铺所属平台类型
                if (postContent.cMerchantType === "service")
                    postContent.eClassifyPattern = config.EClassifyPattern.Community;
                else
                    postContent.eClassifyPattern = config.EClassifyPattern.Commercial;
                $$dataBase.postData('BackendCommercialCreateShopPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('创建店铺成功', 'success');
                        $window.history.back();
                    } else {
                        $$toast(data.content, 'error');
                    }
                    console.log(data);
                }, function (err) {
                    $$toast(err.content, 'error');
                });
            };
            //提交修改店铺
            $scope.modifyShopCommit = function () {
                if (!$scope.shopData.objectId) 
                    return $$toast('当前店铺数据有误', 'warning');
                var postContent = $scope.shopData;
                postContent.modifyType = config.EClassifyPattern.CommercialShop;
                postContent.targetObjectId = postContent.objectId;
                $$dataBase.postData('BackendCommonModifyDataPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $window.history.back();
                    } else {
                        $$toast(data.content, 'error');
                    }
                }, function (err) {
                    console.log(err);
                })
            };
            //提交删除店铺
            $scope.deleteShopCommit = function (targetObjectId) {
                var content = {
                    targetObjectId: targetObjectId,
                    modifyType: config.EClassifyPattern.CommercialShop,
                };
                $$confirmModal('确认删除当前店铺?').then(function () {
                    $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                        if (data.status == 'ok') {
                            $$toast(data.content, 'success');
                            $window.history.back();
                        } else {
                            $$toast(data.content, 'error');
                        }
                    }, function (err) {
                        $$toast(err.content, "error");
                    })
                });
            };
            //商家绑定合同modal
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
                content.shopObjectId ? $$dataBase.postData('BackendCommercialCreateBargainPost', content).then(function (data) {
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