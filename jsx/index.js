var App = React.createClass({
  render : function(){
    var pathname = this.props.location.pathname
    return (
      <div>
        <div className="navbar navbar-default" >
          <div className="container">
            <ul className="nav navbar-nav">
              <li className={pathname === '/' ? "active" : ""}><IndexLink to="/">Home</IndexLink></li>
              <li className={pathname === '/about' ? "active" : ""}><Link to="/about">About</Link></li>
              <li className={pathname === '/inbox' ? "active" : ""}><Link to="/inbox">Inbox</Link></li>
            </ul>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
})

var About = React.createClass({
  render: function () {
    return (
      <div  className="container">
        <h3>About</h3>
      </div>
    )
  }
})

var  Inbox = React.createClass({
render: function() {
  return (
    <div className="container">
      <h3>Inbox</h3>
      {this.props.children || "Welcome to your Inbox"}
    </div>
  )
}
})

var Message = React.createClass({
  render : function() {
    return <h3>Message {this.props.params.id}</h3>
  }
})

var Dashboard = React.createClass({
  render : function() {
    return (
      <div className="container">
        <h3>Home</h3>
        Welcome to the app!
      </div>
    )
  }
})

var Router = ReactRouter.Router
  , Route = ReactRouter.Route
  , Link = ReactRouter.Link
  , browserHistory = ReactRouter.browserHistory
  , IndexLink = ReactRouter.IndexLink
  , IndexRoute = ReactRouter.IndexRoute

ReactDOM.render((
<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard} />
    <Route path="about" component={About} />
    <Route path="inbox" component={Inbox}>
      <Route path="messages/:id" component={Message} />
    </Route>
  </Route>
</Router>
), document.getElementById('route'))
