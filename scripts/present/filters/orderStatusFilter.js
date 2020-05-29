define(['baseFilters'], function (baseFilters) {

    var actFilter = baseFilters.filter('orderStatusFilter', function () {
        var orderStatus = function (status, flag) {
            var _result = status * 1;
            if (_result < 0 && !flag) {
                text = '已完成';
            } else if (_result < 0 && flag) {
                text = '已评价';
            } else if (_result == 1) {
                text = '待付款';
            } else if (_result == 11) {
                text = '付款失败';
            } else if (_result == 21) {
                text = '已付款';
            } else if (_result == 22) {
                text = '付款金额错误';
            } else if (_result == 31) {
                text = '已配货';
            } else if (_result == 32) {
                text = '已发货';
            } else if (_result == 41) {
                text = '退货';
            } else if (_result == 51) {
                text = '换货';
            } else if (_result == 61) {
                text = '待退款';
            }else if (_result == 62) {
                text = '退款中';
            } else if (_result == 63) {
                text = '退款失败';
            } else if (_result == 64) {
                text = '退款成功';
            } else if (_result == 71) {
                text = '收货';
            } else if (_result == 81) {
                text = '订单完成';
            } else if (_result == 82) {
                text = '订单关闭';
            };
            return text||'未知状态';
        }

        return orderStatus;

    });
})