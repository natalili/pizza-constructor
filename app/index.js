"use strict";

_.data.initData(); //Инициализируем данные в sessionStorage
_.currentPizza = new _.Pizza(); //Создаем текущую пиццу

$(document).ready(function() {

	//Отображаем компоненты
    _.initComponents(_.currentPizza.initPizzaVals(), _.markComponents);

    //Добавляем события к элементам DOMа
    _.selectTypeDough();
    _.selectSize();
    _.selectSauce();
	_.selectSauceBase();
	_.selectComponent();
	_.addSelectedComponent();
	_.deductSelectedComponent();
	_.saveCurrentPizza();
	_.resetPizza();
	_.sendToCart()
});
