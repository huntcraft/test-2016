// var store = (function ($) {
//
// })(window.jQuery)
var TemplateGrid = React.createClass({
  componentDidMount : function () {
    ievent.emit('react.complate')
  },
  render : function () {
    return (
      <div>
        <TempHeader />
        <TempChannelList gridBody={this.props.datas.gridBody[0]}/>
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
                <i className="glyphicon glyphicon-user"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

var TempChannelList = React.createClass({
  render : function () {
    var kk = 0
    function createRow(item,i) {
      var v = kk
      kk = kk + item.length
      return (
        <TempRow item={item} idx={i}  dix={v} key={i}/>
      )
    }
    return (
      <div className="tab-content">
        <div className="tab-pane active" id="ch-1">
          {this.props.gridBody.map(createRow)}
        </div>
      </div>
    )
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

var TempRow = React.createClass({
  getInitialState: function() {
    return {idx:this.props.idx,item:this.props.item}
  },
  storeUpdate : function (e) {
    this.setState(this.state)
  },
  componentDidMount : function () {
    ievent.on('store.update', this.storeUpdate)
    //var tt = this.storeUpdate
    // 延迟执行
    // setTimeout(function () {
    //   ievent.on('store.update', tt)
    // },0)
  },
  render : function () {
    var ddx = this.props.dix
    function createArea(item,i) {
      function createUnit(item,i){
        var idx = this.componentList.indexOf(item)
        if(this.components[idx].type === 'd_default') {
          return (
            <div className="panel panel-default" key={i} id={item}>
              <div className="panel-heading ui-heading">
                <h3 className="panel-title">{this.components[idx].title}</h3>
                <div className="btn-group pull-right">
                  <span className="glyphicon glyphicon-remove"></span>
                  <span className="ui-placeholder"></span>
                  <span className="glyphicon glyphicon-cog"></span>
                </div>
              </div>
              <div className="panel-body"></div>
            </div>
          )
        } else if(this.components[idx].type === 'd_active') {
          return (
            <div className="comp-active" key={"d_active"}></div>
          )
        }
      }
      var bodyList = fake_store.bodyList[0][ddx]  //['idx_'+this.idx + ''+ i]
        , data = {components : fake_store.components, componentList : fake_store.componentList}
      ddx++
      return (
        <div className={"temp-area col-md-"+item} key={i}>
          {bodyList.map(createUnit, data)}
        </div>
      )
    }
    return (
      <div className="container">
        <div className="row grid-row">
          {this.state.item.map(createArea,this.state)}
        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <TemplateGrid datas={fake_store} />,
  document.getElementById('main')
)
