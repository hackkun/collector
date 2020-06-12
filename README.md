# web 埋点 【未完成】

```
* 异常捕获错误信息
{
  type: 错误类型,
  appid: 项目id,
  url: 当前url,
  os: 平台,
  bsName: 浏览器名字,
  bsVer: 浏览器版本,
  time: 错误发生时间
  file: 错误文件,
  msg: 错误信息,
}

* 数据监控信息
{

}

* 性能监控
{

}

* 自定义监控信息
{
  evtid: 事件id
  extra: 事件数据
}
```

## 数据监控

- PV/UV:PV(page view)，即页面浏览量或点击量。UV:指访问某个站点或点击某条新闻的不同 IP 地址的人数
- 用户在每一个页面的停留时间
- 用户通过什么入口来访问该网页
- 用户在相应的页面中触发的行为

![上报的数据](https://user-gold-cdn.xitu.io/2018/8/2/164fa1642bb839ad?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 性能监控

- 不同用户，不同机型和不同系统下的首屏加载时间
- 白屏时间
- http 等请求的响应时间
- 静态资源整体下载时间
- 页面渲染时间
- 页面交互动画完成时间

## 异常监控

- 内部 js 异常
- 外部 js 异常
- 接口请求异常
- 样式丢失的异常监控

## 自定义统计数据

## 上报周期和上报数据类型

- 如果埋点的事件不是很多，上报可以时时进行，比如监控用户的交互事件，可以在用户触发事件后，立刻上报用户所触发的事件类型。如果埋点的事件较多，或者说网页内部交互频繁，可以通过本地存储的方式先缓存上报信息，然后定期上报
  who: appid(系统或者应用的 id),userAgent(用户的系统、网络等信息)
  when: timestamp(上报的时间戳)
  from where: currentUrl(用户当前 url)，fromUrl(从哪一个页面跳转到当前页面)，type(上报的事件类型),element(触发上报事件的元素）
  what: 上报的自定义扩展数据 data:{},扩展数据中可以按需求定制，比如包含 uid 等信息

## 前端监控结果可视化展示系统的设计

- 单个用户，在交互过程中触发各个埋点事件的次数
- 单个用户，在某个时间周期内，访问本网页的入口来源
- 单个用户，在每一个子页面的停留时间

* api 请求数据采集
* PV & UV
* 页面进入 & 页面退出
* 按钮点击 / 链接点击
  > 停留时长、转化率、热力图
* 热力图：用于反映图中点的密集程度，在此处我们利用点击的坐标（点击的 x,y 坐标位置，再根据屏幕分辨率做一致性的换算）组合成点击热图，![如下图所示](https://user-gold-cdn.xitu.io/2020/2/9/17028dd47bd7ddf9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
// 统一拦截ajax请求
function ajaxEventTrigger (event) {
    var ajaxEvent = new CustomEvent(event, { detail: this })
    window.dispatchEvent(ajaxEvent)
}

var oldXHR = window.XMLHttpRequest
function newXHR () {
    var realXHR = new oldXHR()
    realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange') }, false)
    return realXHR
}
window.XMLHttpRequest = newXHR
var startTime = 0
var gapTime = 0 // 计算请求延时
window.addEventListener('ajaxReadyStateChange', function (e) {
    var xhr = e.detail
    var status = xhr.status
    var readyState = xhr.readyState
    /**
     * 计算请求延时
     */
    if (readyState === 1) {
        startTime = (new Date()).getTime()
    }
    if (readyState === 4) {
        gapTime = (new Date()).getTime() - startTime
    }
    /**
     * 上报请求信息
     */
     if (readyState === 4) {
        if(status === 200){
            // 接口正常响应时捕获接口响应耗时
            console.log('接口',xhr.responseURL,'耗时',gapTime)
         }else{
            // 接口异常时捕获异常接口及状态码
            console.log('异常接口',xhr.responseURL,'状态码',status)
        }
     }
})
```

### 对用户行为进行获取

```
 evtMoniter() {
        if(EventTarget) {
            let original_addEventListener = EventTarget.prototype.addEventListener, self = this;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                let that = this;
                original_addEventListener.call(this, type, (function() {
                    return function(evt) {
                       // 需要跟踪的用户事件
                       // const evtMoniterTypes = ['click', 'tap', 'input'];
                        if(evtMoniterTypes.indexOf(type) != -1) {
                            let attrs = {}, _attrs = {};
                            if(_attrs = that.attributes) {
                                for(let key in _attrs) {
                                    if(_attrs[key]['value'] != undefined) {
                                        attrs[_attrs[key]['name']] = _attrs[key]['value'];
                                    }
                                }
                            }
                            self.evtMoniters.push({
                                node: {
                                    url: that.baseURI, //错误页面地址
                                    nodeName: that.nodeName, //事件节点名
                                    attrs: attrs, //事件节点属性列表
                                    textContent: that.textContent // 节点内容
                                },
                                type: type
                            });
                            if(self.evtMoniters.length > 10) {
                                self.evtMoniters.shift();
                            }
                        }
                        listener(evt);
                    }
                })(), options);
            }
        }
        return this;
    }
```
