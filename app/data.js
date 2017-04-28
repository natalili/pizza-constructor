;(function() {

	//Загружает данных о компонентах для пиццы в sessionStorage
	function _getJSONComponents(callback) {

		$.getJSON("data/components.json", function(result) {

			window.sessionStorage.components = JSON.stringify(result);
            if (callback) { callback();	}
        });
	}

	//Получает коллекцию компонентов для пиццы из sessionStorage
	function getComponents() {

		if (window.sessionStorage.components) {

            return JSON.parse(window.sessionStorage.components);
		} else {

            _getJSONComponents(function () {
                return  JSON.parse(window.sessionStorage.components)
            })
        }
    }

    //Получает коллекцию компонентов для пиццы конкретного типа
	function getComponentsOfType(typeNum) {

		return (getComponents()).filter(function(obj){return obj.type == typeNum})
    }

    //Получает компонент для пиццы по id
    function getComponent(compId) {

		return getComponents().filter(function(obj){return obj.id == compId})[0]
    }

    //Загружает данных о тесте для пиццы в sessionStorage
	function _getJSONDoughs( callback) {

		$.getJSON("data/dough.json", function(result){

            window.sessionStorage.doughs = JSON.stringify(result);
            if (callback) { callback(); }
		});
	}

    //Получает коллекцию теста для пиццы из sessionStorage
    function getDoughs() {

		if (window.sessionStorage.doughs) {

            return JSON.parse(window.sessionStorage.doughs);
		} else {

			_getJSONDoughs(function () {

                return JSON.parse(window.sessionStorage.doughs);
            })
		}
    }

    //Получает тесто для пиццы по name
    function getDough(name) {

		return (getDoughs()).filter(function(obj){return obj.name == name})[0];
    }

    //Инициализирует данные в sessionStorage
	function initData() {

		_getJSONComponents();
		_getJSONDoughs();
	}


	var export_my = {
		"getDoughs" : getDoughs,
		"getDough" : getDough,
		"getComponents" : getComponents,
        "getComponentsOfType" : getComponentsOfType,
        "getComponent" : getComponent,
		"initData" : initData
	};

	window._.data = export_my;

})();