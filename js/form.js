'use strict';

// -----------------------------------  Обработка формы обьявления пользователя

(function () {

    // Заполнение поля адреса в зависимости от координат основной иконки
    var userAdress = document.querySelector('#address');

    var fillFormAdress = function () {
        userAdress.value = (window.map.mainPin.offsetTop - (window.map.PIN_SIZE.HEIGHT)) + ', ' + (window.map.mainPin.offsetLeft - (window.map.PIN_SIZE.WIDTH / 2));
        userAdress.setAttribute('disabled', 'disabled');
    };

    // установление первоначального значения поля адреса
    userAdress.value = (window.map.mainPin.offsetTop - (window.map.mainPin.offsetHeight / 2)) + ', ' + (window.map.mainPin.offsetLeft - (window.map.mainPin.offsetWidth / 2));

    // Валидация заголовка обьявления
    var userTitle = document.querySelector('#title');
    var TITLE_MIN = 3;
    var TITLE_MAX = 100
    userTitle.minLength = TITLE_MIN;
    userTitle.maxLength = TITLE_MAX;
    userTitle.setAttribute('required', 'required');


    // Валидация поля цены в зависимости от типа жилья
    var userPrice = document.querySelector('#price');
    var userElementType = document.querySelector('#type');
    var PRICE_START = 1000;
    var PRICE_MAX = 1000000;
    var priceTypes = {
        'bungalo': 0,
        'flat': 1000,
        'house': 5000,
        'palace': 10000
    }; 
    userPrice.min = PRICE_START;
    userPrice.max = PRICE_MAX;
    userPrice.placeholder = userPrice.min;
    userPrice.setAttribute('required', 'required');

    userElementType.addEventListener('change', function() {
        userPrice.min = priceTypes[userElementType.value];
        userPrice.placeholder = userPrice.min;
    });

    // Валидация полей вьезда и выезда
    var userTimeIn = document.querySelector('#timein');
    var userTimeOut = document.querySelector('#timeout');

    userTimeIn.addEventListener('change', function(evt) {
        var target = evt.target;
        userTimeOut.value = target.value;
    });

    userTimeOut.addEventListener('change', function(evt) {
        var target = evt.target;
        userTimeIn.value = target.value;
    });

    // Валидация полей кол-ва комнат и кол-ва гостей
    var userRooms = document.querySelector('#room_number');
    var userGuests = document.querySelector('#capacity');

    userRooms.addEventListener('change', function() {
        if (userRooms.value === '2') {
            userGuests
        };
    });

    // Подсвечивает неверно заполненные поля при попытке отправки
    // var userForm = document.querySelector('.notice__form');
    window.map.noticeForm.addEventListener('invalid', function (evt) {
        evt.target.style.outline = '2px solid red';
    }, true);

    window.form = {
        fillFormAdress: fillFormAdress
    };

}) ()