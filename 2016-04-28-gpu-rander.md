# 强制GPU渲染测试

在chrome dev tool 中打开 Rendering 面板，观察一条 css 规则之间的差别。

勾选 `Enable paint flashing` 

1. 没有应用`transform: translate3d(0, 0, 0);`  示例的 `div` 就会一直在闪着绿色的框
2. 应用这个规则后就不会闪了。

`transform: translate3d(0, 0, 0);` 开启了GPU 去渲染对应的单元



```css
.block-1{
  position: relative;
  width: 200px;
  height: 80px;
  margin: 10px auto;
}

.block-1:after{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,0.12),0 1px 6px 0 rgba(0,0,0,0.12);
  opacity: 0;
  transform: translate3d(0, 0, 0);
  transition: opacity 0.1s ease-out;
}

.block-1:hover:after{
  opacity: 1;
}
```



用伪元素`:after` 来投影是不错的方式。