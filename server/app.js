
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods')


var app = express();

//use 与all的区别 use匹配路径基数，all匹配完整路径 
app.all('*', function (req, res, next) {
  // 允许的请求主机名及端口号 也可以用通配符*， 表示允许所有主机请求，但是如果想允许ajax携带cookie请求，需要指定域名，不可用通配符
  res.header("Access-Control-Allow-Origin", "http://localhost:8989");
  //表明服务器支持的请求类型
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  //表示服务器支持的请求数据类型
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // 允许请求携带cookie 
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './')));
app.use(session({
  secret: 'zzs',
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly:false,
  }
}))
//登录拦截，拦截在用户未登陆时访问需要权限的功能时
app.use('/',(req,res,next)=>{
  var permit = ['/goods/list','/users/login'];
  if(req.session.user){
    next();
  }else if(permit.indexOf(req.path) > -1){
    next();
  }else{
    res.json('');
  }
})
app.use('/checkLogin', (req, res,next) => {
  if(req.session.user){
    res.json(req.session.user)
  }else{
    res.json('');
  }
});
app.use('/users',usersRouter);
app.use('/goods',goodsRouter);

// error handler
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('Something broke!')
});

app.listen(3000,()=>{
  console.log('server is run');
})
