/**
*   分类管理器，获取分类和分类信息
*   @author }{hk date 2016/8/10
*/
define(['baseControllers', 'd3', 'jquery', 'typeFilter'], function (baseControllers, d3, $, typeFilter) {

    var editCategorys = {
        CommercialCargo: -1,
        CommercialShop: -1,
        CommercialMerchant: -1,
        CommercialVideo: -1,
        CommercialWaybill:-1,
    };

    baseControllers.controller('typeController', function ($$bootstrapModal, $scope, groupService, $ionicSideMenuDelegate, $$dataBase, $$tree, $filter, $$toast) {
        //类别对象
        $scope.categoryContent = {
            name: "",
            uid: "",
            regionId:"",
            icon: "",
            description:"",
        };
        //
        var selectType = null, selectNode = null, tree, selectKey;
        var config = $$dataBase.getAppConfig();
        //
        for (var element in editCategorys) {
            if (editCategorys[element] == -1)
                editCategorys[element] = config.ECategory[element];
        }
        //
        $scope.ECategory = editCategorys;
        //
        $scope.selectCategory = function ($event, key) {
            $event.preventDefault();
            //清空选中的node
            selectNode = null;
            //选中结点key值
            selectKey = key;
            //设置选中类型
            selectType = $scope.ECategory[key];
            //更新树结构
            $$dataBase.getCategory($scope.ECategory[key]).then(function (data) {
                tree = {
                    name: $filter('$$typeFilter')(key),
                    children: data,
                };
                $$tree.updateNode(tree);
            }, function (err) {
                tree = {
                    name: $filter('$$typeFilter')(key),
                    children: [],
                };
                $$tree.updateNode(tree);
            });
        }
        //
        $scope.createNode = function () {
            if (selectType == null) {
                $$toast('未选择分类类型，无法创建分类结点','error');
                return;
            } else {
                var _selectNode = selectNode || {};
                var categoryContent = {
                    fatherNodeObjectId: _selectNode.objectId || null,
                    ecategory: selectType,
                    name: $scope.categoryContent.name,
                    uid: $scope.categoryContent.uid,
                    regionId: $scope.categoryContent.regionId || "all",
                    icon: $scope.categoryContent.icon,
                    description: $scope.categoryContent.description,
                };
                $$dataBase.postCategory(categoryContent).then(function (data) {
                    $$toast(data, 'success');
                    $scope.closeModal();
                    $$dataBase.getCategory($scope.ECategory[selectKey]).then(function (data) {
                        tree = {
                            name: $filter('$$typeFilter')(selectKey),
                            children: data,
                        };
                        $$tree.updateNode(tree);
                    }, function (err) {
                        $$toast("更新树结构失败，错误原因:"+err, 'error');
                    });
                }, function (err) {
                    $$toast(err, 'error');
                    $scope.closeModal();
                });
            }
        }
        //选中node后的回调
        var selectNodeFn = function (node) {
            selectNode = node;
        }
        //修改了父节点的回调
        var changeFatherFn = function () {

        }
        //
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                //进入时初始化树形绘制容器
                $$tree.setContainerId('tree-container-type', selectNodeFn, changeFatherFn);
            }
        });

        var categoryModal = null;

        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumCategoryType.html', {
            scope: $scope
        }).then(function (modal) {
            categoryModal = modal;
        });

        $scope.openModal = function () {
            categoryModal.show();
        }

        $scope.closeModal = function () {
            categoryModal.hide();
        }

        $scope.$on('$destroy', function () {
            categoryModal.remove();
        });

    });

});