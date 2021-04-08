'use strict';
// --------------------- Метка пользователя (перетаскивание)

(function () {

    
    var MAIN_PIN_SIZE = {
        HEIGHT: 70,
        WIDTH: 50
    };

    window.map.mainPin.addEventListener('mousedown', function(evt) {
        evt.preventDefault();
    // Запоминает координаты стартовой точки, с которой началось перемещение
        var startCoords = {
            x: evt.clientX,
            y: evt.clientY
        };
    // Добавляет обработчик события перемещения мыши
        var onMouseMove = function(moveEvt) {
            moveEvt.preventDefault();
    // Рассчитывает смещение относительно стартовой точки
            var shift = {
                x: startCoords.x - moveEvt.clientX,
                y: startCoords.y - moveEvt.clientY
            };
    // Обновляет координаты стартовой точки
            startCoords = {
                x: moveEvt.clientX,
                y: moveEvt.clientY
            };
    // Рассчитывает положение перемещаемого элемента
            var currentCoords = {
                x: window.map.mainPin.offsetLeft - shift.x,
                y: window.map.mainPin.offsetTop - shift.y
            }
    // Перемещает элемент при условии вхождения в заданную область перемещения
    // (намеренная коррекция по оси ординат для избежания размещения элемента над уровнем горизнота)
            if (currentCoords.y <= window.map.coordinates.y.max && currentCoords.y >= window.map.coordinates.y.min)  {
                window.map.mainPin.style.top = currentCoords.y + 'px';
            };

            if (currentCoords.x <= window.map.map.clientWidth - MAIN_PIN_SIZE.WIDTH / 2 &&
                currentCoords.x >= MAIN_PIN_SIZE.WIDTH / 2) {    
                window.map.mainPin.style.left = currentCoords.x + 'px';
            };
        };
    // При опускании кнопки мыши прекращает слушать события движения мыши
        var onMouseUp = function (upEvt) {
            upEvt.preventDefault();
            window.map.makeMapActive(window.map.objects); 
            window.form.fillFormAdress();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    // Добавляет обработчики события передвижения мыши и отпускания кнопки мыши
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    // window.mainPin = {
        
    // };

    }) ()