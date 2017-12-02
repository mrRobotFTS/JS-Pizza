var Templates = require('./Templates');

$(function(){
    //This code will execute when the page is ready
    var orderName = $("#inputName");
    var orderPhone = $("#inputPhone");
    var orderAddress = $("#inputAddress");

    $("#inputPhone").keyup(function () {
        var Value = $(this).val();
        var flag= true;

        var l = Value.length;
        if(l>=1&&(Value[0]!="0"&&Value[0]!='+'))flag = false;
        if(l<6||l>14)flag = false;
        for(var i=1;i<l;i++) if(!(Value[i]>='0'&&Value[i]<='9'))flag=false;

        if(!flag){
            $(".phoneForm").addClass("has-error");
            $(".phoneForm").removeClass("has-success");
            $(".uncorrectPhone").removeClass("displayNone");
        }
        else  {
            $(".phoneForm").removeClass("has-error");
            $(".phoneForm").addClass("has-success");
            $(".uncorrectPhone").addClass("displayNone");
        }
    });

    $("#inputName").keyup(function () {
        var Value = $(this).val();
        var flag= true;

        var l = Value.length;
        for(var i=0;i<l;i++) if((Value[i]>='0'&&Value[i]<='9'))flag=false;

        if(!flag){
            $(".nameForm").addClass("has-error");
            $(".nameForm").removeClass("has-success");
            $(".uncorrectName").removeClass("displayNone");
        }
        else  {
            $(".nameForm").removeClass("has-error");
            $(".nameForm").addClass("has-success");
            $(".uncorrectName").addClass("displayNone");
        }
    });

    var amount = 0;
    var price = 0;

    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);
        var $cart = $(".buyList");
        price+=cart_item.pizza[cart_item.size].price*cart_item.quantity;
        amount+=cart_item.quantity;
        $cart.append($node);
    }

    var serv = require('./API');
    var Cart = [];

    serv.getPizzaInOrder(function(err,data){
        if(err){
            console.log('Empty order list');
        }
        //Виконуємо якщо сервер не повернув помилку. data - масив піц в кошику
        else {
            Cart = data;
            console.log("array");
            console.log(Cart);
            if(Cart.length>0)Cart.forEach(showOnePizzaInCart);
            $('.amountLabel').html(price+" грн");
            $('.amountOfBoughtPizz').html(amount);
            $('.orderButton').click(function () {
                document.location.href = "http://localhost:5050";
            });
            // $('.orderButton').html("Редагувати замовлення");
            // $('.orderButton').attr("class","btn btn-default btn-lg btn-block orderButton")
        }
    });

    $('.submitButton').click(function () {
        if($(orderPhone).hasClass("has-success")&&$(orderName).hasClass("has-success")&&$(orderAddress).val())
        require("./API").createOrder({name:$(orderName).val(),phone:$(orderPhone).val(),address:$(orderAddress.val()),pizz:Cart},function () {
            console.log("order created");
            // console.log({name:$(orderName).val(),phone:$(orderPhone).val(),address:$(orderAddress).val()});
        });
        else {
            if (!$(".nameForm").hasClass("has-success")) {
                $(".nameForm").addClass("has-error");
                $(".nameForm").removeClass("has-success");
                $(".uncorrectName").removeClass("displayNone");
            }
            if (!$(".phoneForm").hasClass("has-success")) {
                $(".phoneForm").addClass("has-error");
                $(".phoneForm").removeClass("has-success");
                $(".uncorrectPhone").removeClass("displayNone");
            }
            if(orderAddress.val()==""){
                $(".addressForm").addClass("has-error");
                $(".addressForm").removeClass("has-success");
                $(".uncorrectAddress").removeClass("displayNone");
                $(".addressForm").keyup(function () {
                    $(".addressForm").removeClass("has-error");
                    $(".addressForm").addClass("has-success");
                    $(".uncorrectAddress").addClass("displayNone");
                });
            }
        }
    });


});

