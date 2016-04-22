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

/**
  * 没用最初DEMO版本中的思路，按template 的数据划分区域
  * 先在区域中查找，再在区域内的水平线上判断最后的落点
  */

var process = (function (ievent, $) {
  var rows
    , areas
    , areaRect = []
    , units = []
    , activeArea = -1
    , activeUnit = -1
    , scrollTop = 0
    , scrollLeft = 0
    , $selected = null
    , type = ''
    , $clone = null
    , offsetX
    , offsetY
    , mDownArea
    , mDownTarget = null
    , mDownEvent = null
    , isMove = false

  function complateX() {
    rows = $('.grid-row')
    areas = $('.temp-area')
    update()
  }

  function update() { //获得所有大区域的端点坐标，和子单元的水平线
    // 同一水平线的区域都是同样的top水平线，
    // 再去修改出相同的 bottom 水平线，虽然真实显示的区域有高低
    var top = []
      , bottom = []
    areaRect = []
    units = []


    for (var i = 0; i < rows.length; i++) {
      var rectA = rows[i].getBoundingClientRect()
      top.push(rectA.top + scrollTop)    // 加上 scrollTop 是统一以页面顶端为基准
      bottom.push(rectA.bottom + scrollTop)
    }

    for (var j = 0; j < areas.length; j++) {
      var rectB = areas[j].getBoundingClientRect()
        , idx = top.indexOf(rectB.top + scrollTop)
        , tmp = areas[j].getElementsByClassName('panel')
        , tmpArray = []
      for (var k = 0; k < tmp.length; k++) {
        var tmpK = tmp[k].getBoundingClientRect()
        tmpArray.push((tmpK.top + tmpK.bottom) / 2 + scrollTop)
      }
      areaRect.push([rectB.left,rectB.top,rectB.right,bottom[idx]])
      units.push(tmpArray)
    }
  }

  function active(x,y) {
    var location = locate(x, y)
      , tmpActA = location[0]
      , j = location[1]

    if (~tmpActA) {  // 要显示激活
      if (!~activeArea) { // 进入区域
        fake_store.bodyList[0][tmpActA].splice(j, 0, 'comp_active')
      } else if (j !== activeUnit || tmpActA !== activeArea) {  // 区域间有效移动
        fake_store.bodyList[0][activeArea].splice(activeUnit, 1)
        fake_store.bodyList[0][tmpActA].splice(j, 0, 'comp_active')
      }
      activeUnit = j
      ievent.emit('store.update')
    } else if (~activeArea) {  // 离开区域
      fake_store.bodyList[0][activeArea].splice(activeUnit, 1)
      activeUnit = -1
      ievent.emit('store.update')
    }
    activeArea = tmpActA
  }

  function locate(x,y) {
    y = y + scrollTop
    var tmpActA = -1
      , j = 0

    for (var i = 0; i < areaRect.length; i++) {
      if(x <= areaRect[i][2] && y <= areaRect[i][3] && x >= areaRect[i][0] && y >= areaRect[i][1]) {
        tmpActA = i
        break
      }
    }
    if (~tmpActA) {
      for ( ; j < units[tmpActA].length; j++) {
        if(y < units[tmpActA][j]) {
          break
        }
      }
    }
    return [tmpActA, j]
  }

  function mousedown(e) {  // 在鼠标真实移动之前，只记录目标和事件，不做后续处理
    mDownTarget = this
    mDownEvent = e

    $(document).on('mousemove', mousemove)
    $(document).on('mouseup', mouseup)
  }

  function mouseup() {
    if (!isMove) {
      mDownTarget = null
      mDownEvent = null
    } else {
      if (type) {
        $clone.remove()
      } else {
        $clone.hide()
      }
      if (~activeArea && ~activeUnit) {
        drop()
        update()
      }
      $clone = null
      $selected.removeClass('moveable')
      $selected = null
      isMove = false
    }

    $(document).off('mousemove', mousemove)
    $(document).off('mouseup', mouseup)
  }

  function mousemove(e) {
    if (isMove) {
      $clone.css({
        'top' : e.clientY - offsetY ,//+ scrollTop, 侧边栏是 fixed 的，里面的元素 absolute ，是相对它来定位，所以不用加 scroll
        'left' : e.clientX - offsetX ,//+ scrollLeft
      })
      active(e.clientX, e.clientY)
    } else {
      if (e.clientX !== mDownEvent.clientX || e.clientY !== mDownEvent.clientY) {
        isMove = true
        var rect = mDownTarget.getBoundingClientRect()
        $selected = $(mDownTarget)
        type = $selected.attr('data-type')
        $selected.addClass('moveable')

        if (type) {
          offsetX = e.clientX - rect.left
          offsetY = e.clientY - rect.top
          $clone = $selected
            .clone()
            .addClass('clone')
            .css({
              'left' : mDownTarget.offsetLeft,
              'top' : mDownTarget.offsetTop,
              'width' : rect.clientWidth,
              'height' : rect.clientHeight
            })

          $selected.before($clone)
        } else {
          offsetX = 18
          offsetY = 28
          $clone = $('#void').css({
            'left' : mDownEvent.clientX - 18,
            'top' : mDownEvent.clientY - 28
          }).show()
        }
        mDownArea = locate(mDownEvent.clientX, mDownEvent.clientY)[0]
      }
    }

  }

  function drop() {
    if (type) {  // 新增加组件
      var compId = 'comp_' + new Date().getTime()
      fake_store.bodyList[0][activeArea][activeUnit] = compId
      fake_store.componentList.push(compId)
      fake_store.components.push({
        id: compId,
        type:'d_default',
        title: $selected.attr('title'),
        url:''
      })
      ievent.emit('store.update')
    } else {   // 移动组件
      var compId = $selected.attr('id')
        , idx = fake_store.bodyList[0][mDownArea].indexOf(compId)

      if (!~idx) {   // 可能出现异常情况，直接忽略此次操作
        activeArea = -1
        activeUnit = -1
        return
      }

      var comp_moved = fake_store.bodyList[0][mDownArea].splice(idx, 1)[0]
      if (mDownArea === activeArea && idx < activeUnit) {
        fake_store.bodyList[0][activeArea][activeUnit - 1] = comp_moved  // 先有 comp_active ，移动时只要替换掉就可以了。
      } else {
        fake_store.bodyList[0][activeArea][activeUnit] = comp_moved
      }
      ievent.emit('store.update')
    }
    $('#' + compId).addClass('dropdown')
    activeArea = -1
    activeUnit = -1
    isMove = false
  }

  ievent.on('react.complate',complateX)

  window.addEventListener('scroll', function () {
    scrollTop = document.body.scrollTop
    scrollLeft = document.body.scrollLeft
  })

  $(document).on('mousedown', '.subComp, .panel', mousedown)
  $(document).on('animationend', function(e){ $(e.target).removeClass('dropdown') })

  return {active: active}
})(ievent, window.jQuery)
