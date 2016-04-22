var LoginForm = React.createClass({
  getInitialState: function() {
    return {cs:''}
  },
    fair : function (e) {
      e.preventDefault()
      var dev = device.get()
      window.location.href = 'http://react.com/' + dev + '.html'
      //console.log(device.get())
      // this.state.cs = 'animated fadeOutUp'
      // this.setState(this.state)
    },
    render : function () {
      return (
        <form onSubmit={this.fair} className={this.state.cs}>
          <div className="form-group">
            <input type="text" className="form-control" id="user" placeholder="用户名" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id="password" placeholder="密码" />
          </div>
          <button type="submit" className="btn btn-block btn-primary">登录</button>
        </form>
      )
    }
  })

ReactDOM.render(
  <LoginForm />,
  document.getElementById('login-form')
)
