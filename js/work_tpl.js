var PlayGround = React.createClass({
  displayName: 'PlayGround',

  getInitialState: function () {
    return {
      tpl: store.tpl
    };
  },
  componentDidMount: function () {
    ievent.on('select.block', this.selClick);
    ievent.on('divide.block', this.dvdClick);
    ievent.on('store.tpl.update', this.updateX);
  },
  updateX: function () {
    store.selR = 99;
    store.selN = 99;
    this.setState(this.state);
  },
  selClick: function (data) {
    if (data.ctrl && store.selR === data.row && store.selN !== data.num) {
      var row = store.tpl[data.row];
      var sum = row[store.selN] + row[data.num];
      if (store.selN > data.num) {
        row.splice(store.selN, 1);
        row.splice(data.num, 1, sum);
        store.selN = data.num;
      } else {
        row.splice(data.num, 1);
        row.splice(store.selN, 1, sum);
      }
    } else {
      store.selR = data.row;
      store.selN = data.num;
    }
    this.setState(this.state);
  },
  dvdClick: function (data) {
    var sum = store.tpl[data.row][data.num],
        firstBlock = Math.floor(sum / 2),
        secondBlock = sum - firstBlock;
    store.tpl[data.row].splice(data.num, 1, firstBlock, secondBlock);
    this.setState(this.state);
  },
  render: function () {
    var rows = [],
        self = this;
    this.props.data.forEach(function (item, i) {
      rows.push(React.createElement(PgRow, { data: item, key: i, row: i }));
    });

    return React.createElement(
      'div',
      { id: 'tpl-playground' },
      React.createElement(
        'div',
        { className: 'container' },
        rows
      )
    );
  }
});

var PgRow = React.createClass({
  displayName: 'PgRow',

  render: function () {
    var blocks = [],
        self = this;
    this.props.data.forEach(function (item, i) {
      blocks.push(React.createElement(PgBlock, { data: item, key: i, row: self.props.row, num: i }));
    });
    return React.createElement(
      'div',
      { className: 'row' },
      blocks
    );
  }
});

var PgBlock = React.createClass({
  displayName: 'PgBlock',

  handelClick: function (e) {
    if (store.selR === this.props.row && store.selN === this.props.num) {
      ievent.emit('select.block', { row: 99, num: 99 });
    } else {
      ievent.emit('select.block', { row: this.props.row, num: this.props.num, ctrl: e.ctrlKey });
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
  dClick: function (e) {
    e.stopPropagation();
    ievent.emit('divide.block', { row: this.props.row, num: this.props.num });
  },
  render: function () {
    var defContent = undefined;
    //  , moveBlock = undefined

    if (store.selR === this.props.row && store.selN === this.props.num) {
      var claName = ' active';
    } else {
      var claName = '';
    }

    // if(this.props.num) {
    //   moveBlock = <div className="tpl-move-block"  onMouseDown={this.mDown} onClick={this.mClick}/>
    // }

    // {moveBlock}  暂时不添加鼠标拖动来调整块区大小的功能
    return React.createElement(
      'div',
      { className: "col-lg-" + this.props.data },
      React.createElement(
        'div',
        {
          className: "tpl-def-block" + claName,
          onClick: this.handelClick },
        React.createElement(DefContent, { data: this.props.data, func: this.dClick })
      )
    );
  }
});

var DefContent = React.createClass({
  displayName: 'DefContent',

  render: function () {
    if (this.props.data === 1) {
      return null;
    }
    return React.createElement(
      'div',
      { className: 'tpl-def-content' },
      React.createElement(
        'span',
        { className: 'tpl-divide', onClick: this.props.func },
        React.createElement('i', { className: 'glyphicon glyphicon-resize-horizontal' })
      )
    );
  }
});

var TplEditTool = React.createClass({
  displayName: 'TplEditTool',

  getInitialState: function () {
    return {
      tpl: store.tpl,
      note: store.note
    };
  },
  componentDidMount: function () {
    this.refs.note.value = this.state.note;
    ievent.on('store.tpl.update', this.updateX);
  },
  updateX: function () {
    this.setState(this.state);
  },
  addRow: function () {
    store.tpl.push([12]);
    ievent.emit('store.tpl.update');
  },
  noteChange: function () {
    store.note = this.refs.note.value;
  },
  render: function () {
    var toolRows = [];
    this.props.data.forEach(function (item, i) {
      toolRows.push(React.createElement(TplToolRow, { num: i, key: i }));
    });
    return React.createElement(
      'div',
      { id: 'tb-add' },
      React.createElement(
        'div',
        { id: 'action-add', onClick: this.addRow },
        React.createElement('i', { className: 'glyphicon glyphicon-plus' }),
        React.createElement(
          'span',
          null,
          '增加栏'
        )
      ),
      toolRows,
      React.createElement(
        'div',
        { className: 'tb-inputrow' },
        React.createElement(
          'label',
          { htmlFor: 'inputNote' },
          '备注 :'
        ),
        React.createElement('input', { ref: 'note', type: 'text', className: 'tb-input-1', id: 'inputNote', onChange: this.noteChange })
      ),
      React.createElement(TplToolButtonbar, null)
    );
  }
});

var TplToolRow = React.createClass({
  displayName: 'TplToolRow',

  removeRow: function () {
    store.tpl.splice(this.props.num, 1);
    ievent.emit('store.tpl.update');
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'tpl-ac-row' },
      React.createElement(
        'span',
        { className: 'tpl-ac-row-id' },
        this.props.num + 1
      ),
      React.createElement(
        'span',
        { className: 'tpl-row-del', onClick: this.removeRow },
        React.createElement('i', { className: 'glyphicon glyphicon-remove' })
      )
    );
  }
});

