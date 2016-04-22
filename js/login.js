var LoginForm = React.createClass({
  displayName: 'LoginForm',

  getInitialState: function () {
    return { cs: '' };
  },
  fair: function (e) {
    e.preventDefault();
    var dev = device.get();
    window.location.href = 'http://react.com/' + dev + '.html';
    //console.log(device.get())
    // this.state.cs = 'animated fadeOutUp'
    // this.setState(this.state)
  },
  render: function () {
    return React.createElement(
      'form',
      { onSubmit: this.fair, className: this.state.cs },
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement('input', { type: 'text', className: 'form-control', id: 'user', placeholder: '用户名' })
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement('input', { type: 'password', className: 'form-control', id: 'password', placeholder: '密码' })
      ),
      React.createElement(
        'button',
        { type: 'submit', className: 'btn btn-block btn-primary' },
        '登录'
      )
    );
  }
});

ReactDOM.render(React.createElement(LoginForm, null), document.getElementById('login-form'));
