;(function() {

	//-------------------------------------------------------Инициализация HTML кода
	//Заполняет табы с компонентами
	function initComponents(pizza, callback) {

        var size = pizza.size;
        $.get("template.html", function(strHtml){

            var lengthCycle = $('[id ^= tab-]').length;
			for (var i = 1; i <= lengthCycle; i++) {

				var elm = $("#tab-" + i).children(".box-components");
				elm.html('');
				$.each(_.data.getComponentsOfType(i), function(index, comp){

					elm.append(eval(`\`${strHtml}\``));
				});
			}

            callback(pizza);
        }, "html")

    }

	//Отмечаем компоненты пиццы
	function markComponents(pizza) {

        if (pizza.dough) { $("#" + pizza.dough).click();}
		if (pizza.size) { $("#" + pizza.size).click();}
		if (pizza.sauce) { $("#" + pizza.sauce).click();}
		if (pizza.sauceBase) { $('#sauces-select').val(pizza.sauceBase).change();}
        if (pizza.components.length > 0) {

 			pizza.components.forEach(function (comp) {

				var count = comp.count;
				while (count-- > 0) { $('[data-id=' + comp.id + ']').click(); }
			});
		}
    }

    //Меняет цену/вес для компонентов (и выбранных и остальных) в соответствии с размером пиццы
	function _setComponentsInfo(size) {

		var elms = $("#selected-components").children(".component"),
            lengthFor = $('[id ^= tab-]').length;
        elms.splice(0,1);
		_setInfoForEach(size, elms);
		for (var i = 1; i <= lengthFor; i++) {

			elms = $("#tab-" + i).children(".box-components").children(".wrap").children();
            _setInfoForEach(size, elms);
		}
	}

	//Цикл для смены цены/веса компонентов в соответствии с размером пиццы
	function _setInfoForEach(size, elms) {

		elms.each(function (index, elm) {

			var elmSizes = _.data.getComponent($(elm).attr("data-id")).sizes[size];
            $(elm).children(".component-info").children(".comp-weight").html(elmSizes.weight);
			$(elm).children(".component-info").children(".comp-price").html(elmSizes.price);
		});
	}


    //-------------------------------------------------------Добавляем события к элементам DOMа
	//Выбираем тип теста
    function selectTypeDough() {

        $("#base-type").on("click", "img", function() {

            var doughName = $(this).attr("id");
            $("#base-type").children("img").removeClass("current");
            $(this).addClass("current");
            $("#base-type-title").html($(this).attr("title"));
            _prepareSizesAvailable(doughName);
            _.currentPizza.setDough(doughName);
         });
    }

    //Подготовим доступные размеры
    function _prepareSizesAvailable(name) {

        $("#base-size").children("div").each(function(index,elm){

           if ($(elm).attr("id") in _.data.getDough(name).sizes) {
               $(elm).show();
           } else {
               $(elm).hide(0);
           }
        });
       if (name=="hot-dog"){ $("#M").click(); }
    }

    //Выбираем размер пиццы
    function selectSize() {

        $("#base-size").on("click", "div", function() {

            $("#base-size").children("div").removeClass("current");
            $(this).addClass("current");
            $("#base-size-title").html($(this).attr("title"));
            _.currentPizza.setSize($(this).attr("id"));
            _setComponentsInfo($(this).attr("id"));
        });
    }

    //Выбираем соус
    function selectSauce() {

        $("#base-sauce").on("click", "div", function() {

            $("#base-sauce").children("div").removeClass("current");
            $(this).addClass("current");
            $("#base-sauce-title").html($(this).attr("title"));
            _.currentPizza.setSauce($(this).attr("id"));
        });
    }

    //Выбираем соус (основа) в селекте соусов
    function selectSauceBase() {

		var elm = $('#sauces-select');
        elm.change(function(){

            $('#sauces-select-img').attr('src', elm.children('option:selected').attr('data-img'));
            _.currentPizza.setSauceBase(elm.children('option:selected').attr("value"));
        });
    }

    //Добавляем компоненты
    function selectComponent() {

	    var elms = $("#available-components").children(".tabs-components").children(".tab-page").children(".box-components");
        elms.on("click", ".component", function() {

        	var count = _.currentPizza.addComponent($(this).attr('data-id'));
            $(this).fadeOut(100, function() {

                if (count>1) { $(this).children(".component-count").show();}
                $(this).children(".component-count").html(count);
                $(this).children(".component-info").hide(0);
                $(this).appendTo("#selected-components").fadeIn(500);
                var componentImg = '<img class="component-pizza-img" src=' + $(this).attr('data-img') + '>';
                $('#pizza-img').append(componentImg);
            });
        });
    }

    //Увеличиваем кол-во выбранного компонента
    function addSelectedComponent() {

        $("#selected-components").on("click", ".component", function() {

            var elmCount = $(this).children(".component-count"),
                count =  _.currentPizza.addComponent($(this).attr('data-id'));
            $(elmCount).html(count);
            if (count > 1) {$(elmCount).show();}
		});
    }

    //Убираем дополнительные компоненты
    function deductSelectedComponent() {

        $("#selected-components").on("click", ".component .component-dec", function(event) {

            event.stopPropagation();
            var  elmThis = $(this).parent().parent(),
				count = _.currentPizza.deductComponent($(elmThis).attr("data-id")),
                elmCount = $(elmThis).children(".component-count");
            $(elmCount).html(count);
            if (count == 1) {$(elmCount).hide(0);}
            if (count < 1){

                $(elmThis).fadeOut(100, function() {

                    var elms = $("#tab-" + $(elmThis).attr("data-tab")).children(".box-components").children("span.wrap"),
                        pos = Number($(elmThis).attr("data-pos")),
                        attr = $(elmThis).attr("data-img");
                    $(elmThis).children(".component-info").show();
                    elms.eq(pos).append(elmThis);
                    $(elmThis).fadeIn(500);
                    $('[src="' + attr + '"]').remove();
                });
            }
        });
    }

    //Сохраняет пиццу в localStorage
    function saveCurrentPizza() {

        $("#save").on("click", function (event) {

            event.preventDefault();
			_.currentPizza.savePizza();
        })
    }

    function resetPizza() {

		$("#reset").on("click", function (event) {

			event.preventDefault();
            $("#selected-components").children().each(function(index, elm){
                if (index > 0) {elm.remove()}
            });
            $("#pizza-img").children().each(function(index, elm){
                if (index > 0) {elm.remove()}
            });
            _.currentPizza.clearComponents();
            _.initComponents(_.currentPizza.defaultVals(), _.markComponents);
        })

    }
    
    function sendToCart() {

	    $("#tocart").on("click", function () {

            var dough = _.data.getDough(_.currentPizza.dough).title,
                size = $("#" + _.currentPizza.size).attr("title") + " см.",
                sauce = $("#" + _.currentPizza.sauce).attr("title"),
                sauceBase = $('[value="' + _.currentPizza.sauceBase + '"]').html() ,
                components = '',
                weight = _.currentPizza.weight,
                price = _.currentPizza.price;

            _.currentPizza.components.forEach(function (comp) {
                components += _.data.getComponent(comp.id).title + ' (x' + comp.count + '); ';
            });

            alert("Вы заказали пиццу " + price + " грн./ " + weight + " гр.:" +
                "\n     тесто : " + dough + ";" +
                "\n     размер : " + size + ";" +
                "\n     соус : " + sauce + ";" +
                "\n     соус для основы : " + sauceBase + ";" +
                "\n     компаненты : " + components)
        });

    }

    var export_my = {
		"initComponents" : initComponents,
        "markComponents" : markComponents,
        "selectTypeDough" : selectTypeDough,
		"selectSize" : selectSize,
		"selectSauce" : selectSauce,
		"selectSauceBase" : selectSauceBase,
		"selectComponent" : selectComponent,
        "addSelectedComponent" : addSelectedComponent,
		"deductSelectedComponent" : deductSelectedComponent,
		"saveCurrentPizza" : saveCurrentPizza,
		"resetPizza" : resetPizza,
        "sendToCart" : sendToCart
	};

	window._ = export_my;
})();