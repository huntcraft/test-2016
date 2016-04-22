
/* app */
var TemplateGrid = React.createClass({
  render : function () {
    return (
      <div>
        <TempHeader />
        <TempChannelList />
        <TempFooter />
      </div>
    )
  }
})

var TempHeader = React.createClass({
  render : function () {
    return (
      <div id="dt-header">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <span id="dt-logo">M</span>
              <span id="dt-title">管理平台</span>
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-2">
              <div id="user-info">
                <div className="info-unit" data-toggle="tooltip" data-placement="left" title={store.position}>
                  <i className="glyphicon glyphicon-user"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

var TempChannelList = React.createClass({
  componentDidMount : function () {
    ievent.on('select.template', this.process)
    //ievent.on('store.update', this.process)
  },
  componentWillUnmount : function () {
  },
  componentDidUpdate : function () {
    if (this.state.gridBody.length !== 0) {
      ievent.emit('playground.complate')
    }
  },
  process : function () {
    this.state.gridBody = store.gridBody[0]
    this.setState(this.state)
  },
  getInitialState: function() {
    return {
      gridBody: store.gridBody[0]
    }
  },
  render : function () {
    var kk = 0
      , gridbody = []

    this.state.gridBody.forEach(function (item, i) {
      var v = kk
      kk = kk + item.length
      gridbody.push(<TempRow data={item} idx={i} dix={v} key={i} />)
    })

    if (gridbody.length === 0) {
      gridbody.push(<TplList key="tplList-show"/>)
    }

    return (
      <div className="tab-content">
        <div className="tab-pane active" id="ch-1">
          <div className="container">
            {gridbody}
          </div>
        </div>
      </div>
    )
  }
})

var TempRow = React.createClass({
  getInitialState: function() {
    return {
      idx : this.props.idx,
      data : this.props.data
    }
  },
  storeUpdate : function (e) {
    this.setState(this.state)
  },
  componentDidUpdate : function () {
    ievent.emit('template.update')
  },
  componentDidMount : function () {
    ievent.on('store.update', this.storeUpdate)
  },
  render : function () {
    var tempAreas = []
      , ddx = this.props.dix

    this.state.data.forEach(function (item, i) {
      tempAreas.push(<TempArea data={item} idx={ddx + i} key={i} />)
    })

    return (
      <div className="row grid-row">
        {tempAreas}
      </div>
    )
  }
})

var TempArea = React.createClass({
  getInitialState : function() {
    return {
      idx : this.props.idx,
      data : this.props.data,
      content : store.bodyList[0][this.props.idx]
    }
  },
  render : function () {
    var tempUnits = []
      , self = this
    this.state.content.forEach(function (item, i) {
      tempUnits.push(<TempUnit data={item} key={item} area={self.props.idx} idx={i}/>)
    })
    if (tempUnits.length === 0) {
      tempUnits.push(<div className="comp-default" key="comp_default"/>)
    }
    return (
      <div className={"temp-area col-md-"+this.props.data} >
        {tempUnits}
      </div>
    )
  }
})

var TempUnit = React.createClass({
  remove : function (e) {
    e.stopPropagation()
    var idx = store.componentList.indexOf(this.props.data)
    store.componentList.splice(idx, 1)
    store.components.splice(idx, 1)
    store.bodyList[0][this.props.area].splice(this.props.idx, 1)
    ievent.emit('store.update')
  },
  config : function (e) {
    e.stopPropagation()
    ievent.emit('component.config', store.bodyList[0][this.props.area][this.props.idx])
  },
  mdown : function (e) {
    e.stopPropagation()
  },
  render : function () {
    var cList = store.componentList
      , idx = cList.indexOf(this.props.data)
      , comps = store.components[idx]

    if(comps.type === 'd_default') {
      return (
        <div className="panel panel-default" id={this.props.data}>
          <div className="panel-heading ui-heading">
            <h3 className="panel-title">{comps.title}</h3>
            <div className="btn-group pull-right">
              <span className="glyphicon glyphicon-remove" onClick={this.remove} onMouseDown={this.mdown}></span>
              <span className="ui-placeholder"></span>
              <span className="glyphicon glyphicon-cog" onClick={this.config} onMouseDown={this.mdown}></span>
            </div>
          </div>
          <div className="panel-body"></div>
        </div>
      )
    } else if(comps.type === 'd_active') {
      return (
        <div className="comp-active" ></div>
      )
    }
  }
})

var TempFooter = React.createClass({
  render : function () {
    return (
      <div id="dt-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              &copy; 2016 招商银行
            </div>
          </div>
        </div>
      </div>
    )
  }
})

var TplList = React.createClass({
  ck : function (e) {
    var data = e.target.getAttribute('data-name')
      , idx = store.tempList.indexOf(data)
      , def_bodyList = []
    store.gridBody[0] = store.templates[idx].value
    store.templates[idx].value.forEach(function (item) {
      for (var i = 0; i < item.length; i++) {
        def_bodyList.push([])
      }
    })
    //store.id = data
    store.bodyList[0] = def_bodyList
    ievent.emit('select.template')
  },
  render : function () {
    var list = []
      , data = store.templates
      , self = this
    data.forEach(function (item, i) {
      list.push(
        <div className="tplList-1" key={i} >
          <span className="tplList-id">{i + 1}</span>
          <span className="tplList-name">{item.note}</span>
          <span className="tplList-date">{item.datex}</span>
          <span className="tplList-ac" onClick={self.ck} data-name={item.id}>选择</span>
        </div>
      )
    })
    if(list.length === 0){
      list.push(<div className="tplList-1"><span>没有模板信息，请先添加！</span></div>)
    }
    return (
      <div id="tplList-show">
        <div key="notice" className="conf-notice">请先选择要使用的模板</div>
        {list}
      </div>
    )
  }
})

var CompList = React.createClass({
  render : function () {
    var compitems = []
    store.comps.forEach(function (item,i) {
      compitems.push(<CompItem data={item} key={i} />)
    })
    return (
      <div>
        {compitems}
      </div>
    )
  }
})

var CompItem = React.createClass({
  render : function () {
    return (
      <div className="subComp" title={this.props.data.title} data-type={this.props.data.type}>
        <i className={this.props.data.icon}></i>
      </div>
    )
  }
})

var Toolbar = React.createClass({
  getInitialState : function() {
    return {
      show : 'main',
      compId : -1
    }
  },
  close : function () {
    this.state.show = 'main'
    this.setState(this.state)
  },
  save : function () {
    var componentList = store.componentList.slice(1)
      , components = store.components.slice(1)
      , bodyList = store.bodyList
      , gridBody = store.gridBody
      , data = {
          componentList : componentList,
          components : components,
          bodyList : bodyList,
          gridBody : gridBody,
        }
      , data_json = JSON.stringify(data)
    $.ajax({
      url : '/conf',
      type : 'POST',
      dataType : 'JSON',
      data : {
        action : store.action,
        position : store.position,
        id : store.id,
        content: data_json
      },
      success : function (data) {
        if (data.msg == 'success' && data.ac == 'new') {
          store.id = data.id
          store.action = 'edit'
        }
      }
    })
    //console.log(data);
  },
  componentDidMount : function () {
    ievent.on('component.config', this.updateConfig)
    if (this.state.show === 'main') {
      this.refs.inputdd.value = store.position
    }
  },
  componentDidUpdate : function () {
    if (this.state.show === 'main') {
      this.refs.inputdd.value = store.position
    }
  },
  updateConfig : function (data) {
    this.state.show = 'config'
    this.state.compId = data
    this.setState(this.state)
  },
  focus : function () {
    this.refs.inputrr.classList.add('active')
  },
  blur : function () {
    this.refs.inputrr.classList.remove('active')
  },
  inputChange : function () {
    store.position = this.refs.inputdd.value
  },
  render : function () {
    if (this.state.show === 'main') {
      return (
        <div className="tb-container">
          <div className="tb-divider-1"></div>
          <div className="tb-inputrow" ref="inputrr">
            <label htmlFor="toolbar-input-dd">岗位 :</label>
            <input ref="inputdd" type="text" className="tb-input-1"
              id="toolbar-input-dd"
              onChange={this.inputChange}
              onBlur={this.blur}
              onFocus={this.focus}/>
          </div>
          <div className="tpl-buttonBar">
            <div className="tpl-save" onClick={this.save}>保存</div>
          </div>
        </div>
      )
    } else if (this.state.show === 'config') {
      var inputRows = []
          // idd 在components 里的索引，可以找到对应的组件的配置
        , idd = store.componentList.indexOf(this.state.compId)

      store.compConfigs.forEach(function (item,i) {
        inputRows.push(<ToolbarInput data={item} key={i} idx={idd} />)
      })

      return (
        <div className="tb-container">
          <div className="tb-divider-1"></div>
          {inputRows}
          <div className="tpl-buttonBar">
            <div className="tpl-close" onClick={this.close}>关闭</div>
          </div>
        </div>
      )
    }
  }
})

var ToolbarInput = React.createClass({
  inputChange : function () {
    store.components[this.props.idx][this.props.data.type] = this.refs.input.value
    ievent.emit('store.update')
  },
  componentDidMount : function () {
    this.refs.input.value = store.components[this.props.idx][this.props.data.type]
    //ievent.on('store.tpl.update', this.updateX)
  },
  componentDidUpdate : function () {
    this.refs.input.value = store.components[this.props.idx][this.props.data.type]
  },
  render : function () {
    return (
      <div className="tb-inputrow">
        <label htmlFor={"toolbar-input-" + this.props.data.type}>{this.props.data.name} :</label>
        <input ref="input" type="text" className="tb-input-1" id={"toolbar-input-" + this.props.data.type} onChange={this.inputChange}/>
      </div>
    )
  }
})

var myApp = (function ($, store) {
  function init() {
    if (store.action === 'new' || store.action === 'edit') {
      myApp.playground.init()
    } else if (store.action === 'list') {
      myApp.confList.init()
    }
    myApp.menulist.init()
    myApp.toolbar.init()
  }

  return {init : init}
})(window.jQuery, store)

myApp.playground = (function ($, store) {
  function init() {
    ReactDOM.render(
      <TemplateGrid />,
      document.getElementById('conf-playground')
    )
  }

  return {init : init}
})(window.jQuery, store)

myApp.menulist = (function ($, store) {
  function init() {
    if (store.action === 'new' || store.action === 'edit') {
      ievent.on('playground.complate', load)
    }
  }

  function load() {
    ReactDOM.render(
      <CompList />,
      document.getElementById('subMenu')
    )
  }

  return {init : init}
})(window.jQuery, store)

myApp.toolbar = (function ($, store) {
  function init() {
    ReactDOM.render(
      <Toolbar />,
      document.getElementById('toolbar')
    )
  }

  return {init : init}
})(window.jQuery, store)

$(document).ready(function () {
  myApp.init()
})
