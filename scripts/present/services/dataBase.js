/*
* @author wk
* @date 2016/6/4
* 统一数据服务接口，暴露给外部调用
* 避免控制器依赖过多数据服务
* 四个服务不可有重名的接口
*/
define(['baseServices'], function (services) {
    services.service('$$dataBase', ['$$commonDatabase', '$$commercialDatabase', '$$cooperationDatabase', '$$frontdeskDatabase', '$rootScope', '$q',
    function ($$commonDatabase, $$commercialDatabase, $$cooperationDatabase, $$frontdeskDatabase, $rootScope, $q) {
        angular.extend(this, $$commonDatabase, $$commercialDatabase, $$cooperationDatabase, $$frontdeskDatabase);
        //Opts的结构
        /*
        opts={
          url:'',
          params:{
        
          },//params，url为$$commonDatabase.getData的参数
          scope:$scope,//传入$scope
          name:'shopList',//绑定到$scope上的字段名称，
          autoShowInfinit:boolen,是否自动显示与隐藏下拉更新，若设为true则需要在下拉更新绑定this.name+“ShowInfinite”字段
          autoRefreshAndLoadMore:boolen,自动在scope上绑定刷新与加载更多函数，函数名：
               {        var refreshFuncName = this.name + "Refresh";
                        var loadMoreFuncName = this.name + "LoadMore";
                        var getOnceFuncName = this.name + "GetOnce";
                }
        //当有autoRefreshAndLoadMore==true时传入这两个参数回掉
        refreshCallback:{
            success:function,
            error:function
        }
        loadMoreCallback:{
           success:function
           error:function
        }
        */
        //example 见foodlistController
        //数据库中的种子，快速获取数据
        //忙碌空闲两个状态;避免异步干扰
        //只有data.status=='ok'才resolve，当data.status!='ok'和断网时才会reject；data.status!='ok'时reject（data）,断网时reject（null）
        var STATE = {
            FREE: 1,
            BUSYING: 2
        }
        var Feed = function (opts) {
            angular.extend(this, {
                url: '',
                params: {},
                scope: {},
                name: '',
                autoShowInfinit: false,
                autoRefreshAndLoadMore: false,
            }, opts);
            //初始状态空闲
            this.state = STATE.FREE;
            //如果autoRefreshAndLoadMore字段为true，则自动在scope上绑定刷新和加载更多方法;
            if (this.autoRefreshAndLoadMore) {
                var refreshFuncName = this.name + "Refresh";
                var loadMoreFuncName = this.name + "LoadMore";
                var getOnceFuncName = this.name + "GetOnce";
                var that = this;
                this.scope[getOnceFuncName] = function () { return that.getOnce(arguments) };
                this.scope[refreshFuncName] = function () {
                    if (that.refreshCallback) {
                        return that.refresh(arguments).then(that.refreshCallback.success || angular.noop, that.refreshCallback.error || angular.noop);
                    }
                    return that.refresh(arguments);
                };
                this.scope[loadMoreFuncName] = function () {
                    if (that.loadMoreCallback) {
                        return that.loadMore(arguments).then(that.loadMoreCallback.success || angular.noop, that.loadMoreCallback.error || angular.noop);
                    }
                    return that.loadMore(arguments);
                };
            }
            this.autoShowInfinit && (this.scope[this.name + 'ShowInfinite'] = true);
            console.log(this);
        }
        //设置参数--不要企图手动变pageNumber
        Feed.prototype.setParam = function (key, value) {
            if (key === 'pageNumber') {
                console.warn('正在企图手动改变pageNumber');
            }
            this.params && (this.params[key] = value);
        }
        //获取参数
        Feed.prototype.getParams = function () {
            return this.params;
        }
        //获取数据
        Feed.prototype.getData = function () {
            return $$commonDatabase.getData(this.url, this.params);
        }
        //普通获取，refresh与loadMore是有pageNumber时才用的方法
        Feed.prototype.getOnce = function () {
            var that = this;
            return this.getData().then(function (data) {
                if (data.status === 'ok') {
                    that.scope[that.name] = JSON.parse(data.content);
                    return that.scope[that.name];
                }
                else {
                    return $q.reject(data);
                }
            }, function (error) {
                return $q.reject(null);
            })
        }
        //刷新数据，pageNumber=1;
        Feed.prototype.refresh = function () {
            console.log('refresh');

            var showInfiniteName = this.name + 'ShowInfinite';
            //刷新时自动显示
            this.autoShowInfinit && (this.scope[showInfiniteName] = true);
            if (this.state === STATE.FREE) {
                //锁死状态，设置pageNumber为0;               
                this.state = STATE.BUSYING;
                this.params.pageNumber = 0;
                console.log(this.params);
                var that = this;
                return this.getData().then(function (data) {
                    if (data.status === 'ok') {
                        //成功pageNumber加1
                        that.params.pageNumber++;
                        that.scope[that.name] = JSON.parse(data.content);
                        return that.scope[that.name];
                    }
                    else {
                        console.log(data);
                        //当没数据时自动将下拉指令隐藏
                        that.autoShowInfinit && (that.scope[showInfiniteName] = false);
                        return $q.reject(data);
                    }
                }, function (error) {
                    console.log(error);
                    //当没网路连接时自动将下拉指令隐藏
                    that.autoShowInfinit && (that.scope[showInfiniteName] = false);
                    return $q.reject(null);

                }).finally(function () {
                    //如果有$broadcast则播发事件
                    console.log(that.name, 'refreshDone')
                    that.scope.$broadcast && that.scope.$broadcast('scroll.refreshComplete');
                    that.state = STATE.FREE;
                });
            }
            else {
                this.scope.$broadcast && this.scope.$broadcast('scroll.refreshComplete');
                return $q.reject('歇一会再刷吧');
            }
        }
        //加载更多，pageNumber++;
        Feed.prototype.loadMore = function () {
            console.log('more');
            console.log(this.scope[showInfiniteName]);
            var showInfiniteName = this.name + 'ShowInfinite';
            if (this.state === STATE.FREE) {
                this.state = STATE.BUSYING;
                var that = this;
                //console.log(this.params.pageNumber);
                console.log(this.name);
                return this.getData().then(function (data) {
                    if (data.status === 'ok') {
                        //成功pageNumber加1
                        that.params.pageNumber++;
                        that.scope[that.name] = that.scope[that.name] || [];
                        that.scope[that.name] = that.scope[that.name].concat(JSON.parse(data.content));
                        return that.scope[that.name];
                    }
                    else {
                        that.autoShowInfinit && (that.scope[showInfiniteName] = false);
                        return $q.reject(data);
                    }
                }, function (error) {
                    //当没网路连接时自动将下拉指令隐藏
                    that.autoShowInfinit && (that.scope[showInfiniteName] = false);
                    return $q.reject(null);
                }).finally(function () {
                    //如果有$broadcast则播发事件
                    that.scope.$broadcast && that.scope.$broadcast('scroll.infiniteScrollComplete');
                    that.state = STATE.FREE;
                })
            }
            else {
                this.scope.$broadcast && this.scope.$broadcast('scroll.infiniteScrollComplete');
                return $q.reject('歇一会再刷吧');;
            }
        }
        this.Feed = Feed;
    }]);
});