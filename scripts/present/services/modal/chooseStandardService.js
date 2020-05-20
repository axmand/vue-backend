define(['baseServices'], function (baseServices) {

    //商品/商家选择modal
    baseServices.factory('$$chooseStandardService', function ($$bootstrapModal,$q,$rootScope,$$dataBase,$$toast) {
        var $scope = $rootScope.$new();
        var standardModal = null;
        $scope.standard = {};
        $scope.cargoObjectId = null;
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumChooseStandardModal.html', {
            scope: $scope
        }).then(function (modal) {
            standardModal = modal;
        });
        var standardFeed = new $$dataBase.Feed({
            url: 'BackendCommercialStandardListGet',
            params: {
                cargoObjectId: 'none',
                pageNumber: 0,
            },
            scope: $scope,
            name: 'dataList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    $scope.standard = {};
                },
                error: function (err) {
                    $scope.dataList = [];
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到更多数据', 'error');
                    }
                    console.log(err);
                }
            },
        })

        $scope.chooseStandard = function (standard) {
            $scope.standard = standard;
        }

        $scope.createCommit = function (standard) {
            standard.cargoObjectId = $scope.cargoObjectId;
            $$dataBase.postData('BackendCommercialCreateStandardPost', standard).then(function (data) {
                if (data.status === "ok") {
                    $scope.dataListRefresh();
                    $$toast(data.content)
                }
                else
                    $$toast(data.content, 'error');
            }, function (err) {
                $$toast(err || err.content, 'error');
            });
        }

        var _openModal = function (pCargoObjectId) {
            $scope.showSelectButton = false;
            $scope.standard = {};
            $scope.selectStandard = function () { };
            standardFeed.setParam('cargoObjectId', pCargoObjectId);
            $scope.cargoObjectId = pCargoObjectId;
            $scope.dataListRefresh();
            standardModal.show();
        }

        var _chooseModal = function (pCargoObjectId) {
            var defer = $q.defer();
            $scope.standard = {};
            $scope.showSelectButton = true;
            standardFeed.setParam('cargoObjectId', pCargoObjectId);
            $scope.cargoObjectId = pCargoObjectId;
            $scope.dataListRefresh();
            standardModal.show();
            $scope.selectStandard = function (standard) {
                if (!!standard.objectId) {
                    defer.resolve(standard);
                    standardModal.hide();
                    $scope.standard = {};
                }
                else {
                    $scope.standard = {};
                    $$toast("未选择规格","error");
                }
            }
            return defer.promise;
        }
        
        $scope.$on('$destory', function () {
            standardModal.remove();
        });

        return {
            show: _openModal,
            choose: _chooseModal,
        }

    });

})