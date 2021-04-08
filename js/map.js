'use strict';

(function () {
    var map = document.querySelector('.map');
    var OBJECT_TYTLES = ["Большая уютная квартира", "Маленькая неуютная квартира", 
    "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик",
    "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", 
    "Неуютное бунгало по колено в воде"];
    var OBJECT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
    var OBJECT_CHECKIN = ['12:00', '13:00', '14:00'];
    var OBJECT_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
    var objectPhotos = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", 
                        "http://o0.github.io/assets/images/tokyo/hotel2.jpg", 
                        "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;
    
    var objectsList = [];
    var adIndex = 0;
    var coordinates = {
        x: {min: 200, max: 1200},
        y: {min: 100, max: 600}
    };
    var PRICE = {
        min: 100,
        max: 1000
    };
    var GUESTS = {
        min: 1,
        max: 10
    }; 
    var ROOMS = {
        min: 1,
        max: 5
    };
    var TOTAL_OBJECTS = 8;

    var PIN_SIZE = {
        WIDTH: 40,
        HEIGHT: 40
    };
    var mainPin = document.querySelector('.map__pin--main');
    var fragment = document.createDocumentFragment();

    // Подбор адреса изображения
    var getAuthorAvatar = function () {
        var path = "img/avatars/user";
        adIndex++;
        return (adIndex < 10) ? (path + '0' + adIndex + '.png') : (path + adIndex + '.png');
    };

    // Создание обьекта недвижимости
    var getObjectItem = function () {
        var objectItem = {
            'author': {
                'avatar': getAuthorAvatar(),
            },  
            'offer': {
                'title': window.utils.getRandomElement(OBJECT_TYTLES, true),
                'adress': window.utils.getRandomNumber(coordinates.x.min, coordinates.x.max) + ', ' + window.utils.getRandomNumber(coordinates.y.min, coordinates.y.max),
                'price': window.utils.getRandomNumber(PRICE.min, PRICE.max),
                'type': window.utils.getRandomElement(OBJECT_TYPES),
                'rooms': window.utils.getRandomNumber(ROOMS.min, ROOMS.max),
                'guests': window.utils.getRandomNumber(GUESTS.min, GUESTS.max),
                'checkin': window.utils.getRandomNumber(12, 14) + ':00',
                'checkout': window.utils.getRandomNumber(12, 14) + ':00',
                'features': window.utils.getRandomArray(OBJECT_FEATURES),
                'description':'',
                'photos': window.utils.getRandomShuffleArray(objectPhotos)
            },
            'location': {
                'x': window.utils.getRandomNumber(coordinates.x.min, coordinates.x.max) - PIN_SIZE.WIDTH / 2,
                'y': window.utils.getRandomNumber(coordinates.y.min, coordinates.y.max) - PIN_SIZE.HEIGHT
            }
        }
        return objectItem;
    };

    // Создание массива обьектов недвижимости
    var getObjectsList = function () {
        for (var i = 0; i < TOTAL_OBJECTS; i++) {
            var objectItem = getObjectItem();
            objectsList.push(objectItem);
        };
        return objectsList;
    };

    var objects = getObjectsList();

    // ------------------------------- Начальная загрузка страницы--------------

    var noticeForm = document.querySelector('.notice__form');
    var formInputs = document.querySelectorAll('fieldset');

    // Делаем неактивными все поля формы 'notice-form' при первом открытии
    var disableInputs = function () {
        for (var i = 0; i < formInputs.length; i++) {
        formInputs[i].setAttribute('disabled', 'disabled');
        }; 
    };

    disableInputs();

    // Перевод карты и формы обьявления в активное состояние
    var makeMapActive = function (array) {
        map.classList.remove('map--faded');
        noticeForm.classList.remove('notice__form--disabled');
        for (var i = 0; i < formInputs.length; i++) {
        formInputs[i].removeAttribute('disabled');
        }; 
        window.pins.renderMapPins(array);
    }; 

    // ----------------------------------Возврат страницы в исходное состояние
    var PIN_START = {
        x: 570 + 'px',
        y: 375 + 'px'
    };

    var mainPinLeft = getComputedStyle(mainPin).left;
    var mainPinTop = getComputedStyle(mainPin).top;

    // Возврат формы в неактивное состояние 
    var makeFormInactive = function () {
        var mapCardItem = document.querySelector('.map__card');
        var mapPins = window.pins.mapPinsList.querySelectorAll('.map__pin:not(.map__pin--main)');
        for (var i = 0; i < mapPins.length; i++) {
            mapPins[i].remove();
        };
        window.map.mainPin.style.top = mainPinTop;
        window.map.mainPin.style.left = mainPinLeft;
        if (mapCardItem) {
            mapCardItem.remove();
        };
        map.classList.add('map--faded');
        noticeForm.reset();
        window.form.fillFormAdress();
        disableInputs();
        noticeForm.classList.add('notice__form--disabled');
        console.log(window.map.mainPin); 
    };
        
    // Обработчик на отправку формы и возврат страницы в исходное состояние. 
    // Вызов окна подтверждения при успешной отправке
    var successMessage = document.querySelector('.success');

    noticeForm.addEventListener('submit', function(evt) {
        evt.preventDefault();
        successMessage.classList.remove('hidden');
        makeFormInactive();
        document.addEventListener ('keydown', function(evt) {
            if (evt.keyCode === ESC_KEYCODE) {
                successMessage.classList.add('hidden');
                }
        });
    });

    // Обработчик на кнопку сброса формы
    var resetBtn = document.querySelector('.form__reset');

    resetBtn.addEventListener ('click', function(evt) {
        evt.preventDefault();
        makeFormInactive();
    });

    resetBtn.addEventListener ('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
            evt.preventDefault();
            makeFormInactive();
        };
    });

    window.map = {
        noticeForm: noticeForm,
        coordinates: coordinates,
        makeMapActive: makeMapActive,
        PIN_SIZE: PIN_SIZE,
        objects: objects,
        map: map,
        ENTER_KEYCODE: ENTER_KEYCODE,
        ESC_KEYCODE: ESC_KEYCODE,
        mainPin: mainPin
    };

}) ()







 


 










