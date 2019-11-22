var express = require('express');
var router = express.Router();
var User = require('../models/User');
require('../util/util');
function findUser(req) {
  return new Promise((resolved, reject) => {
    User.findOne({
        userId: req.session.user.userId
      })
      .exec((err, userDoc) => {
        if (err) reject(err);
        else {
          resolved(userDoc);
        }
      })
  })
}
/* 登录 */
router.post('/login', function (req, res, next) {

  User.findOne({
      userName: req.body.userName,
      userPwd: req.body.userPwd
    })
    .exec((err, userDoc) => {
      if (err) next(err)
      else {
        if (req.body.isNoLogin === 'true') {
          req.session.cookie.maxAge = 1000 * 3600 * 24;
        }
        req.session.user = userDoc;
        res.json(userDoc);
      }
    })
});
router.post('/logout', (req, res) => {
  req.session.user = null;
  res.json('1');
})
//获取购物车列表
router.get('/cartList', (req, res, next) => {
  findUser(req)
    .then((userDoc) => {
      var cartList = userDoc.cartList;
      res.json(cartList);
    })
    .catch(next)
})
//删除购物车商品
router.post('/delCart', (req, res, next) => {
  var productId = req.body.productId;
  //修改数组字段需要的
  User.update({
      userId: req.session.user.userId
    }, {
      $pull: {
        cartList: {
          productId: productId
        }
      }
    })
    .exec((err, userDoc) => {
      if (err) next(err)
      else {
        //判断是否影响了指定字段
        if (userDoc.n > 0) {
          res.json('删除成功');
        }
      }
    })
})
//编辑购物车商品的信息
router.post('/editCart', (req, res, next) => {
  var userId = req.session.user.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({
    "userId": userId,
    "cartList.productId": productId
  }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
  }, (err, userDoc) => {
    if (err) next(err)
    else {
      if (userDoc.n > 0) {
        res.json('更新成功');
      }
    }
  })
})

// 商品全选或者全不选
router.post('/toggleAll', (req, res, next) => {
  var checkAll = req.body.checked === '1' ? true : false;
  findUser(req)
    .then((userDoc) => {
      userDoc.cartList.forEach((item) => {
        item.checked = checkAll;
      })
      userDoc.save((err, doc) => {
        if (err) next(err)
        else {
          res.json('更新成功');
        }
      })
    })
    .catch(next)
})
//获取用户收货地址
router.get('/addressList', (req, res, next) => {
  findUser(req)
    .then(userDoc => {
      res.json(userDoc.addressList);
    })
    .catch(next)
})
//改变用户的默认收货地址
router.post('/changeDefaultAddress', (req, res, next) => {
  var id = req.body.addressId;
  findUser(req)
    .then(userDoc => {
      userDoc.addressList.forEach(item => {
        item.isDefault = item.addressId === id ? true : false;
      })
      userDoc.save((err, doc) => {
        if (err) next(err)
        else {
          res.json('修改成功');
        }
      })
    })
    .catch(next)
})
//删除用户的某个收货地址
router.post('/delAddress', (req, res, next) => {
  var id = req.body.addressId;
  var isDefault = false;

  function delAddress(userDoc) {
    return new Promise((resolved, reject) => {
      userDoc.addressList.forEach((item, i, arr) => {
        if (item.addressId === id) {
          if (item.isDefault === true) {
            isDefault = true;
          }
          arr.splice(i, 1);
        }
      })
      if (isDefault) { //如果删除的地址是默认地址，则将地址列表中的第一个地址设为默认地址
        userDoc.addressList[0].isDefault = true;
      }
      userDoc.save((err, doc) => {
        if (err) reject(err)
        else {
          resolved('修改成功');
        }
      })
    })
  }
  findUser(req)
    .then(delAddress)
    .then((data) => {
      res.json(data);
    })
    .catch(next)
})
//支付成功后创建订单
router.post('/payMent', (req, res, next) => {
  var addressId = req.body.addressId;
  var orderTotal = req.body.orderTotal;
  var orderStatus = 1; //订单的状态：待发货，已发货，已收货
  function addOrder(userDoc) {
    return new Promise((resolved, reject) => {
      //用户的订单地址信息
        
      var address = userDoc.addressList.filter(item => {
        return item.addressId === addressId;
      })
      //用户已经下单的商品
      var goodsList = userDoc.cartList.filter(item => {
        return item.checked === true
      })
      var order = {
        orderId: '123'+new Date().Format('yyyymmddhhmmss')+'456',
        orderTotal,
        orderStatus,
        goodsList,
        createDate: new Date().Format('yyyy-mm-dd hh:mm:ss'),
        addressInfo:address
      }
      userDoc.orderList.push(order);
      //订单创建成功后，将购物车里选中的商品清除
      userDoc.cartList.forEach((item,i,arr)=>{
          if(item.checked === true){
            arr.splice(i,1);
          }
      })
      userDoc.save((err,doc)=>{
        if (err) reject(err)
        else{
          resolved({orderId:order.orderId,orderTotal:order.orderTotal});
        }
      })
    })
  }
  findUser(req)
    .then(addOrder)
    .then((data)=>{
      res.json(data);
    })
    .catch(next)
})
//查询订单
router.get('/getOrder',(req,res,next)=>{
  findUser(req)
  .then((userDoc)=>{
    var orderId = req.query.orderId;
    var order = userDoc.orderList.filter(item=>{
      return item.orderId === orderId;
    })
    res.json(order[0]);
  })
  .catch(next)
})
//查询用户购物车数量
router.get('/cartCount',(req,res,next)=>{
  findUser(req)
  .then((userDoc)=>{
    var count = userDoc.cartList.length;
    res.json(count);
  })
  .catch(next)
})
module.exports = router;
