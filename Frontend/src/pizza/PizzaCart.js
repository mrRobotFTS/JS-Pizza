/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var basil = require('basil.js');
basil = new basil();

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};
var sizeNames = {
    big_size: "Велика",
    small_size: "Мала"
}

var allPrice = 0;
var amountOfOrders = 0;

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
//HTML едемент куди будуть додаватися піци
var $cart = $(".buyList");
var flag=true;
function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    Cart.forEach(function(cart_item){
        if(cart_item.pizza.title==pizza.title&&cart_item.size==size) {
            cart_item.quantity += 1;
            allPrice += pizza[size].price;
            amountOfOrders += 1;
            flag=false;
            return;
        }
    });
    if(flag){
        allPrice += pizza[size].price;
        amountOfOrders += 1;
        Cart.push({
            pizza: pizza,
            size: size,
            nameSize: sizeNames[size],
            quantity: 1
        });
    }
    flag=true;
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

   if(Cart.indexOf(cart_item)!=-1) {
       allPrice -= (cart_item.pizza[cart_item.size].price)*cart_item.quantity;
       amountOfOrders -= cart_item.quantity;
       delete Cart[Cart.indexOf(cart_item)];
   }

    //Після видалення оновити відображення
    updateCart();
}

var $amountOfPizz = $(".amountOfBoughtPizz");
var $allPrice = $(".amountLabel");
function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    console.log(Cart);
    var savedOrders = basil.get('amountOfOrders');
    if(savedOrders>0){
        Cart = basil.get('orders');
        Cart = Cart.filter(function(x) {
            return x !== undefined && x !== null;
        });
        allPrice = basil.get('price');
        amountOfOrders = basil.get('amountOfOrders');
        console.log(Cart);
    }

    $(".orderButton").click(function () {
        if(Cart.length!=0){
            document.location.href = "http://localhost:5050/order.html";
        }
        console.log("button up");
    });

    $amountOfPizz.html("");
    $amountOfPizz.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice);
    $(".labelOrderDelete").click(function(){
        Cart.forEach(removeFromCart);
    });
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміст кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    $amountOfPizz.html("");
    $amountOfPizz.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice+" грн");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            allPrice += cart_item.pizza[cart_item.size].price;
            amountOfOrders += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity>1){
                cart_item.quantity -= 1;
                allPrice -= cart_item.pizza[cart_item.size].price;
                amountOfOrders -= 1;
            }
            else removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".removeButton").click(function(){
            removeFromCart(cart_item);
        });
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    basil.set("orders",Cart);
    basil.set("price",allPrice);
    basil.set("amountOfOrders",amountOfOrders);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;