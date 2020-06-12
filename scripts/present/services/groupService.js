define(['baseServices'], function (baseServices) {
    baseServices.factory('groupService', ['$http', function ($http) {       
        //地块管理
        var commercial = {
            text: "地块管理",
            items: [{
                text: "地块管理",
                href: "#/main/commercial/dikuai"
            },
            {
                text: "商品管理",
                href: "#/main/commercial/cargo"
            }]
        };
        //楼宇管理
        var cooperation = {
            text: "楼宇管理",
            items: [
                {
                    text: "商户管理",
                    href: "#/main/cooperation/shop"
                }]
        };
        //用户管理
        var frontdesk = {
            text: "业务管理",
            items: [
                {
                    text: "地块管理",
                    href: "#/main/commercial/dikuai"
                },
                {
                    text: "楼宇管理",
                    href: "#/main/cooperation/shop"
                },
                {
                    text: "政策管理",
                    href: "#/main/selfsupport/selfsupportCargo"
                },]
        };
        var frontdesk1 = {
            text: "用户管理",
            items: [
                {
                    text: "用户管理",
                    href: "#/main/frontdesk/branchManagement"
                }],
        };
        //政策管理
        var selfsupport = {
            text: "政策管理",
            items:
                [
                {
                    text: "政策管理",
                    href: "#/main/selfsupport/selfsupportCargo"
                },]
        };
        //用户管理员
        var _adminGroup = [];
        _adminGroup.push(frontdesk);
        _adminGroup.push(frontdesk1);
        //政策管理员
        var _selfGroup = [];
        _selfGroup.push(selfsupport);
        //地块管理员
        var _commercialGroup = [];
        _commercialGroup.push(commercial);
        //楼宇管理员
        var _cooperationGroup = [];
       _cooperationGroup.push(cooperation);

        return {
            getGroups: function (typeLevel) {
                var typeLevel = typeLevel * 1;
               // var typeLevel = 99;
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