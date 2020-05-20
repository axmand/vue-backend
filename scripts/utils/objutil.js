/**
*   提供对象的基本功能 ,包括继承,判断等
*   @author }{hk date 2014/10/14
*   @class objectUtils
*/
define(function () {

    var _objUtil = function () {

    }

    //将Date对象改为 2016/8/10 样式字符串
    Date.prototype.stringToCommon = function () {
        var year = this.getFullYear();
        var month = this.getMonth()+1;
        var day = this.getDate();
        
        return year + '/' + month + '/' + day;
    }

    //格式化字符串显示
    String.prototype.format = function (args) {
        var result = this;
        if (arguments.length < 1) {
            return result;
        }
        var data = arguments;        //如果模板参数是数组
        if (arguments.length == 1 && typeof (args) == "object") {
            //如果模板参数是对象
            data = args;
        }
        for (var key in data) {
            var value = data[key];
            if (undefined != value) {
                result = result.replace("{" + key + "}", value);
            }
        }
        return result;
    }

    //生成随机字符
    _objUtil.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).replace('-', '');
        });
    }
    //获取设备唯一标识码
    _objUtil.getFingerprint = function () {
        if (!this.getData('guid')) {
            this.storeData('guid', this.guid());
        }
        return this.getData('guid');
    }

    _objUtil.extend = function (child, parent) {
        for (var key in parent.prototype) {
            if (!(key in child.prototype)) {
                child.prototype[key] = parent.prototype[key];
            }
        }
        child.__super__ = parent.prototype;
        return child;
    }
    //父类属性覆盖子类属性
    _objUtil.cover = function (child, parent) {
        for (var key in parent) {
                child[key] = parent[key];
        }
    }

    _objUtil.isArray = Array.isArray;

    /**
    *   判断是否为object对象
    *   参考自underscore
    *   http://www.css88.com/doc/underscore/docs/underscore.html
    */
    _objUtil.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    /**
    *   判断是否为string
    *   参考自underscore
    *   http://www.css88.com/doc/underscore/docs/underscore.html
    */
    _objUtil.isString = function (obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
    *   存放数据
    */
    _objUtil.storeData = function (key, object) {
        var value = '';
        if (_objUtil.isObject(object)) {
            value = JSON.stringify(object);
        } else {
            value = object;
        }
        localStorage.setItem(key, value);
        return value;
    }
    /**
    *   获取数据
    */
    _objUtil.getData = function (key) {
        var value = localStorage.getItem(key);
        try {
            var obj = JSON.parse(value);
            return obj;
        }
        catch (e) {
            return value;
        }
    }
    /**
    *   @method 浅拷贝对象
    */
    _objUtil.clone = function (obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    };

    _objUtil.toArray = function (obj) {
        var _array=[];
        if (_objUtil.isObject(obj)) {
            for (var element in obj)
                _array.push(element);
        }
        else
            _array = null;
        return _array;
    }
    return _objUtil;
});