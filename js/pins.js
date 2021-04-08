'use script';

// ----------------------------Создание и загрузка иконок обьектов

(function () {
    // Создание иконки обьекта на карте
    var mapPin = document.querySelector('template').content.querySelector('.map__pin');
    var mapPinsList = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    var createMapPin = function (array) {
        var mapPinElement = mapPin.cloneNode(true);
        mapPinElement.querySelector('img').src = array.author.avatar;
        mapPinElement.querySelector('img').alt = array.offer.title;
        mapPinElement.style.left = array.location.x  + "px"; 
        mapPinElement.style.top = array.location.y  + "px";
        mapPinElement.addEventListener('click', function () {
            var cardItem = document.querySelector('.map__card');
            if (cardItem) {
            cardItem.remove();
            };
            window.card.openPopup(array);
            makePinActive(mapPinElement);
        });
        mapPinElement.addEventListener('keydown', function(evt) {
            if (evt.keyCode === window.map.ENTER_KEYCODE) {
                window.card.openPopup(array);
            }
        });
        
        return mapPinElement;
    };

    // Добавление иконок в DocumentFragment
    var renderMapPins = function (array) {
        for (var j = 0; j < array.length; j++) {
            fragment.appendChild(createMapPin(array[j]));
        };
        mapPinsList.appendChild(fragment);
        
    };

    // Переход иконки обьекта на карте в активное состояние
    var makePinActive = function (pin) {
        var pinActive = mapPinsList.querySelector('.map__pin--active');
            if (pinActive) {
                pinActive.classList.remove('map__pin--active');
            };
            pin.classList.add('map__pin--active');
    };

    // Переход иконки обьекта на карте в неактивное состояние
    var makePinInactive = function () {
        var pinActiv = mapPinsList.querySelector('.map__pin--active');
        if (pinActiv) {
                pinActiv.classList.remove('map__pin--active');
            };
    };

    window.pins = {
        renderMapPins: renderMapPins,
        makePinActive: makePinActive,
        makePinInactive: makePinInactive,
        mapPinsList: mapPinsList
    };

}) ()

