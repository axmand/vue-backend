/**
*   城市管理器
*   @author }{hk date 2016/8/22
*/
define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('cityController', function ($filter, $$dataBase, $$bootstrapModal, $scope, groupService, $ionicSideMenuDelegate, $$tree, $$toast) {

        var config = $$dataBase.getAppConfig();

        var selectType = null, selectNode = null, tree, selectKey = "CategoryCommercialCity";
        //设定分类
        selectType = config.EClassifyPattern[selectKey];

        var _refresh = function () {
            $$dataBase.getCategory(config.EClassifyPattern[selectKey]).then(function (data) {
                tree = {
                    name: $filter('$$typeFilter')(selectKey),
                    children: data,
                };
                $$tree.updateNode(tree);
            }, function (err) {
                tree = {
                    name: $filter('$$typeFilter')(selectKey),
                    children: [],
                };
                $$tree.updateNode(tree);
            });
        }
        //添加节点
        $scope.createNode = function () {
            if (selectType == null) {
                $$toast('未选择分类类型，无法创建分类结点', 'error');
                return;
            } else {
                var _selectNode = selectNode || {};
                var categoryContent = {
                    fatherNodeObjectId: _selectNode.objectId || null,
                    eClassifyPattern: selectType,
                    name: $scope.categoryContent.name,
                    uid: $scope.categoryContent.uid,
                    regionId: $scope.categoryContent.regionId || "all",
                    icon: $scope.categoryContent.icon,
                    description: $scope.categoryContent.description,
                };
                $$dataBase.postCategory(categoryContent).then(function (data) {
                    $$toast(data, 'success');
                    $scope.closeModal();
                    $$dataBase.getCategory(config.EClassifyPattern[selectKey]).then(function (data) {
                        tree = {
                            name: $filter('$$typeFilter')(selectKey),
                            children: data,
                        };
                        $$tree.updateNode(tree);
                    }, function (err) {
                        $$toast("更新树结构失败，错误原因:" + err, 'error');
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

        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                //进入时初始化树形绘制容器
                $$tree.setContainerId('tree-container-city', selectNodeFn, changeFatherFn);
                _refresh();
            }
        });

        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumCategoryCity.html', {
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