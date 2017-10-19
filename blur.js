// 模糊搜索组件***************************
// 失焦input事件
$(document).on('click', function () {
  $('.dia-show').attr('class', 'dia-show hidden'); 
})
// input注册input事件 选择器(input的父级们)，要渲染的列表，开始显示滚动条的条目数(可省)，点击列表回调函数(可省)
function bindInput(select, targetList, length = 5, callBack) {
  $(document).on('input', select + ' input', function () {
    console.log('fff')
    var eKey = false // 判断是否有匹配
    if ($(this)[0].value) {
      $(this).nextAll('.dia-show').removeClass('hidden');
      $(this).nextAll('.dia-show').find('li').remove();
      for (var value of targetList) {
        if (value.indexOf($(this)[0].value) > -1) {
          eKey = true;
          value = value.replace($(this)[0].value, '<i>'+ $(this)[0].value +'</i>');
          $(this).nextAll('.dia-show').find('.dia-content')
            .append('<li>' + value + '</li>');
        }
      }
      if(!eKey) {
        $(this).nextAll('.dia-show').addClass('hidden');
      }
      // 是否显示滚动条
      if ($(this).nextAll('.dia-show').find('li').length > length) {
        $(this).nextAll('.dia-show').find('.scroll').show();
        $(this).nextAll('.dia-show').height(40 * length);
        drawScroll($(this).parent());
      } else {
        $(this).nextAll('.dia-show').height($(this).nextAll('.dia-show').find('li').length * 40)
        $(this).nextAll('.dia-show').find('.scroll').hide();
      }
    } else {
      $(this).nextAll('.dia-show').addClass('hidden');// input没有值列表隐藏  
    }
  })
  // list列表点击添加unit事件 callback为点击列表后的事件默认将列表值传入input
  if (!callBack) {
    $(document).on('click', select + ' .dia-show .dia-content li', function (e) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation();
      $(this).parents('.user-input').find('input')[0].value = $(this).text();
      $(this).parents('.dia-show').addClass('hidden');
    });
  } else {
    $(document).on('click', '.dia-show .dia-content li', callBack);
  }
}
// 模拟滚动条
function drawScroll(that){
  //元素获取
  var oWrap = that.find('.dia-show'), // 内容区容器
    oContent  = oWrap.find('.dia-content'), // 内容
    oScrWrap =  oWrap.find('.scroll'), // 滚动条容器
    oScrBar =  oScrWrap.find('.bar'); // 滚动条
  //初始化
  var height = oScrWrap.height()*oWrap.height()/oContent.height(); // 因为内容的高度要高于内容的容器，所以内容区高度/内容高度 == 滚动条高度/滚动条容器高度
  $('.bar').css({
    "top": '0px',
    "height": height
  });
  //添加滚动事件
  var t = oScrBar[0].offsetTop; // 滚动条距离上端的距离
  addScroll(oWrap[0] , function(down){
    if(down){// 下滚
      t += 10;
    }else{// 上滚
      t -= 10;
    }
    setTop();
  });
  // 阻止oScrBar点击冒泡事件
  $(document).on('click', oScrBar, function (e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
  })
  // 添加鼠标拖拽事件
  oScrBar.on('mousedown', function (e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    var oTop = e.pageY;
    var cTop = 0;
    var T = t;
    $(document).on('mousemove', function (e) {
      cTop = e.pageY;
      t = T + cTop - oTop;
      setTop();
    })
      $(document).on('mouseup', function () {
        $(document).off('mousemove').off('mouseup');;
      })
  })
  //设置滚动条函数
  function setTop (){
    var nMax=oScrWrap.height() - oScrBar.height(); // 最大的滚动距离
    if(t>=nMax){
      t=nMax;
    }
    if(t<=0) {
      t=0;
    }
    var top=t/nMax*(oWrap.height()-oContent.height()); // t/滚动条最大运动距离 == top/最大内容运动距离
    oContent.css("top" , top); // 滚动条向上滚，内容向下就内容容器高度-内容高度
    oScrBar.css("top" , t);
  }
}
// 滚轮事件函数
function addScroll(obj, fn){ // obj为内容区容器（dom），fn为回调函数    
  // 判断浏览器，加事件
  if (window.navigator.userAgent.indexOf('Firefox') != -1){
    obj.addEventListener('DOMMouseScroll', _setDown, false);
  }
  else{ // IE Chrome
    obj.onmousewheel=_setDown;
  }   
  function _setDown(ev){
    var oEvent=ev||event;
    var down=false;         
    // 判断down
    if (oEvent.wheelDelta){ // IE chrome
      if (oEvent.wheelDelta < 0){ // 向下
        down=true;
      }
      else{
        down=false;
      }
    }else{
      if (oEvent.detail < 0){ // 向上
        down=false;
      }
      else{
        down=true;
      }
    }           
    fn(down);           
    oEvent.preventDefault && oEvent.preventDefault();
    return false;
  }
}
// **********************************************