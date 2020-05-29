define(['baseFilters', 'objutil'], function (baseFilters, objutil) {
    baseFilters.filter('typeFilter', function () {
        //店铺类型
        var typeShops = {
            '餐饮/美食': 'cyms',
            'cyms': '餐饮/美食',
            '休闲/娱乐': 'xxyl',
            'xxyl': '休闲/娱乐',
            '宾馆/酒店': 'bgjd',
            'bgjd': '宾馆/酒店',
            '服装/鞋帽': 'fzxm',
            'fzxm': '服装/鞋帽',
            '教育/培训': 'jyyl',
            'jyyl': '教育/培训',
            '家居/装饰': 'jjzs',
            'jjzs': '家居/装饰',
            '超市/商店': 'cssd',
            'cssd': '超市/商店',
            '生活/服务': 'shsq',
            'shsq': '生活/服务',
            '土特/鲜活': 'sxtc',
            'sxtc': '土特/鲜活',
            '个护/化妆': 'ghhz',
            'ghhz': '个护/化妆',
            '家用电器': 'jydq',
            'jydq': '家用电器',
            '手机/电脑': 'sjdn',
            'sjdn': '手机/电脑',
            '母婴/童装': 'mytz',
            'mytz': '母婴/童装',
            '珠宝/工艺': 'zbgy',
            'zbgy': '珠宝/工艺',
            '网商/网店': 'wswd',
            'wswd': '网商/网店',
            '交通/出行': 'jtcx',
            'jtcx': '交通/出行',
            '金融/商务': 'jrsw',
            'jrsw': '金融/商务',
            '企业/工厂': 'qygc',
            'qygc': '企业/工厂',
            '党政/社团': 'dzst',
            'dzst': '党政/社团',
            '婚庆/旅游': 'hqly',
            'hqly': '婚庆/旅游',
            '房产/建材': 'fcjj',
            'fcjj': '房产/建材',
            '医疗/药品': 'ylyp',
            'ylyp': '医疗/药品',
            '汽车/维修': 'qcwx',
            'qcwx': '汽车/维修',
            '快递/物流': 'kdwl',
            'kdwl': '快递/物流',
            'dzst': '党政社团',
            '党政社团': 'dzst',
            'jyyl': '教育医疗',
            '教育医疗': 'jyyl',
            'fcjj': '房产家居',
            '房产家居': 'fcjj',
            'sxtc': '生鲜特产',
            '生鲜特产': 'sxtc',
            'cyms': '餐饮酒店',
            '餐饮酒店': 'cyms',
            'shsq': '生活商企',
            '生活商企': 'shsq',
            'lyyl': '旅游娱乐',
            '旅游娱乐': 'lyyl',
            'qtlb': '其他类别',
            '其他类别': 'qtlb',
            '特约超市': 'tycs',
            'tycs': '特约超市',
            'ZXQZ': '咨询求助',
            '咨询求助': 'ZXQZ',
            'XZZL': '寻找招领',
            '寻找招领': 'XZZL',
            '全部': 'all',
        };
        //活动类型
        var typeActivities = {
            '1': "打折",
            '2': "满减",
            '3': "买送"
        };
        //便民类型
        var typeJourmany = {
            'bxcs': '包席厨师',
            'bzfw': '殡葬服务',
            'ptbj': '跑腿搬家',
            'bjhs': '保洁回收',
            'jdwx': '家电维修',
            'gdst': '管道疏通',
            'jyzyjn': '教育/职业技能',
            'kshs': '开锁换锁',
            'hqhz': '婚庆/化妆',
            'bmys': '保姆/月嫂',
            'zsfwxb': '装修/房屋修补',
            'zchy': '租车/货运',
            'xqgg': '稀奇古怪',
            'pchwl': '陪吃喝玩乐'
        };

        var typeMessage = {
            'ZXQZ': '咨询求助',
            'XZZL': '寻找招领',
            'QZH': '求职',
            'ZP': '招聘',
            'QG': '求购',
            'CS': '出售',
            'QZU': '求租',
            'CZ': '出租',
            'PC': '拼车',
            'NCPMM': '农产品买卖',
            'TFSJ': '突发事件公告',
            'QT': '其他'
        };

        var typeTopic = {
            TEXTTOP: '文字置顶',
            TEXTMIDDLE: '文字置中',
            TEXTFOOT: '文字置底',
            //专题样式模版
            TOPICDEFAULT: 'H5纵向滑页板式',
            //跳转类型
            HREFCARGO: '商品',
            HREFSHOP:'店铺',
        };

        var dictionary = {};
        objutil.cover(dictionary, typeShops);
        objutil.cover(dictionary, typeActivities);
        objutil.cover(dictionary, typeJourmany);
        objutil.cover(dictionary, typeMessage)
        objutil.cover(dictionary, typeTopic);

        var typeFilter = function (type) {
            if (type === 'null') {
                return '未知';
            } else {
                return dictionary[type] ? dictionary[type] : '未知类别';
            }
        }

        return typeFilter;
    });
})