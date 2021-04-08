'use strict';

(function () {
// -----------------------------------------Создание карточки обьекта
    
    var mapCard = document.querySelector('template').content.querySelector('.map__card');
    var templatePhotoItem = document.querySelector('template').content.querySelector('.popup__photo');
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    
    // Открытие карточки обьекта
    var openPopup = function (array) {
        window.map.map.insertBefore(renderCard(array), mapFiltersContainer);
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
            window.pins.makePinInactive();
        }); 
        closePopupBtn.addEventListener('keydown', function(evt) {
            if (evt.keyCode === window.map.ENTER_KEYCODE) {
                closePopup(objectCard);
                window.pins.makePinInactive();
            };
        });
        document.addEventListener ('keydown', function (evt) {
            if (evt.keyCode === window.map.ESC_KEYCODE) {
                closePopup(objectCard);
                window.pins.makePinInactive();
            };
        });
        return objectCard;
    };

    window.card = {
        openPopup: openPopup
    }; 
}) ()
