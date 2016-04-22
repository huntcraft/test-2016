
/* app */
var TemplateGrid = React.createClass({
  displayName: "TemplateGrid",

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(TempHeader, null),
      React.createElement(TempChannelList, null),
      React.createElement(TempFooter, null)
    );
  }
});

var TempHeader = React.createClass({
  displayName: "TempHeader",

  render: function () {
    return React.createElement(
      "div",
      { id: "dt-header" },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-4" },
            React.createElement(
              "span",
              { id: "dt-logo" },
              "M"
            ),
            React.createElement(
              "span",
              { id: "dt-title" },
              "管理平台"
            )
          ),
          React.createElement("div", { className: "col-md-6" }),
          React.createElement(
            "div",
            { className: "col-md-2" },
            React.createElement(
              "div",
              { id: "user-info" },
              React.createElement(
                "div",
                { className: "info-unit", "data-toggle": "tooltip", "data-placement": "left", title: store.position },
                React.createElement("i", { className: "glyphicon glyphicon-user" })
              )
            )
          )
        )
      )
    );
  }
});

var TempChannelList = React.createClass({
  displayName: "TempChannelList",

  componentDidMount: function () {
    ievent.on('select.template', this.process);
    //ievent.on('store.update', this.process)
  },
  componentWillUnmount: function () {},
  componentDidUpdate: function () {
    if (this.state.gridBody.length !== 0) {
      ievent.emit('playground.complate');
    }
  },
  process: function () {
    this.state.gridBody = store.gridBody[0];
    this.setState(this.state);
  },
  getInitialState: function () {
    return {
      gridBody: store.gridBody[0]
    };
  },
  render: function () {
    var kk = 0,
        gridbody = [];

    this.state.gridBody.forEach(function (item, i) {
      var v = kk;
      kk = kk + item.length;
      gridbody.push(React.createElement(TempRow, { data: item, idx: i, dix: v, key: i }));
    });

    if (gridbody.length === 0) {
      gridbody.push(React.createElement(TplList, { key: "tplList-show" }));
    }

    return React.createElement(
      "div",
      { className: "tab-content" },
      React.createElement(
        "div",
        { className: "tab-pane active", id: "ch-1" },
        React.createElement(
          "div",
          { className: "container" },
          gridbody
        )
      )
    );
  }
});

var TempRow = React.createClass({
  displayName: "TempRow",

  getInitialState: function () {
    return {
      idx: this.props.idx,
      data: this.props.data
    };
  },
  storeUpdate: function (e) {
    this.setState(this.state);
  },
  componentDidUpdate: function () {
    ievent.emit('template.update');
  },
  componentDidMount: function () {
    ievent.on('store.update', this.storeUpdate);
  },
  render: function () {
    var tempAreas = [],
        ddx = this.props.dix;

    this.state.data.forEach(function (item, i) {
      tempAreas.push(React.createElement(TempArea, { data: item, idx: ddx + i, key: i }));
    });

    return React.createElement(
      "div",
      { className: "row grid-row" },
      tempAreas
    );
  }
});

var TempArea = React.createClass({
  displayName: "TempArea",

  getInitialState: function () {
    return {
      idx: this.props.idx,
      data: this.props.data,
      content: store.bodyList[0][this.props.idx]
    };
  },
  render: function () {
    var tempUnits = [],
        self = this;
    this.state.content.forEach(function (item, i) {
      tempUnits.push(React.createElement(TempUnit, { data: item, key: item, area: self.props.idx, idx: i }));
    });
    if (tempUnits.length === 0) {
      tempUnits.push(React.createElement("div", { className: "comp-default", key: "comp_default" }));
    }
    return React.createElement(
      "div",
      { className: "temp-area col-md-" + this.props.data },
      tempUnits
    );
  }
});

