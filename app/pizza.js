;(function() {

    //Класс для создания пиццы
	function Pizza(){
		this.dough = "";
		this.size = "";
		this.sauce = "";
		this.sauceBase = "";
		this.components = [];
		this.weight = 0;
		this.price = 0;
	}

    //Выбирает компоненты для инициализации ( по умолчанию или из сохраненной пиццы )
	Pizza.prototype.initPizzaVals = function () {

	    return window.localStorage.pizza ? this._savedPizzaVals() : this.defaultVals();
    };

	//Устанавливает компоненты пиццы по умолчанию
	Pizza.prototype.defaultVals = function () {

	    return {
            "dough" : "americano",
            "size" : "L",
            "sauce" : "garlicky",
            "sauceBase" : "tomato",
            "components" : [
                {
                    "id": 402,
                    "count": 1
                }
            ]
        }
	};

	//Устанавливает тип теста dough
	Pizza.prototype.setDough = function (newVal) {

        if (_.data.getDough(newVal)) { this.dough = newVal; }
        this._calculate();
    };

	//Устанавливает размер теста size
    Pizza.prototype.setSize = function (newVal) {

        if (_.data.getDough(this.dough).sizes[newVal]) {  this.size = newVal; }
        this._calculate();
    };

    //Устанавливает соус sauce
	Pizza.prototype.setSauce = function (newVal) {

	    this.sauce = newVal;
	    this._calculate();
    };

	//Устанавливает соус для основы sauceBase
	Pizza.prototype.setSauceBase = function (newVal) {

	    this.sauceBase = newVal;
	    this._calculate();

    };

	//Очищает массив компонентов
	Pizza.prototype.clearComponents = function () {

	    this.components = [];
        this._calculate();
    };

    //Добавляет начинки для пиццы
    Pizza.prototype.addComponent = function(compId) {

        if (_.data.getComponent(compId)) {

            var count = 1,
				comp = this.components.filter(function(obj){return obj.id == compId});
            (comp.length > 0) ? count = ++comp[0].count : this.components.push({"id": compId, "count": count});
        }
        this._calculate(); //пересчитать вес и сумму
        return count;
    };

    //Отнимает начинку с пиццы
    Pizza.prototype.deductComponent = function(compId) {

        var comp = this.components.filter(function(obj){return obj.id == compId})[0],
			index = this.components.indexOf(comp);
        if (comp) {

            --comp.count;
			if (comp.count < 1) { this.components.splice(index, 1); }
        }
        this._calculate(); //пересчитать вес и сумму
        return comp.count;
    };

    //Пересчитывает вес и сумму для собранной пиццы
    Pizza.prototype._calculate = function() {

        var arrParam = ["weight", "price"],
		    self = this;
        arrParam.forEach(function (param) {

            if (!!self.dough && !!self.size) {

                self[param] = 0;
                if (self.components.length > 0) {

                    self.components.forEach(function (comp) {

                        var count = comp.count;
                        if (comp.id == 402) { count -= 1;}
                        self[param] += _.data.getComponent(comp.id).sizes[self.size][param] * count;
                    })
                }
                self[param] += _.data.getDough(self.dough).sizes[self.size][param];
                $("#order-" + param).html(self[param]);
            }
        });
		this._checkWeight(1500); // проверить пересчитанный вес
	};

    //Сохраняет в localStorage собранную пиццу
    Pizza.prototype.savePizza = function () {

        window.localStorage.pizza = JSON.stringify(this);
    };

    //Устанавливает компоненты пиццы из сохраненной
    Pizza.prototype._savedPizzaVals = function () {

        return  JSON.parse(window.localStorage.pizza);
    };

    //Проверяет вес пиццы на допустимость
    Pizza.prototype._checkWeight = function (maxWeight) {

        var quotient;
        if (this.size == "L") { quotient = 1 }
        if (this.size == "M") { quotient = 0.75 }
        if (this.size == "S") { quotient = 0.5 }
        var _maxWeight = (Math.round((maxWeight * quotient)/100))*100;
        if (this.weight > _maxWeight) {

            $("#error-message").html("Вес пиццы превышает допустимые " + _maxWeight + " грамм!");
            $("#tocart").attr('disabled',true);
        } else {

            $("#error-message").html("");
            $("#tocart").attr('disabled',false);
        }
    };

	window._.Pizza = Pizza;
})();