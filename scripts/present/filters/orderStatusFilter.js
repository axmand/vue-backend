define(['baseFilters'], function (baseFilters) {

    var actFilter = baseFilters.filter('orderStatusFilter', function () {
        var orderStatus = function (status) {
            var _result = status * 1;
            var text = "正在加载...";
            if (_result < 0) {
                text = '订单异常';
            } else if (_result == 1) {
                text = '待付款';
            } else if (_result == 21) {
                text = '已付款';
            } else if (_result == 31) {
                text = '已发货';
            } else if (_result == 41) {
                text = '退货中';
            } else if (_result == 51) {
                text = '退款中';
            } else if (_result == 61) {
                text = '退款完成';
            } else if (_result == 71) {
                text = '退款失败';
            } else if (_result == 81) {
                text = '订单完成';
            } else if (_result == 91) {
                text = '订单关闭';
            };
            return text || '未知状态';
        }
        return orderStatus;
    }).filter('cargoStatusFilter', function () {
        var orderStatus = function (status) {
            var _result = status * 1;
            if (_result == 1) {
                text = '待发货';
            } else if (_result == 11) {
                text = '已发货';
            } else if (_result == 12) {
                text = '已评论';
            } else if (_result == 21) {
                text = '申请退货';
            } else if (_result == 22) {
                text = '同意申请退货';
            } else if (_result == 23) {
                text = '退货中';
            } else if (_result == 26) {
                text = '已退货';
            } else if (_result == 31) {
                text = '退款状态';
            } else if (_result == 41) {
                text = '协商处理';
            } else if (_result == 42) {
                text = '已退款';
            };
            return text || '未知状态';
        }
        return orderStatus;
    });
})