var TempUnit = React.createClass({
  displayName: "TempUnit",

  remove: function (e) {
    e.stopPropagation();
    var idx = store.componentList.indexOf(this.props.data);
    store.componentList.splice(idx, 1);
    store.components.splice(idx, 1);
    store.bodyList[0][this.props.area].splice(this.props.idx, 1);
    ievent.emit('store.update');
  },
  config: function (e) {
    e.stopPropagation();
    ievent.emit('component.config', store.bodyList[0][this.props.area][this.props.idx]);
  },
  mdown: function (e) {
    e.stopPropagation();
  },
  render: function () {
    var cList = store.componentList,
        idx = cList.indexOf(this.props.data),
        comps = store.components[idx];

    if (comps.type === 'd_default') {
      return React.createElement(
        "div",
        { className: "panel panel-default", id: this.props.data },
        React.createElement(
          "div",
          { className: "panel-heading ui-heading" },
          React.createElement(
            "h3",
            { className: "panel-title" },
            comps.title
          ),
          React.createElement(
            "div",
            { className: "btn-group pull-right" },
            React.createElement("span", { className: "glyphicon glyphicon-remove", onClick: this.remove, onMouseDown: this.mdown }),
            React.createElement("span", { className: "ui-placeholder" }),
            React.createElement("span", { className: "glyphicon glyphicon-cog", onClick: this.config, onMouseDown: this.mdown })
          )
        ),
        React.createElement("div", { className: "panel-body" })
      );
    } else if (comps.type === 'd_active') {
      return React.createElement("div", { className: "comp-active" });
    }
  }
});

var TempFooter = React.createClass({
  displayName: "TempFooter",

  render: function () {
    return React.createElement(
      "div",
      { id: "dt-footer" },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-12" },
            "© 2016 招商银行"
          )
        )
      )
    );
  }
});

var TplList = React.createClass({
  displayName: "TplList",

  ck: function (e) {
    var data = e.target.getAttribute('data-name'),
        idx = store.tempList.indexOf(data),
        def_bodyList = [];
    store.gridBody[0] = store.templates[idx].value;
    store.templates[idx].value.forEach(function (item) {
      for (var i = 0; i < item.length; i++) {
        def_bodyList.push([]);
      }
    });
    //store.id = data
    store.bodyList[0] = def_bodyList;
    ievent.emit('select.template');
  },
  render: function () {
    var list = [],
        data = store.templates,
        self = this;
    data.forEach(function (item, i) {
      list.push(React.createElement(
        "div",
        { className: "tplList-1", key: i },
        React.createElement(
          "span",
          { className: "tplList-id" },
          i + 1
        ),
        React.createElement(
          "span",
          { className: "tplList-name" },
          item.note
        ),
        React.createElement(
          "span",
          { className: "tplList-date" },
          item.datex
        ),
        React.createElement(
          "span",
          { className: "tplList-ac", onClick: self.ck, "data-name": item.id },
          "选择"
        )
      ));
    });
    if (list.length === 0) {
      list.push(React.createElement(
        "div",
        { className: "tplList-1" },
        React.createElement(
          "span",
          null,
          "没有模板信息，请先添加！"
        )
      ));
    }
    return React.createElement(
      "div",
      { id: "tplList-show" },
      React.createElement(
        "div",
        { key: "notice", className: "conf-notice" },
        "请先选择要使用的模板"
      ),
      list
    );
  }
});

var CompList = React.createClass({
  displayName: "CompList",

  render: function () {
    var compitems = [];
    store.comps.forEach(function (item, i) {
      compitems.push(React.createElement(CompItem, { data: item, key: i }));
    });
    return React.createElement(
      "div",
      null,
      compitems
    );
  }
});

var CompItem = React.createClass({
  displayName: "CompItem",

  render: function () {
    return React.createElement(
      "div",
      { className: "subComp", title: this.props.data.title, "data-type": this.props.data.type },
      React.createElement("i", { className: this.props.data.icon })
    );
  }
});

