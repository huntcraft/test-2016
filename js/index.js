var App = React.createClass({
  displayName: "App",

  render: function () {
    var pathname = this.props.location.pathname;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "navbar navbar-default" },
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "ul",
            { className: "nav navbar-nav" },
            React.createElement(
              "li",
              { className: pathname === '/' ? "active" : "" },
              React.createElement(
                IndexLink,
                { to: "/" },
                "Home"
              )
            ),
            React.createElement(
              "li",
              { className: pathname === '/about' ? "active" : "" },
              React.createElement(
                Link,
                { to: "/about" },
                "About"
              )
            ),
            React.createElement(
              "li",
              { className: pathname === '/inbox' ? "active" : "" },
              React.createElement(
                Link,
                { to: "/inbox" },
                "Inbox"
              )
            )
          )
        )
      ),
      this.props.children
    );
  }
});

var About = React.createClass({
  displayName: "About",

  render: function () {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h3",
        null,
        "About"
      )
    );
  }
});

var Inbox = React.createClass({
  displayName: "Inbox",

  render: function () {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h3",
        null,
        "Inbox"
      ),
      this.props.children || "Welcome to your Inbox"
    );
  }
});

var Message = React.createClass({
  displayName: "Message",

  render: function () {
    return React.createElement(
      "h3",
      null,
      "Message ",
      this.props.params.id
    );
  }
});

var Dashboard = React.createClass({
  displayName: "Dashboard",

  render: function () {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h3",
        null,
        "Home"
      ),
      "Welcome to the app!"
    );
  }
});

var Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link,
    browserHistory = ReactRouter.browserHistory,
    IndexLink = ReactRouter.IndexLink,
    IndexRoute = ReactRouter.IndexRoute;

ReactDOM.render(React.createElement(
  Router,
  { history: browserHistory },
  React.createElement(
    Route,
    { path: "/", component: App },
    React.createElement(IndexRoute, { component: Dashboard }),
    React.createElement(Route, { path: "about", component: About }),
    React.createElement(
      Route,
      { path: "inbox", component: Inbox },
      React.createElement(Route, { path: "messages/:id", component: Message })
    )
  )
), document.getElementById('route'));
