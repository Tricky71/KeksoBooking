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
var mapPinsList = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');
var templatePhotoItem = document.querySelector('template').content.querySelector('.popup__photo');
var objectsList = [];
var adIndex = 0;
var coordinates = {
    x: {min: 100, max: 1100},
    y: {min: 100, max: 500}
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

var MAIN_PIN_SIZE = {
    HEIGHT: 70,
    WIDTH: 50
};
var fragment = document.createDocumentFragment();

// Получение случайного числа в заданном диапазоне
var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

// Получение случайного элемента из массива (элеменеты не повторяются)
var getRandomElement = function (array, key) {
    var randomElementIndex = getRandomNumber(0, array.length - 1);
    var randomElement = array[randomElementIndex];
    if (key) {
        array.splice(randomElementIndex, 1);
    }
    return randomElement;
};

// Создание массива произвольной длинны из массива (элементы не повторяются)
var getRandomArray = function (array) {
    var copiedArray = array.slice(0, array.length);
    var randomArray = [];
    var randomArrayLength = getRandomNumber(1, copiedArray.length); 
    for (var i = 0; i < randomArrayLength; i++) {
        var randomArrayElement = getRandomElement(copiedArray, true);
        randomArray.push(randomArrayElement);
    };
    return randomArray;
};

// Создание произвольного массива из массива той же длинны
var getRandomShuffleArray = function (array) {
    var copiedArray = array.slice();
    var randomArray = [];
    for (var i = 0; i < array.length; i++) {
        var randomArrayElement = getRandomElement(copiedArray, true);
        randomArray.push(randomArrayElement);
    };
    return randomArray;
};

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
            'title': getRandomElement(OBJECT_TYTLES, true),
            'adress': getRandomNumber(coordinates.x.min, coordinates.x.max) + ', ' + getRandomNumber(coordinates.y.min, coordinates.y.max),
            'price': getRandomNumber(PRICE.min, PRICE.max),
            'type': getRandomElement(OBJECT_TYPES),
            'rooms': getRandomNumber(ROOMS.min, ROOMS.max),
            'guests': getRandomNumber(GUESTS.min, GUESTS.max),
            'checkin': getRandomNumber(12, 14) + ':00',
            'checkout': getRandomNumber(12, 14) + ':00',
            'features': getRandomArray(OBJECT_FEATURES),
            'description':'',
            'photos': getRandomShuffleArray(objectPhotos)
        },
        'location': {
            'x': getRandomNumber(coordinates.x.min, coordinates.x.max) - PIN_SIZE.WIDTH / 2,
            'y': getRandomNumber(coordinates.y.min, coordinates.y.max) - PIN_SIZE.HEIGHT
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

// ----------------------------Создание и загрузка иконок обьектов

// Создание иконки обьекта на карте
var createMapPin = function (array) {
    var mapPinElement = mapPin.cloneNode(true);
    mapPinElement.querySelector('img').src = array.author.avatar;
    mapPinElement.querySelector('img').alt = array.offer.title;
    mapPinElement.style.left = array.location.x  + "px"; 
    mapPinElement.style.top = array.location.y  + "px";
    mapPinElement.addEventListener('click', function () {
        var cardItem = map.querySelector('.map__card');
        if (cardItem) {
        cardItem.remove();
        };
        openPopup(array);
        makePinActive(mapPinElement);
    });
    mapPinElement.addEventListener('keydown', function(evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
            openPopup(array);
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


// -----------------------------------------Создание карточки обьекта

// Открытие карточки обьекта
var openPopup = function (array) {
    map.insertBefore(renderCard(array), mapFiltersContainer);
};

// Закрытие карточки обьекта
var closePopup = function (ad) {
    ad.remove();
};

var createFeaturesFragment = function (array) {
    var featuresFragment = document.createDocumentFragment();
    for (var i = 0; i < array.offer.features.length; i++) {
        var objectCardItem = document.createElement ('li');
        objectCardItem.className = 'feature feature--' + array.offer.features[i];
        featuresFragment.appendChild(objectCardItem);
    };
    return featuresFragment;
};

var createPhotoFragment = function (array) {
    var photoFragment = document.createDocumentFragment();
    for (var i = 0; i < array.offer.photos.length; i++) {
        var cardPhoto = templatePhotoItem.cloneNode(true);
        cardPhoto.src = array.offer.photos[i];
        photoFragment.appendChild(cardPhoto);
    };
    return photoFragment;
    
};

var renderCard = function (array) {
    var objectCard = mapCard.cloneNode(true);
    var closePopupBtn = objectCard.querySelector('.popup__close');
    var objectCardList = objectCard.querySelector('.popup__features');
    var paragraphs = objectCard.querySelectorAll('p');
    var objectCardImageList = objectCard.querySelector('.popup__pictures');
    var objectPhotosList =objectCard.querySelector('.popup__pictures');
    objectCard.querySelector('.popup__avatar').src = array.author.avatar;
    objectCard.querySelector('h3').textContent = array.offer.title;
    objectCard.querySelector('small').textContent = array.offer.adress;
    objectCard.querySelector('.popup__price').textContent = array.offer.price + ' ₽/ночь';
    objectCard.querySelector('h4').textContent = array.offer.type;
    paragraphs[2].textContent = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
    paragraphs[3].textContent = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
    objectCardList.innerHTML = '';
    objectCardList.appendChild(createFeaturesFragment(array));
    paragraphs[4].textContent = array.offer.description;
    objectPhotosList.innerHTML = '';
    objectPhotosList.appendChild(createPhotoFragment(array));
    closePopupBtn.addEventListener('click', function() {
        closePopup(objectCard);
        makePinInactive();
    }); 
    closePopupBtn.addEventListener('keydown', function(evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
            closePopup(objectCard);
            makePinInactive();
        };
    });
    document.addEventListener ('keydown', function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
            closePopup(objectCard);
            makePinInactive();
        };
    });
    return objectCard;
};


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

var mainPin = document.querySelector('.map__pin--main');
var userAdress = document.querySelector('#address');

// Перевод карты и формы обьявления в активное состояние
var makeMapActive = function (array) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < formInputs.length; i++) {
    formInputs[i].removeAttribute('disabled');
    }; 
    renderMapPins(array);
}; 