var TplToolButtonbar = React.createClass({
  displayName: 'TplToolButtonbar',

  save: function () {
    var tpl = JSON.stringify(store.tpl);
    $.ajax({
      url: '/work',
      type: 'POST',
      data: {
        tpl: tpl,
        action: store.action,
        id: store.id,
        note: store.note
      },
      dataType: 'JSON',
      success: function (data) {
        console.log(data);
      }
    });
  },
  render: function () {
    // <div className="tpl-cancel">取消</div>  暂时不加取消功能
    return React.createElement(
      'div',
      { className: 'tpl-buttonBar' },
      React.createElement(
        'div',
        { className: 'tpl-save', onClick: this.save },
        '保存'
      )
    );
  }
});

var TplSubMenu = React.createClass({
  displayName: 'TplSubMenu',

  getInitialState: function () {
    return {
      data: [{ type: 'list', name: '列表', clsName: 'glyphicon glyphicon-th-list', show: true, url: '/work/tpl/list' }, { type: 'add', name: '增加', clsName: 'glyphicon glyphicon-plus', show: true, url: '/work/tpl/add' }, { type: 'edit', name: '修改', clsName: 'glyphicon glyphicon-edit', show: false, url: '#' }]
    };
  },
  render: function () {
    var subMenu = [];
    this.state.data.forEach(function (item) {
      subMenu.push(React.createElement(TplSubMenuBlock, { key: item.type, data: item }));
    });
    return React.createElement(
      'div',
      null,
      subMenu
    );
  }
});

var TplSubMenuBlock = React.createClass({
  displayName: 'TplSubMenuBlock',

  render: function () {
    var und = undefined,
        data = this.props.data,
        isActive = store.action === data.type ? ' active' : '';
    if (data.show || store.action === 'edit') {
      return React.createElement(
        'a',
        { className: "tpl-act" + isActive, href: data.url },
        React.createElement('i', { className: data.clsName }),
        React.createElement(
          'span',
          null,
          data.name
        )
      );
    } else {
      return null;
    }
  }
});

var TplList = React.createClass({
  displayName: 'TplList',

  render: function () {
    var list = [],
        data = store.tplList;
    data.forEach(function (item, i) {
      list.push(React.createElement(
        'div',
        { className: 'tplList-1', key: i },
        React.createElement(
          'span',
          { className: 'tplList-id' },
          i + 1
        ),
        React.createElement(
          'span',
          { className: 'tplList-name' },
          item.note
        ),
        React.createElement(
          'span',
          { className: 'tplList-date' },
          item.datex
        ),
        React.createElement(
          'a',
          { href: "/work/tpl/edit/" + item.id, className: 'tplList-ac' },
          '修改'
        ),
        React.createElement(
          'span',
          { className: 'tplList-ac' },
          '删除'
        )
      ));
    });
    if (list.length === 0) {
      list.push(React.createElement(
        'div',
        { className: 'tplList-1' },
        React.createElement(
          'span',
          null,
          '没有模板信息，请添加！'
        )
      ));
    }
    return React.createElement(
      'div',
      { id: 'tpl-list' },
      list
    );
  }
});

var myApp = function ($, store, data) {
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
      myApp.playground.init();
    } else if (store.action === 'list') {
      myApp.tplList.init();
    }
    myApp.toolbar.init();
    myApp.menulist.init();
    //ievent.on('mousedown.move.block', mousedown)
  }

  return { init: init };
}(window.jQuery, store, server_data);

myApp.playground = function ($, store, data) {
  function init() {
    ReactDOM.render(React.createElement(PlayGround, { data: store.tpl }), document.getElementById('main'));
  }

  return { init: init };
}(window.jQuery, store, server_data);

myApp.toolbar = function ($, store, data) {
  function init() {
    if (store.action === 'add' || store.action === 'edit') {
      ReactDOM.render(React.createElement(TplEditTool, { data: store.tpl }), document.getElementById('toolbar'));
    }
  }

  return { init: init };
}(window.jQuery, store, server_data);

myApp.menulist = function ($, store, data) {
  function init() {
    ReactDOM.render(React.createElement(TplSubMenu, null), document.getElementById('subMenu'));
  }

  return { init: init };
}(window.jQuery, store, server_data);

myApp.tplList = function ($, store, data) {
  function init() {
    ReactDOM.render(React.createElement(TplList, null), document.getElementById('main'));
  }

  return { init: init };
}(window.jQuery, store, server_data);

$(document).ready(function () {
  myApp.init();
});
