var CompList = React.createClass({
  render : function () {
    var creatComp = function (comp,i) {
      var hidd = ''
      if (comp.inbox) {
        hidd = ' hiddenx'
      }
      return (
        <div className={"cmp" + hidd}  data-name={comp.name} key={i}>
          <i className={"glyphicon glyphicon-" + comp.classname}></i>
          <span>{comp.name}</span>
        </div>
      )
    }
    return (
      <div id="comps" className={'hiddenx ' + this.props.cs}>
        {this.props.comps.map(creatComp)}
      </div>
    )
  }
})

var CollectBox = React.createClass({
  render : function () {
    var creatTool = function (tool, i) {
      return (
        <div className={"cmp def " + tool.sta} data-name={tool.name} key={i}>
          <i className={"glyphicon glyphicon-" + tool.classname}></i>
        </div>
      )
    }
    var insertBox = function (comp, i) {
      return (
        <div className="cmp" data-name={comp.name} key={i}>
          <i className={"glyphicon glyphicon-" + comp.classname}></i>
          <span>{comp.name}</span>
        </div>
      )
    }
    return (
      <div id="box" className={'hiddenx ' + this.props.cs}>
        {this.props.box.map(insertBox)}
        {this.props.tools.map(creatTool)}
      </div>
    )
  }
})

var DemoApp = React.createClass({
  getInitialState: function() {
    var st = {
        compList : ['个人云','提醒','备忘','资金','排行榜','音乐','邮件','照片'],
        comps: [
          {name : '个人云', classname : 'cloud', inbox : false},
          {name : '提醒', classname : 'time', inbox : false},
          {name : '备忘', classname : 'list-alt', inbox : false},
          {name : '资金', classname : 'yen', inbox : false},
          {name : '排行榜' , classname : 'sort', inbox : false},
          {name : '音乐', classname : 'headphones', inbox : false},
          {name : '邮件', classname : 'envelope', inbox : false},
          {name : '照片', classname : 'picture', inbox : false}
        ],
        ac : '',
        area : {
          star : 'show-inline-block',
          comps : '',
          box : ''
        },
        boxList : [],
        box : [],
        toolList : ['add','reduce','complate'],
        tools : [
          {name : 'add', classname : 'plus', sta : 'active'},
          {name : 'back', classname : 'home', sta : 'active'},
          //{name : 'cancle', classname : 'remove',sta : ''},
          {name : 'complate', classname : 'ok',sta : ''}
        ]
      }
      
    var cookieStore = Cookies.get('demoApp')
    //console.log(cookieStore)
    if (cookieStore) {
      var boxList = cookieStore.split(' ')
      console.log(boxList)
      st.boxList = boxList
      boxList.forEach(function (a) {
        var idx = st.compList.indexOf(a)
        st.box.push(st.comps[idx])
        st.comps[idx].inbox = true
      })
    }
    
    return st
  },
  showIt : function(e){
    e.stopPropagation()
    var astate = this.state
    astate.area.star = ''
    astate.area.box = 'show-block'
    this.setState(astate)
  },
  handleClick : function (e) {
    var t = e.target
      , name = t.getAttribute('data-name')
      , astate = this.state
    if (!name) {
      name = t.parentNode.getAttribute('data-name')
    }
    if (!name) return 
    if (astate.ac !== '') {
      if (name === 'complate') {
        astate.ac = ''
        astate.tools[0].sta = 'active'
        astate.tools[1].sta = 'active'
        astate.tools[2].sta = ''
        astate.area.comps = ''
        this.setState(astate)
      } else if (astate.ac === 'add') {
        var idx = astate.compList.indexOf(name)
        if (astate.comps[idx].inbox) {
          var idx_box = astate.boxList.indexOf(name)
          astate.boxList.splice(idx_box,1)
          astate.box.splice(idx_box,1)
          astate.comps[idx].inbox = false
        } else {
          astate.box.push(astate.comps[idx])
          astate.boxList.push(astate.comps[idx].name)
          astate.comps[idx].inbox = true
        }
        Cookies.set('demoApp', astate.boxList.join(' '))
        this.setState(astate)
      }
    } else {
      if (name === 'add') {
        astate.ac = name
        astate.tools[0].sta = ''
        astate.tools[1].sta = ''
        astate.tools[2].sta = 'active'
        astate.area.comps = 'show-block'
        this.setState(astate)
      } else if ( name === 'back') {
        astate.area.box = ''
        astate.area.star = 'show-inline-block'
        this.setState(astate)
      }
    }
  },
  render : function(){
    return (
      <div onClick={this.handleClick}>
        <div id="star" onClick={this.showIt} className={"hiddenx " + this.state.area.star}>
          <i className="glyphicon glyphicon-star"></i>
          <span>收藏</span>
        </div>
        <CollectBox tools={this.state.tools} box={this.state.box} cs={this.state.area.box}/>
        <CompList  comps={this.state.comps} cs={this.state.area.comps}/>
      </div>
    )
  }
})

ReactDOM.render(<DemoApp />, document.getElementById('demo'))