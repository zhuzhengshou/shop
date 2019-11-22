var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shop');
var Schema = mongoose.Schema;
var UsersSchema = new Schema({
    userId:String,
    userName:String,
    userPwd:String,
    orderList:Array,
    cartList:[
        {
            productId:String,
            productName:String,
            salePrice:Number,
            productImage:String,
            checked:Boolean,
            productNum:Number
        }

    ],
    addressList:[
        {
            addressId:String,
            userName:String,
            streetName:String,
            postCode:Number,
            tel:String,
            isDefault:Boolean
        }
    ]
});
var Users = mongoose.model('Users', UsersSchema);
//  模拟数据
/*var arr = [
    ['001', '大白一号', '123456', [], [], []],
    ['002', '大白二号', '123456', [], [], []],
    ['002', '大白三号', '123456', [], [], []]
]
for(var i = 0;i<arr.length;i++){
    var g1 = new Users({
      userId: arr[i][0],
      userName: arr[i][1],
      userPwd: arr[i][2],
      orderList: arr[i][3],
      cartList: arr[i][4],
      addressList: arr[i][5]
    });
    g1.save();
}*/

module.exports = Users;