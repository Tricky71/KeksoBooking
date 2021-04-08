'use strict';

(function () {
    
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
    window.utils = {
        getRandomNumber:       getRandomNumber,
        getRandomElement:      getRandomElement,
        getRandomArray:        getRandomArray,
        getRandomShuffleArray: getRandomShuffleArray
    };                        
    
}) ()
