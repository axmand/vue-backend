define(['baseServices'], function (baseServices) {
    baseServices.factory('groupService', ['$http', function ($http) {
        //商家菜单
        var commercial = {
            text: "商品店铺维护",
            items: [{
                text: "店铺管理",
                href: "#/main/commercial/shop"
            },
            {
                text: "商品管理",
                href: "#/main/commercial/cargo"
            },
            {
                text: "订单管理",
                href: "#/main/commercial/order"
            }]
        };
        //日常活动维护管理
        var daily = {
            text: "商城活动维护",
            items: [{
                text: "口令活动",
                href: "#/main/daily/passwordActivity"
            },{
                text: "头条广告",
                href: "#/main/daily/banner"
            }, {
                text: "今日团购",
                href: "#/main/daily/groupPurchase"
            }, {
                text: "今日特惠",
                href: "#/main/daily/exPurchase"
            }, {
                text: "视频发布",
                href: "#/main/daily/video"
            }, {
                text: "专题发布",
                href: "#/main/daily/topic"
            }, {
                text: "货架管理",
                href: "#/main/daily/shelf"
            }, {
                text: "新品评审",
                href: "#/main/daily/appraisal"
            }]
        };
        //统计
        var statistic = {
            text: "统计",
            items: [{
                text: '销售统计',
                href: '#/main/statistic/sell',
            }]
        };
        //仓储
        var store = {
            text: "仓储管理",
            items: [{
                text: '分类管理',
                href: '#/main/storage/type'
            }, {
                text: '仓库管理',
                href: '#/main/storage/storehouse'
            }, {
                text: '城市管理',
                href: '#/main/storage/city'
            }, ]
        };
        //通用侧边栏
        var generic = {
            text: "文件管理",
            items: [{
                text: "上传图片管理",
                href: ""
            },
            {
                text: "图片使用统计",
                href: ""
            }]
        };
        //代理商
        var delegate = {
            text: '代理商管理',
            items: [{
                text: '代理店铺',
                href: '#/main/delegate/delegateShop'
            }]
        };
        //供应商
        var supply = {
            text: '供应商',
            items: [{
                text: '供应商店铺',
                href:'#/main/supply/supplyShop'
            }]
        }
        //社区
        var community = {
            text: '社区活动维护',
            items: [{
                text: '定时送鲜',
                href: '#/main/community/dssx'
            }, {
                text: '社区热菜',
                href: '#/main/community/sqrc'
            }, {
                text: '社区专享',
                href: '#/main/community/sqzx'
            }, {
                text: '私房菜',
                href: '#/main/community/privateFood'
            }, {
                text: "今日团购",
                href: "#/main/community/groupPurchase"
            }, {
                text: "今日特惠",
                href: "#/main/community/exBuyList"
            }]
        };
        //卡券
        var card = {
            text: '卡券管理',
            items: [{
                text: '储值卡管理',
                href: '#/main/verification/card',
            }, {
                text: '优惠券管理',
                href: '#/main/verification/ticket'
            }]
        };

        var account = {
            text: '账户管理',
            items: [{
                text: '管理组',
                href: '#/main/account/accountGroup',
            }]
        }

        var _testGroup = [];
        _testGroup.push(commercial);
        _testGroup.push(daily);
        _testGroup.push(community);
        _testGroup.push(card);
        _testGroup.push(store);
        _testGroup.push(account);

        var _delegateGroup = [];
        _delegateGroup.push(delegate);

        var _supplyGroup = [];
        _supplyGroup.push(supply);

        /*
            代理 -- 11
            供应 -- 12
            客服 -- 31
            运营 -- 39
            分站管理 -- 91
            总管理 -- 99
        */


        return {
            getGroups: function (typeLevel) {
                var typeLevel = typeLevel * 1;
                if (typeLevel === 99)
                    return _testGroup;
                else if (typeLevel === 11)
                    return _delegateGroup;
                else if (typeLevel === 12)
                    return _supplyGroup;
                else if (typeLevel==39) {
                    return [{
                        text: "商户管理",
                        items: [{
                            text: "店铺管理",
                            href: "#/main/commercial/shop"
                        },
                        {
                            text: "商品管理",
                            href: "#/main/commercial/cargo"
                        }]
                    }, daily];
                } else if (typeLevel == 31) {
                    return [{
                        text: "商户管理",
                        items: [{
                            text: "订单管理",
                            href: "#/main/commercial/order"
                        }, {
                            text: '评审订单管理',
                            href: "#/main/commercial/appraisalOrder"
                        }]
                    }]
                }
                return null;
            }
        }
    }]);

});