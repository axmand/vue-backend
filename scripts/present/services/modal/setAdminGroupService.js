define(['baseServices', 'objutil'], function (baseServices, objutil) {

    //商品/商家选择modal
    baseServices.filter('$$groupFilter', function () {

        var groupFilter = {
            AGENCY: "代理商组",
            SUPPLY: "供应商组",
            ESQ: "客服组",
            MNO: "运营组",
            SUBADMIN: "管理员组",
            ADMIN: "超级管理员组"
        }

        var dictionary = {};
        objutil.cover(dictionary, groupFilter);

        var typeFilter = function (type) {
            if (type === 'null') {
                return '未知';
            } else {
                return dictionary[type] ? dictionary[type] : '未知类别';
            }
        }

        return typeFilter;

    }).factory('$$setAdminGroupService', function ($$bootstrapModal, $q, $rootScope, $$dataBase, $$toast, $filter) {

        var $scope = $rootScope.$new();
        var userInfo = $$dataBase.getUserInfo();
        var adminGroupModal = null;
        $scope.adminData = {};

        $scope.adminGroup = [];

        var appConfig = $$dataBase.getAppConfig();

        var EGroup = appConfig.EGroup;

        for (var property in EGroup) {
            $scope.adminGroup.push({
                name: $filter('$$groupFilter')(property),
                value: EGroup[property]
            });
        };

        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumSetAdminGroup.html', {
            scope: $scope
        }).then(function (modal) {
            adminGroupModal = modal;
        });

        $scope.chooseStandard = function (standard) {
            $scope.standard = standard;
        };

        $scope.searchCustomer = function (searchWord) {
              if (!searchWord)
                return;
            $$dataBase.getData('BackendCustomerSearchAuthenGet', {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                searchWord: searchWord
            }).then(function (data) {
                if (data.status == "ok")
                    $scope.customers = JSON.parse(data.content);
            });
        };

        $scope.chooseCustomer = function (customer) {
            if (!customer)
                return;
            $scope.adminData.customerObjectId = customer.objectId;
        }

        $scope.createCommit = function () {
            if (!$scope.adminData.customerObjectId)
                return $$toast("未选择用户", "warning");
            if (!$scope.adminData.level)
                return $$toast("未设置用户权限等级", "warning");

            $$dataBase.getData('BackendCustomerSetGroupGet', {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                waitCustomerObjectId: $scope.adminData.customerObjectId,
                eGroup: $scope.adminData.level
            }).then(function (data) {
                if (data.status === "ok") {
                    adminGroupModal.hide();
                    $$toast(data.content, 'success');
                }
                else
                    $$toast(data.content, 'error');
            }, function (err) {
                $$toast(err || err.content, 'error');
            });
        };

        var _openModal = function (pCargoObjectId) {

            adminGroupModal.show();
        };

        $scope.$on('$destory', function () {
            adminGroupModal.remove();
        });

        return {
            show: _openModal,
        }

    });
});