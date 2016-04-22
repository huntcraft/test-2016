var PlayGround = React.createClass({
  getInitialState: function() {
    return {
      tpl : store.tpl
    }
  },
  componentDidMount : function () {
    ievent.on('select.block', this.selClick)
    ievent.on('divide.block', this.dvdClick)
    ievent.on('store.tpl.update', this.updateX)
  },
  updateX : function () {
    store.selR = 99
    store.selN = 99
    this.setState(this.state)
  },
  selClick : function (data) {
    if (data.ctrl && store.selR === data.row && store.selN !== data.num) {
      var row = store.tpl[data.row]
      var sum = row[store.selN] + row[data.num]
      if (store.selN > data.num) {
        row.splice(store.selN, 1)
        row.splice(data.num, 1, sum)
        store.selN = data.num
      } else {
        row.splice(data.num, 1)
        row.splice(store.selN, 1, sum)
      }
    } else {
      store.selR = data.row
      store.selN = data.num
    }
    this.setState(this.state)
  },
  dvdClick : function (data) {
    var sum = store.tpl[data.row][data.num]
      , firstBlock = Math.floor(sum / 2)
      , secondBlock = sum - firstBlock
    store.tpl[data.row].splice(data.num,1,firstBlock,secondBlock)
    this.setState(this.state)
  },
  render : function () {
    var rows = []
      , self = this
    this.props.data.forEach(function (item,i) {
      rows.push(<PgRow data={item} key={i} row={i}/>)
    })

    return (
      <div id="tpl-playground">
        <div className="container">
          {rows}
        </div>
      </div>
    )
  }
})

var PgRow = React.createClass({
  render : function () {
    var blocks = []
      , self = this
    this.props.data.forEach(function (item,i) {
      blocks.push(<PgBlock data={item} key={i} row={self.props.row} num={i}/>)
    })
    return (
      <div className="row">
        {blocks}
      </div>
    )
  }
})

var PgBlock = React.createClass({
  handelClick : function (e) {
    if (store.selR === this.props.row && store.selN === this.props.num) {
      ievent.emit('select.block',{row : 99, num : 99})
    } else {
      ievent.emit('select.block',{row : this.props.row, num : this.props.num, ctrl : e.ctrlKey})
    }
  },
  // mDown : function (e) {
  //   e.stopPropagation()
  //   var rect = e.target.getBoundingClientRect()
  //   //console.log(rect)
  //   ievent.emit('mousedown.move.block', {row : this.props.row, num : this.props.num, x : Math.floor((rect.left + rect.right) / 2)})
  // },
  // mClick : function (e) {
  //   e.stopPropagation()
  // },
  dClick : function (e) {
    e.stopPropagation()
    ievent.emit('divide.block', {row: this.props.row, num : this.props.num})
  },
  render : function () {
    var defContent = undefined
    //  , moveBlock = undefined

    if (store.selR === this.props.row && store.selN === this.props.num) {
      var claName = ' active'
    } else {
      var claName = ''
    }

    // if(this.props.num) {
    //   moveBlock = <div className="tpl-move-block"  onMouseDown={this.mDown} onClick={this.mClick}/>
    // }

    // {moveBlock}  暂时不添加鼠标拖动来调整块区大小的功能
    return (
      <div className={"col-lg-" + this.props.data} >
        <div
          className={"tpl-def-block" + claName}
          onClick={this.handelClick}>
          <DefContent data={this.props.data} func={this.dClick}/>

        </div>
      </div>
    )
  }
})

var DefContent = React.createClass({
  render : function () {
    if (this.props.data === 1) {
      return null
    }
    return (
      <div className="tpl-def-content">
        <span className="tpl-divide" onClick={this.props.func}>
          <i className="glyphicon glyphicon-resize-horizontal"></i>
        </span>
      </div>
    )
  }
})

var TplEditTool = React.createClass({
  getInitialState: function() {
    return {
      tpl : store.tpl,
      note : store.note
    }
  },
  componentDidMount : function () {
    this.refs.note.value = this.state.note
    ievent.on('store.tpl.update', this.updateX)
  },
  updateX : function () {
    this.setState(this.state)
  },
  addRow : function () {
    store.tpl.push([12])
    ievent.emit('store.tpl.update')
  },
  noteChange : function () {
    store.note = this.refs.note.value

  },
  render : function () {
    var toolRows = []
    this.props.data.forEach(function (item, i) {
      toolRows.push(<TplToolRow num={i} key={i}/>)
    })
    return (
      <div className="tb-container">
        <div id="action-add" onClick={this.addRow}>
          <i className="glyphicon glyphicon-plus"></i>
          <span>增加栏</span>
        </div>
        <div className="tb-divider-1"></div>
        {toolRows}
        <div className="tb-divider-2"></div>
        <div className="tb-inputrow">
          <label htmlFor="inputNote">备注 :</label>
          <input ref="note" type="text" className="tb-input-1" id="inputNote" onChange={this.noteChange}/>
        </div>
        <TplToolButtonbar />
      </div>
    )
  }
})

