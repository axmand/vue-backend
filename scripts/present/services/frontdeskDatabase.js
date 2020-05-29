define(['baseServices'], function (services) {
    services.service('$$frontdeskDatabase', ['$$commonDatabase', '$rootScope', '$q', function ($$commonDatabase, $rootScope, $q) {
        //获取分类
        this.getCategory = function (eCategory) {
            var defer = $q.defer();
            $$commonDatabase.getData('BackendCommonCategoryGet', { eCategory: eCategory }).then(function (data) {
                if (data.status == 'ok')
                    defer.resolve(JSON.parse(data.content));
                else
                    defer.reject(data.content);
            }, function (err) {
                //}{hk debug
                defer.reject("网络错误");
            });
            return defer.promise;
        };
    }]);
});