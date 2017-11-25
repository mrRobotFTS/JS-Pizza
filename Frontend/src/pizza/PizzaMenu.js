/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../../../Backend/data/Pizza_List');

var pizzaCategories = {
    all: 'all',
    vega: 'Вега піца',
    meat: 'meat',
    ocean: 'ocean',
    pineapple: 'pineapple',
    mushroom: 'mushroom'
}

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-button-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-button-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    if(filter==pizzaCategories.all) pizza_shown = Pizza_List;
    else{
        if(filter==pizzaCategories.meat||filter==pizzaCategories.pineapple||filter==pizzaCategories.ocean||filter==pizzaCategories.mushroom)
            Pizza_List.forEach(function(pizza){
                // console.log(pizza.content.hasOwnProperty(filter),1222);
                if(pizza.content.hasOwnProperty(filter))pizza_shown.push(pizza);
            });
        else Pizza_List.forEach(function(pizza){
            if(pizza.type==pizzaCategories.vega)pizza_shown.push(pizza);
        });
    }


    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    var list = $(".typeOfPizz");
    var l = list.length;
    $(".typeOfPizz").each(function (i,value) {

        value = $(value);
        value.click(function () {
            for(var j=0;j<l;j++) if(j!=i) $(list[j]).removeClass("activeMenu");
            value.addClass("activeMenu");
            filterPizza(value.attr("id"));
        });
        // console.log(list[i]);
        // console.log("value = ",value,i);
    });
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;