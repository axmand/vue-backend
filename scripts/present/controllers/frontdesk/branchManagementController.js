/**
*   用户管理
*   @author hk date 2016/4/14
*/

define(['baseControllers', 'frontdeskService'], function (baseControllers, frontdeskService) {

    baseControllers.controller('branchManagementController', function ($scope, $$frontdeskService, $ionicScrollDelegate, $$toast, $$confirmModal) {

        $scope.searchAccountWord = null;
        $scope.account = null;
        $scope.adminData = {};

        var pageNumber = 1;

        //创建管理员modal
        $scope.openBranchModal = function () {
            $scope.userBranchData = {
                regionName: "",
                regionId: "",
                mandatedObjectId: "",
                descripiton:""
            };
            $('#branchModal').modal('show');
        }
        //设置用户组账户modal
        $scope.openAdminModal = function (userBranch) {
            console.log(userBranch);
            
            $scope.adminData = {
                mandatedName: userBranch.mandatedName||'',
                mandatedMailAddress: userBranch.mandatedMailAddress || '',
                mandatedPhone: userBranch.mandatedPhone || '',
                branchObjectId: userBranch.objectId
            }
            $('#adminModal').modal('show');          
        }

        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                refreshBranch();
            }
        });

        var refreshBranch = function () {
            $$frontdeskService.getBranchList(0).then(function (data) {
                $scope.userBranchs = data;
            }, function (err) {
                $$toast(err, 'error');
            });
            pageNumber = 1;
        };

        $scope.showMoreBranch = function () {
            $$frontdeskService.getBranchList(pageNumber).then(function (data) {
                pageNumber++;
                $scope.userBranchs = $scope.userBranchs.concat(data);
                $ionicScrollDelegate.resize();
            }, function (err) {
                $$toast(err, 'error');
            });
        }
        //设置分站站长账户
        $scope.setBranchAdmin = function () {
            var _adminData = $scope.adminData;
            if (_adminData.mandatedName == "" || _adminData.mandatedMailAddress == "") {
                $$toast('请补全字段', 'warning');
                return 
            }

            console.log(_adminData);
            $$frontdeskService.setBranchAdmin(_adminData.mandatedName, _adminData.mandatedMailAddress, _adminData.mandatedPhone, _adminData.branchObjectId)
            .then(function (data) {
                $$toast(data, 'success');
                refreshBranch();
                $('#adminModal').modal('hide');
            }, function (err) {
                $$toast(err, 'error');
            })
        }

        $scope.submitBranch = function () {
            if ($scope.userBranchData.regionName == "" || $scope.userBranchData.regionId == "") {
                console.log("请补全 regionName 和 regionId后提交");
                
                return $$toast('请补全分站信息', 'warning');
            }

            $$frontdeskService.postBranchInfo($scope.userBranchData).then(function (data) {
                $('#branchModal').modal('hide');
                refreshBranch();
                $$toast(data, 'success');
            }, function (err) {
                $$toast(err, 'error');
            });
        }

        $scope.searchUserAccount = function () {
            var keyword = $scope.searchAccountWord;
            if (keyword == null||keyword=="") {
                $scope.account = null;
            } else {
                $$frontdeskService.getSearchAccount(keyword, 0).then(function (data) {
                    if (data.status == 'ok') {
                        var accounts = JSON.parse(data.content);
                        $scope.account = accounts[0] || {};
                    }
                });
            }
        }

        $scope.deleteBranch = function (branch) {
            $$confirmModal('确认删除此分站？').then(function () {
                $$frontdeskService.postDeleteBranch(branch).then(function (data) {
                    refreshBranch();
                    $$toast(data, 'success');
                }, function (err) {
                    $$toast(err, 'error');
                });
            }) 
        }

    });

});