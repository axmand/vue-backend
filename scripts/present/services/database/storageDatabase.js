/*
 *  仓储功能  --创建分类，管理分类  创建仓库，管理仓库  创建城市列表
 */

define(['baseServices'], function (services) {
    services.service('$$storageDatabase', ['$$commonDatabase','$q',
    function ($$commonDatabase, $q) {
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
        //获取用于展示的城市列表
        this.getCityList = function () {
            var defer = $q.defer();
            var config = $$commonDatabase.getAppConfig();
            var cityList = [];
            this.getCategory(config.EClassifyPattern.CategoryCommercialCity).then(function (data) {
                //整理获取的城市列表,用于展示选择
                data.forEach(function (province, index) {
                    province.children.forEach(function (city, index) {
                        this.push({
                            provinceName: province.name,
                            provinceRegionId: province.regionId,
                            cityName: city.name,
                            cityRegionId: city.regionId
                        });
                    }, cityList);
                });
                defer.resolve(cityList);
            }, function () {
                defer.reject(null);
            });

            return defer.promise;
        }
        //获取用于展示的仓库
        this.getWhuareHouseList = function () {
            var defer = $q.defer();

            var config = $$commonDatabase.getAppConfig();
            var whuareHouseList = [];
            console.log(config);
            this.getCategory(config.ECategory.CommercialWhareHouse).then(function (data) {
                defer.resolve(data);
            }, function () {
                defer.reject(null);
            });

            return defer.promise;
        }
        //新建一个分类节点
        this.postCategory = function (content) {
            var defer = $q.defer();
            $$commonDatabase.postData('BackendCommonCreateCategoryPost', content).then(function (data) {
                if (data.status == 'ok')
                    defer.resolve(data.content);
                else
                    defer.reject(data.content);
            }, function (err) {
                //}{hk debug
                defer.reject("网络错误");
            });
            return defer.promise;
        }
        //修改类目
        this.modifyCategory = function (content) {
            var appConfig = $$commonDatabase.getAppConfig();
            content = content || {};
            content.modifyType = appConfig.EModifyType.Category;
            var defer = $q.defer();
            $$commonDatabase.postData('BackendCommonCreateCategoryPost', content).then(function (data) {
                if (data.status == 'ok')
                    defer.resolve(data.content);
                else
                    defer.reject(data.content);
            }, function (err) {
                //}{hk debug
                defer.reject("网络错误");
            });
            return defer.promise;
        }
    }]);
})