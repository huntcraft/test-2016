var ievent = (function () {
  var events = {}
  return {
    on : function (event, func) {
      if (events[event] === undefined) {
        events[event] = []
      }
      events[event].push(func)
    },
    off : function (event, func) {
      if (events[event] === undefined) return
      if (func === undefined) {
        delete events[event]
        return
      }
      events[event].splice(events[event].indexOf(func), 1)
    },
    emit : function (event) {
      if (events[event] === undefined) return
      for (var i = 0; i < events[event].length; i++) {
        events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    }
  }
})()