// Заполнение поля адреса в зависимости от координат основной иконки
var fillFormAdress = function () {
    userAdress.value = (mainPin.offsetTop - (PIN_SIZE.HEIGHT)) + ', ' + (mainPin.offsetLeft - (PIN_SIZE.WIDTH / 2));
    userAdress.setAttribute('disabled', 'disabled');
};

// установление первоначального значения поля адреса
userAdress.value = (mainPin.offsetTop - (mapPin.offsetHeight / 2)) + ', ' + (mainPin.offsetLeft - (mainPin.offsetWidth / 2));

// Добавление обработчика на основную иконку
mainPin.addEventListener('mouseup', function () {
    makeMapActive(objects); 
    fillFormAdress();
    
}); 

// -----------------------------------  Обработка формы обьявления пользователя
// Валидация заголовка обьявления
var userTitle = document.querySelector('#title');
var TITLE_MIN = 3;
var TITLE_MAX = 100
userTitle.minLength = TITLE_MIN;
userTitle.maxLength = TITLE_MAX;


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
noticeForm.addEventListener('invalid', function (evt) {
    evt.target.style.outline = '2px solid red';
  }, true);


// ----------------------------------Возврат страницы в исходное состояние
var makeFormInactive = function () {
    var mapCardItem = document.querySelector('.map__card');
    var mapPins = mapPinsList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPins.length; i++) {
        mapPins[i].remove();
    };
    mainPin.top = '375px';
    mainPin.left = '570px';
    if (mapCardItem) {
        mapCardItem.remove();
    };
    map.classList.add('map--faded');
    noticeForm.reset();
    fillFormAdress();
    disableInputs();
    noticeForm.classList.add('notice__form--disabled');
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





 


 










