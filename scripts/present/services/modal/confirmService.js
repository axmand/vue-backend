/**
*   弹出框Modal
*   @module confirmService
*   
*/
define(['baseServices'], function (baseServices) {
    baseServices.service('$$confirmService', ['$$bootstrapModal', '$rootScope', '$$dataBase','$q',
        function ($$bootstrapModal, $rootScope, $$dataBase, $q) {
            var $scope = $rootScope.$new();
            //确认弹框
            var confirmModal = {};
            //对话框显示文本
            $scope.modalText = '';
            //modal加载
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumConfrimModal.html', {
                scope: $scope
            }).then(function (modal) {
                confirmModal = modal;
            });
            var defer;
            //显示modal,同时刷新shoplist获取
            var openModal = function (text) {
                defer = $q.defer();
                $scope.modalText = text || '您确定要处理这条信息吗？';
                confirmModal.show();
                return defer.promise;
            };
            //
            $scope.confirm = function () {
                confirmModal.hide();
                defer.resolve();
            };
            //
            $scope.cancel = function () {
                confirmModal.hide();
                defer.reject();
            };
            //销毁modal
            $scope.$on('$destroy', function () {
                confirmModal.remove();
            });

            return {
                show: openModal
            }
        }]);
});