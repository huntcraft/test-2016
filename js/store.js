var fake_store = {
  id : 'config_1',  // id在修改的时候有用
  role : 'administrator',  // 默认每个岗位可以有多个配置，在不同情况下激活不同配置
  componentList : [   // 用于查找 components
    'comp_active',
    'comp_1',
    'comp_3',
    'comp_4',
    'comp_6',
    'comp_7',
    'comp_8'
  ],
  components : [{
    id: 'comp_active',
    type:'d_active'
  },{  // 组件之间是可以无序的，在gridBody里按配置的顺序加载
    id: 'comp_1',
    type:'d_default',
    title:'最近访客',
    url:'http://cmb.com/api/ddk'
  },{
    id: 'comp_3',
    type:'d_default',
    title:'PaaS 流量',
    url:'http://cmb.com/api/ddk'
  },{
    id: 'comp_4',
    type:'d_default',
    title:'通讯录',
    url:'http://cmb.com/api/ddk'
  },{
    id: 'comp_6',
    type:'d_default',
    title:'组件S',
    url:'http://cmb.com/api/ddk'
  },{
    id: 'comp_7',
    type:'d_default',
    title:'组件K',
    url:'http://cmb.com/api/ddk'
  },{
    id: 'comp_8',
    type:'d_default',
    title:'组件H',
    url:'http://cmb.com/api/ddk'
  },
    // {
    //   id : 'comp_9',
    //   type : 'd_tabs',
    //   tabList : ['标签1','标签2'],
    //   urlList : ['http://rc1.cmb.com/api/fo1','http://rc2.cmb.com/api/fo2']
    // }
  ],
  gridBody : [    // 默认对应各频道中的排列情况
    [
      [4,8],
      [12],
      [6,6]
    ],
    [
      [4,8],
      [12],
      [6,6]
    ]
  ],
  bodyList : [[
    ['comp_1','comp_4'],  // gridBody[0][0][0]
    ['comp_3'],          // gridBody[0][0][1]
    ['comp_6','comp_7'],  // gridBody[0][1][0]
    [],                   // gridBody[0][2][0]
    ['comp_8']            // gridBody[0][2][1]
  ]],
  gridHeader : {
    image : 'http://img.cmb.com/a.jpg',
    title : '区域经理管理平台',
    channelList : ['频道1','频道2','频道3']
  },
  gridFooter : {
    copyright : '&copy; 2016 招商银行'
  },
  css : '#abc{position:absolute;}',

  //运行状态
  active: true,   // 在数据库里保存为时间戳，客户登录时，按这时间排序，使用最新的，
  currentChannel : '频道2'
}