var Toolbar = React.createClass({
  displayName: "Toolbar",

  getInitialState: function () {
    return {
      show: 'main',
      compId: -1
    };
  },
  close: function () {
    this.state.show = 'main';
    this.setState(this.state);
  },
  save: function () {
    var componentList = store.componentList.slice(1),
        components = store.components.slice(1),
        bodyList = store.bodyList,
        gridBody = store.gridBody,
        data = {
      componentList: componentList,
      components: components,
      bodyList: bodyList,
      gridBody: gridBody
    },
        data_json = JSON.stringify(data);
    $.ajax({
      url: '/conf',
      type: 'POST',
      dataType: 'JSON',
      data: {
        action: store.action,
        position: store.position,
        id: store.id,
        content: data_json
      },
      success: function (data) {
        if (data.msg == 'success' && data.ac == 'new') {
          store.id = data.id;
          store.action = 'edit';
        }
      }
    });
    //console.log(data);
  },
  componentDidMount: function () {
    ievent.on('component.config', this.updateConfig);
    if (this.state.show === 'main') {
      this.refs.inputdd.value = store.position;
    }
  },
  componentDidUpdate: function () {
    if (this.state.show === 'main') {
      this.refs.inputdd.value = store.position;
    }
  },
  updateConfig: function (data) {
    this.state.show = 'config';
    this.state.compId = data;
    this.setState(this.state);
  },
  focus: function () {
    this.refs.inputrr.classList.add('active');
  },
  blur: function () {
    this.refs.inputrr.classList.remove('active');
  },
  inputChange: function () {
    store.position = this.refs.inputdd.value;
  },
  render: function () {
    if (this.state.show === 'main') {
      return React.createElement(
        "div",
        { className: "tb-container" },
        React.createElement("div", { className: "tb-divider-1" }),
        React.createElement(
          "div",
          { className: "tb-inputrow", ref: "inputrr" },
          React.createElement(
            "label",
            { htmlFor: "toolbar-input-dd" },
            "岗位 :"
          ),
          React.createElement("input", { ref: "inputdd", type: "text", className: "tb-input-1",
            id: "toolbar-input-dd",
            onChange: this.inputChange,
            onBlur: this.blur,
            onFocus: this.focus })
        ),
        React.createElement(
          "div",
          { className: "tpl-buttonBar" },
          React.createElement(
            "div",
            { className: "tpl-save", onClick: this.save },
            "保存"
          )
        )
      );
    } else if (this.state.show === 'config') {
      var inputRows = []
      // idd 在components 里的索引，可以找到对应的组件的配置
      ,
          idd = store.componentList.indexOf(this.state.compId);

      store.compConfigs.forEach(function (item, i) {
        inputRows.push(React.createElement(ToolbarInput, { data: item, key: i, idx: idd }));
      });

      return React.createElement(
        "div",
        { className: "tb-container" },
        React.createElement("div", { className: "tb-divider-1" }),
        inputRows,
        React.createElement(
          "div",
          { className: "tpl-buttonBar" },
          React.createElement(
            "div",
            { className: "tpl-close", onClick: this.close },
            "关闭"
          )
        )
      );
    }
  }
});

var ToolbarInput = React.createClass({
  displayName: "ToolbarInput",

  inputChange: function () {
    store.components[this.props.idx][this.props.data.type] = this.refs.input.value;
    ievent.emit('store.update');
  },
  componentDidMount: function () {
    this.refs.input.value = store.components[this.props.idx][this.props.data.type];
    //ievent.on('store.tpl.update', this.updateX)
  },
  componentDidUpdate: function () {
    this.refs.input.value = store.components[this.props.idx][this.props.data.type];
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "tb-inputrow" },
      React.createElement(
        "label",
        { htmlFor: "toolbar-input-" + this.props.data.type },
        this.props.data.name,
        " :"
      ),
      React.createElement("input", { ref: "input", type: "text", className: "tb-input-1", id: "toolbar-input-" + this.props.data.type, onChange: this.inputChange })
    );
  }
});

var myApp = function ($, store) {
  function init() {
    if (store.action === 'new' || store.action === 'edit') {
      myApp.playground.init();
    } else if (store.action === 'list') {
      myApp.confList.init();
    }
    myApp.menulist.init();
    myApp.toolbar.init();
  }

  return { init: init };
}(window.jQuery, store);

myApp.playground = function ($, store) {
  function init() {
    ReactDOM.render(React.createElement(TemplateGrid, null), document.getElementById('conf-playground'));
  }

  return { init: init };
}(window.jQuery, store);

myApp.menulist = function ($, store) {
  function init() {
    if (store.action === 'new' || store.action === 'edit') {
      ievent.on('playground.complate', load);
    }
  }

  function load() {
    ReactDOM.render(React.createElement(CompList, null), document.getElementById('subMenu'));
  }

  return { init: init };
}(window.jQuery, store);

myApp.toolbar = function ($, store) {
  function init() {
    ReactDOM.render(React.createElement(Toolbar, null), document.getElementById('toolbar'));
  }

  return { init: init };
}(window.jQuery, store);

$(document).ready(function () {
  myApp.init();
});
