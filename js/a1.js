var SubComp = React.createClass({
  displayName: "SubComp",

  // componentDidMount : function () {
  //   console.log('mount', this.props.va)
  // },
  // componentWillUnmount : function () {
  //   console.log('unmount', this.props.va)
  // },
  clk: function (e) {
    this.props.chg(this.props.va.id, e.ctrlKey);
  },
  render: function () {
    return React.createElement(
      "div",
      { onClick: this.clk, className: this.props.va.active ? "active" : "" },
      this.props.va.content
    );
  }
});
var AppDemo = React.createClass({
  displayName: "AppDemo",

  getInitialState: function () {
    return {
      k: [{ id: "item1", active: false, content: "dddvad" }, { id: "item3", active: false, content: "nadasiga" }, { id: "item2", active: false, content: "nyanko" }],
      kList: ["item1", "item3", "item2"],
      curItem: []
    };
  },
  // ck : function () {
  //   var tmp = this.state.k[0]
  //   this.state.k[0] = this.state.k[2]
  //   this.state.k[2] = tmp + "fj"
  //   this.setState(this.state)
  // },
  chg: function (id, ctrlkey) {
    var self = this;
    if (ctrlkey) {
      var idx_tmp = this.state.curItem.indexOf(id);
      if (~idx_tmp) {
        this.state.curItem.splice(idx_tmp, 1);
        var idx = this.state.kList.indexOf(id);
        this.state.k[idx].active = false;
      } else {
        this.state.curItem.push(id);
        var idx = this.state.kList.indexOf(id);
        this.state.k[idx].active = true;
      }
    } else {
      this.state.curItem.forEach(function (item) {
        var idx = self.state.kList.indexOf(item);
        self.state.k[idx].active = false;
      });
      var idx_tmp = this.state.kList.indexOf(id);
      this.state.curItem = [id];
      this.state.k[idx_tmp].active = true;
    }
    this.setState(this.state);
    // this.state.curItem.forEach(function (id) {
    //   var idx = this.state.kList.indexOf(id)
    //   this.state.k[idx].active = true
    // })

    // var idx_next = this.state.kList.indexOf(id)
    // if (this.state.curItem !== '') {
    //   var idx_cur = this.state.kList.indexOf(this.state.curItem)
    //   this.state.k[idx_cur].active = false
    // }
    // this.state.k[idx_next].active = true
    // this.state.curItem = id
    // console.log(id)
    // this.setState(this.state)
  },
  render: function () {
    var self = this;
    var subcomp = [];
    this.state.k.forEach(function (item) {
      subcomp.push(React.createElement(SubComp, { va: item, key: item.id, chg: self.chg }));
    });
    return React.createElement(
      "div",
      null,
      subcomp
    );
  }
});
ReactDOM.render(React.createElement(AppDemo, null), document.getElementById('foo'));
