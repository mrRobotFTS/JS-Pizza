/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

var order_info = [];
//створює замовлення що складається зі списка піц
exports.createOrder = function(req, res) {
    order_info = req.body;
    console.log("Creating Order", order_info);

    res.send({
        success: true
    });
};

exports.getPizzaInOrder = function(req,res){
    res.send(order_info);
};
var order_list = [];
exports.createAllOrder = function(req,res) {
    order_list.push(req.body);
    console.log("order created: ", req.body);
    res.send({
        success:true
    });
}