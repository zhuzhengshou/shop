# shop

> a private vue shop project

### 1.实现的功能
#### 1.1实现账户的自由登录与退出，并且可以实现自主选择的一天内账号免登录
#### 1.2商品根据价格区间筛选以及按照默认，价格升序，价格降序三种排序
#### 1.3商品懒加载与无限加载(数据库允许情况下)
#### 1.4 对购物车的商品的进行数量和状态的修改以及删除
#### 1.5 付款时收货地址的切换，设置默认以及删除

### 遇到的问题
#### 1.webpack热部署的服务器请求node服务器端口不同，跨域，解决办法
    1.jsonp，
    2.webpack的proxyTable设置跨域，
    3.Node设置开源头
        app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
        });
#### 2.express中的错误处理中间件如果不经过next()，是无法到达错误处理函数的
#### 3.使用懒加载减少http请求，原理是图片src属性为默认的加载图片，将真实图片的地址放在自定义属性中，这样就不会在第一次加载页面的时候请求真实图片的地址，利用onScroll监听资源所在位置，当资源进入屏幕视口时，将自定义属性的值替换src属性
#### 4.每次重新筛选商品时（切换价格区间或者切换商品排序）都需要重置请求页数为1以及可以再次滑动加载
#### 5.axios会帮我们 转换请求数据和响应数据 以及 自动转换 JSON 数据,返回的数据是不需要手动解析JSON数据的，但是同时请求的类型也自动设置为application/json,如果后端想解析这种类型的Post请求，从前后端角度有两种解决办法
    #后端解决方案为使用 body-parser中间件(bodyParser.json())即可通过req.body查看请求数据

    #前端的解决方案为用 URLSearchParams 传递参数,这样会构造出编码格式为application/x-www-form-urlencoded,并且数据放在请求主体中，但是要注意浏览器的支持性
#### 6.因为mongdb数据库中的_id类型是Object,想要实现比较，需要String()获取对象的值
#### 7.在mongdb数据中，如果有字段是数组的话，想修改数组的值，有两种办法
    # 7.1修改完数组字段中的内容后，使用document.markModified(filedName)
    # 7.2 在创建Schema的时候为数组字段中的每个值指定类型，就可直接修改数组字段中的内容
#### 8.Promise的resolved回调函数只能接收一个参数，如果想接受多个， 需要以此种方式resolved([param1,param2,param3])或者放在一个对象中，第一种更方便
#### 9.默认情况下axios跨域是不可以携带cookie的，解决方案如下
    1.res.header("Access-Control-Allow-Origin", "http://localhost:8989");(必须指定域名，不可用通配符，否则也会报错)
    2.res.header("Access-Control-Allow-Credentials", true);允许请求携带cookie
    3.axios.defaults.withCredentials = true;
#### 10.从Mongdb取出的document可以修改原有的字段，但是不能直接增加字段，因为查询到的是Document类型而不是Object类型，两种解决办法
    1.直接在mongoose创建Schema的时候添加上未来要增加的字段
    2.mongoose为Document类型提供了toObject()方法，转换为对象后,即可修改，删除，增加，建议使用第二种