var TplToolRow = React.createClass({
  removeRow : function () {
    store.tpl.splice(this.props.num, 1)
    ievent.emit('store.tpl.update')
  },
  render : function () {
    return (
      <div className="tpl-ac-row">
        <span className="tpl-ac-row-id">{this.props.num + 1}</span>
        <span className="tpl-row-del" onClick={this.removeRow}><i className="glyphicon glyphicon-remove"></i></span>
      </div>
    )
  }
})

var TplToolButtonbar = React.createClass({
  save : function () {
    var tpl = JSON.stringify(store.tpl)
    $.ajax({
      url : '/work',
      type : 'POST',
      data : {
        tpl : tpl,
        action : store.action,
        id : store.id,
        note : store.note
      },
      dataType : 'JSON',
      success : function (data) {
        console.log(data)
      }
    })
  },
  render : function () {
    // <div className="tpl-cancel">取消</div>  暂时不加取消功能
    return (
      <div className="tpl-buttonBar">
        <div className="tpl-save" onClick={this.save}>保存</div>

      </div>
    )
  }
})

var TplSubMenu = React.createClass({
  getInitialState: function() {
    return {
      data : [
        {type : 'list', name : '列表', clsName : 'glyphicon glyphicon-th-list', show : true,url: '/work/tpl/list'},
        {type : 'add', name : '增加', clsName : 'glyphicon glyphicon-plus', show : true,url: '/work/tpl/add'},
        {type : 'edit', name : '修改', clsName : 'glyphicon glyphicon-edit', show : false,url: '#'}
      ]
    }
  },
  render : function () {
    var subMenu = []
    this.state.data.forEach(function (item) {
      subMenu.push(<TplSubMenuBlock key={item.type} data={item} />)
    })
    return (
      <div>
        {subMenu}
      </div>
    )
  }
})

var TplSubMenuBlock = React.createClass({
  render : function () {
    var und = undefined
      , data = this.props.data
      , isActive = (store.action === data.type) ? ' active' : ''
    if (data.show || store.action === 'edit') {
      return (
        <a className={"tpl-act" + isActive} href={data.url}>
          <i className={data.clsName}></i>
          <span>{data.name}</span>
        </a>
      )
    } else {
      return null
    }
  }
})

var TplList = React.createClass({
  render : function () {
    var list = []
      , data = store.tplList
    data.forEach(function (item, i) {
      list.push(
        <div className="tplList-1" key={i}>
          <span className="tplList-id">{i + 1}</span>
          <span className="tplList-name">{item.note}</span>
          <span className="tplList-date">{item.datex}</span>
          <a href={"/work/tpl/edit/" + item.id} className="tplList-ac">修改</a>
          <span className="tplList-ac">删除</span>
        </div>
      )
    })
    if(list.length === 0){
      list.push(<div className="tplList-1"><span>没有模板信息，请添加！</span></div>)
    }
    return (
      <div id="tpl-list">
        {list}
      </div>
    )
  }
})

var myApp = (function ($, store, data) {
  // var prevPointX = 0
  //
  // function mousedown(data) {
  //   prevPointX = data.x
  //   console.log(prevPointX)
  //   $(document).on('mousemove', mousemove)
  //   $(document).on('mouseup', mouseup)
  // }
  //
  // function mousemove(e) {
  //   var disX = e.clientX - prevPointX
  //   if (disX < 0) {
  //     var dix_tmp = -disX - 79
  //   } else {
  //     var dix_tmp = disX - 79
  //   }
  //   if (dix_tmp > 0) {
  //     var num = Math.ceil(dix_tmp / 98)
  //
  //   }
  // }
  //
  // function mouseup() {
  //   $(document).off('mousemove', mousemove)
  //   $(document).off('mouseup', mouseup)
  // }
  function init() {
    if (store.action === 'add' || store.action === 'edit') {
      myApp.playground.init()
    } else if (store.action === 'list') {
      myApp.tplList.init()
    }
    myApp.toolbar.init()
    myApp.menulist.init()
    //ievent.on('mousedown.move.block', mousedown)
  }

  return {init : init}
})(window.jQuery, store, server_data)

myApp.playground = (function ($, store, data) {
  function init() {
    ReactDOM.render(
      <PlayGround data={store.tpl}/>,
      document.getElementById('main')
    )
  }

  return {init : init}
})(window.jQuery, store, server_data)

myApp.toolbar = (function ($, store, data) {
  function init() {
    if (store.action === 'add' || store.action === 'edit') {
      ReactDOM.render(
        <TplEditTool data={store.tpl}/>,
        document.getElementById('toolbar')
      )
    }
  }

  return {init : init}
})(window.jQuery, store, server_data)

myApp.menulist = (function ($, store, data) {
  function init() {
    ReactDOM.render(
      <TplSubMenu />,
      document.getElementById('subMenu')
    )
  }

  return {init : init}
})(window.jQuery, store, server_data)

myApp.tplList = (function ($, store, data) {
  function init() {
    ReactDOM.render(
      <TplList />,
      document.getElementById('main')
    )
  }

  return {init : init}
})(window.jQuery, store, server_data)

$(document).ready(function () {
  myApp.init()
})
