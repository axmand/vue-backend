/**
*   
*   目录管理
*  
*/

define(['baseControllers', 'frontdeskService'], function (baseControllers, frontdeskService) {

    baseControllers.controller('categoryManagementController', ['$scope', 'configService', '$$frontdeskService', '$$loginService', '$$toast', '$window',
        function ($scope, configService, $$frontdeskService, $$loginService, $$toast, $window) {

            $scope.imgUrl = configService.urlRequest.imgUrl;


        }]);

});