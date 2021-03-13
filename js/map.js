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
var mapPinsList = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card'); 
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

// Создание иконки обьекта на карте
var renderMapPin = function (array) {
    var mapPinElement = mapPin.cloneNode(true);
    mapPinElement.querySelector('img').src = array.author.avatar;
    mapPinElement.querySelector('img').alt = array.offer.title;
    mapPinElement.style.left = array.location.x  + "px"; 
    mapPinElement.style.top = array.location.y  + "px";
    return mapPinElement;
};
// Создание карточки обьекта
var renderCard = function (array) {
    var objectCard = mapCard.cloneNode(true);
    var objectCardList = objectCard.querySelector('.popup__features');
    var paragraphs = objectCard.querySelectorAll('p');
    var objectCardImageList = objectCard.querySelector('.popup__pictures');
    objectCard.querySelector('h3').textContent = array.offer.title;
    objectCard.querySelector('small').textContent = array.offer.adress;
    objectCard.querySelector('.popup__price').textContent = array.offer.price + ' ₽/ночь';
    objectCard.querySelector('h4').textContent = array.offer.type;
    paragraphs[2].textContent = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
    paragraphs[3].textContent = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
    objectCardList.innerHTML = '';
    for (var i = 0; i < array.offer.features.length; i++) {
        var objectCardItem = '<li class="feature feature--' + array.offer.features[i] + '"></li>';
        objectCardList.insertAdjacentHTML('afterbegin', objectCardItem);
    };
    paragraphs[4].textContent = array.offer.description;
    // objectCardImageList.innerHTML = '';
    // for (var i = 0; i < array.offer.photos.length; i++) {
    //     var objectCardPhoto = '<li><img src=' + array.offer.photos[i] + '></li>';
    //     objectCardImageList.insertAdjacentHTML('afterbegin', objectCardPhoto);
    // };
    objectCard.querySelector('.popup__avatar').src = array.author.avatar;
    return objectCard;
    } 
  
map.classList.remove('map--faded');

// Добавление иконок в DocumentFragment
for (var j = 0; j < objects.length; j++) {
    fragment.appendChild(renderMapPin(objects[j]));
};

// Добавление иконок в разметку
mapPinsList.appendChild(fragment);

// Добавление карточки обьекта в разметку
map.insertBefore(renderCard(objects[0]), mapFiltersContainer);











