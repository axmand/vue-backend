define(['baseServices'], function (baseServices) {
    baseServices.factory('groupService', ['$http', function ($http) {
        //商家菜单
        var commercial = {
            text: "商户管理",
            items: [{
                text: "店铺管理",
                href: "#/main/commercial/shop"
            },
            {
                text: "商品管理",
                href: "#/main/commercial/cargo"
            },
            {
                text: "活动管理",
                href: "#/main/commercial/activity"
            },
            {
                text: "订单管理",
                href: "#/main/commercial/order"
            },
            {
                text: "查看对我的评论",
                href: "#/main/commercial/review"
            }]
        };
        //合作分站管理
        var cooperation = {
            text: "合作管理",
            items: [
                {
                    text: "商户管理",
                    href: "#/main/cooperation/shop"
                },
                {
                    text: "工匠管理",
                    href: "#/main/cooperation/worker"

                },
                {
                    text: "便民审核",
                    href: "#/main/cooperation/audit"
                },
                {
                    text: "专题发布",
                    href: "#/main/cooperation/publishTopic"
                },
                {
                    text: "视频发布",
                    href: "#/main/cooperation/publishVideo"
                },
                {
                    text: "公告发布",
                    href: "#/main/cooperation/publishAnno"
                },
                {
                    text: "特约超市",
                    href: "#/main/cooperation/superMarket"
                }]
        };
        //总服务台
        var frontdesk = {
            text: "总服务台",
            items: [
                {
                    text: "分站管理",
                    href: "#/main/frontdesk/branchManagement"
                }]
        };
        //平台自营
        var selfsupport = {
            text: "自营商城",
            items:
                [
                {
                    text: "商品管理",
                    href: "#/main/selfsupport/selfsupportCargo"
                },]
        };
        //包含所有类型-总管理员
        var _adminGroup = [];
        _adminGroup.push(frontdesk);
        //自营商城管理员
        var _selfGroup = [];
        _selfGroup.push(selfsupport);
        //店铺管理员
        var _commercialGroup = [];
        _commercialGroup.push(commercial);
        //分站管理员
        var _cooperationGroup = [];
        _cooperationGroup.push(cooperation);

        return {
            getGroups: function (typeLevel) {
                //var typeLevel = typeLevel * 1;
                var typeLevel = 99;
                if (typeLevel === 99)
                    return _adminGroup;
                else if (typeLevel === 91)
                    return _cooperationGroup;
                else if (typeLevel === 39)
                    return _selfGroup;
                else if (typeLevel === -1 || typeLevel === 1 || typeLevel === 11 || typeLevel == 12)
                    return _commercialGroup;
                return null;
            }
        }
    }]);
});