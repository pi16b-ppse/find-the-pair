/**
*@description Базовый массив картинок для карточек в игре
*/
const images = ['img/cat1.png', 'img/cat2.png',
'img/cat3.png', 'img/cat4.png', 'img/cat5.png',
'img/cat6.png', 'img/cat7.png', 'img/cat8.png',
'img/cat9.png', 'img/cat10.png', 'img/cat11.png',
'img/cat12.png', 'img/cat13.png', 'img/cat14.png', 'img/cat15.png'];

/**
*@description Состояние игры
*/
let game = {
    cardCount: 0,
    isStarted: false,
    openCards: [], // Открытые карточки для проверки совпадений.
    matchesNumber: 0, // Количество совпавших карточек.
    result: { min: "00", sec: "00", moves: 0 },
    timerHandle: undefined,
    delayTime: 2000
}

/**
*@description Экземляр Vue, представляющий меню игры
*/
let menuVm = new Vue({
    el: "#menu",
    data: game.result
})

/**
*@description Экземляр Vue, представляющий данные об окончании игры
*/
let victoryModalVm = new Vue({
    el: "#victory-modal",
    data: game.result
})

/**
*@description Кнопка перезапуска игры
*/
let restartButton = document.getElementById('restart');

/**
*@description Кнопка паузы
*/
let pauseButton = document.getElementById('pause');

/**
*@description Игровая сетка с карточками
*/
let cardGrid = document.getElementById('card-grid');

/**
*@description Модальное наложение для сообщений о начале и об окончании игры
*/
let modalOverlay = document.getElementById("modal-overlay");

/**
*@description Модальное сообщение для начала игры
*/
let startGameModal = document.getElementById("start-game-modal");

/**
*@description Модальное сообщение при окончании игры
*/
let victoryModal = document.getElementById("victory-modal");

/**
 * Создаёт карточку для игровой сетки
 * @param {number} number - индекс в массиве картинок для карточки
 * @returns {object} Сгенерированная блок карточки со специальным стилем
 */
function generateCard(number){
    let card = document.createElement('div');
    card.classList.add("card-wrapper");
    card.innerHTML = '<div class="card close"><div class="back">' +
    '</div><img class="front" src="'+images[number]+'" ' +
    'alt="'+(number+1)+'" style="user-select: none; ' +
    '-webkit-user-drag: none;"></div></div>';
    return card;
}

/**
*@description Создаёт пары карточек и добавляет их на игровую сетку
*/
function initCards(){
    // Получаем размер игровой сетки и рассчитываем общее количество карточек.
    let gridSizeElements = document.getElementsByClassName("grid-size");
    let row, column = 0;
    for (let i = 0; i < gridSizeElements.length; i++) {
        if(gridSizeElements[i].classList.contains("selected")){
            row = Number.parseInt(gridSizeElements[i].innerHTML[0]);
            column = Number.parseInt(gridSizeElements[i].innerHTML[2]);
            game.cardCount = row * column;
        }
    } 

    // Создаём массив последовательно идущих попарных картинок.
    let initialCards = [];
    for (let i = 0; i < game.cardCount / 2; i++){
        initialCards.push(generateCard(i));
        initialCards.push(generateCard(i));
    }

    // Перемешиваем картинки.
    let cards = [];
    while (initialCards.length > 0){
        let ranNum = Math.floor(Math.random() * initialCards.length);
        cards.push(initialCards[ranNum]);
        if(ranNum > -1){
            initialCards.splice(ranNum, 1);
        }
    }

    // Если игровая сетка была не пустая, удаляем все карточки.
    while (cardGrid.firstChild) {
        cardGrid.removeChild(cardGrid.firstChild);
    }

    // Добавляем созданные карточки на игровую сетку.
    for(let i = 0; i < cards.length; i++){
        cardGrid.appendChild(cards[i]);
    }

    // Рассчитываем высоту и длину карточек.
    // Учитываем внутренний отступ у игровой сетки (card-grid.style.padding).
    let padding = 15 * 2; // 15px * 2 отступа (слева/справа или сверху/снизу).
    // Учитываем внешний отступ каждой карточки.
    // (margin = 5px * (column - 1) расстояний между карточками) 
    let margin = 5 * (column - 1);
    let indents = padding + margin;

    let cardWrappers = document.getElementsByClassName("card-wrapper");
    for (var i = 0; i < cardWrappers.length; i++) {
        cardWrappers[i].style.width = "calc((100% - "+indents+"px) / "
        +column+")";
        cardWrappers[i].style.height = "calc((100% - "+indents+"px) / "+row+")";
    }
}

/**
*@description Показывает или скрывает все карточки одновременно
*/
function changeAllCardsState(){
    let cards = document.getElementsByClassName('card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("close");        
    }
}

/**
*@description Показывает все карточки на на время для запоминания
*/
function showAll(){
    changeAllCardsState();
    setTimeout(changeAllCardsState, game.delayTime);
}

/**
*@description Запускает таймер игры и делает доступными кнопку начала игры
*/
function startTimer(){
    game.isStarted = true;
    restartButton.disabled = false;
    pauseButton.disabled = false;
    pauseButton.style.backgroundImage = "url(\"img/pause.png\")";

    let sec = 0;
    let min = 0;
    game.timerHandle = setInterval(function() {
        if (game.isStarted) {
            sec++;
            if (sec > 60){
                min++;
                sec = 0;
            }
            game.result.min = (min < 10) ? "0" + min : min;
            game.result.sec = (sec < 10) ? "0" + sec : sec;
        }
    }, 1000);
}

/**
*@description Изменяет состяние игры: пауза или продолжение игры.
*/
pauseButton.addEventListener("click", function(){
    game.isStarted = !game.isStarted;
    pauseButton.style.backgroundImage = game.isStarted ? 
    "url(\"img/pause.png\")" : "url(\"img/play.png\")";
});

/**
*@description Начинает новую игру
*/
function startGame(){
    modalOverlay.style.display = "none";
    restartButton.disabled = true;
    pauseButton.disabled = true;
    showAll(); // Показываем карточки на 2 секунды для запоминания.
    // Запускаем таймер игры после того,
    // как будут открыты и закрыты карточки (после двух секунд).
    setTimeout(startTimer, game.delayTime);
}

/**
*@description Сброс настроек игры
*/
function resetGame(){
    game.isStarted = false;
    game.openCards = []; // Создаём новый пустой массив с открытыми карточками.
    game.matchesNumber = 0; // Обнуляем количество совпадений.
    game.result.moves = 0;
    game.result.min = "00";
    game.result.sec = "00";
    pauseButton.style.backgroundImage = "url(\"img/play.png\")";
    initCards();
    if (game.timerHandle != null) {
        clearInterval(game.timerHandle); // Обнуляем счётчик времени.
    }
}

/**
*@description Проверка на совпадение карточек
*/
function checkForMatches() {
    setTimeout(function(){
        if (game.openCards[0].innerHTML != game.openCards[1].innerHTML){
            game.openCards[0].classList.toggle("close");
            game.openCards[1].classList.toggle("close");
        } else {
            game.matchesNumber += 2;
        }
        game.openCards = [];
        game.result.moves++;

        if (game.matchesNumber == game.cardCount){
            clearInterval(game.timerHandle); // Обнуляем счётчик времени.
            game.isStarted = false;
            showEndGameModal();
        }
    }, 1000);
}

/**
*@description Отображение модального окна для начала игры
*/
function showStartGameModal(){
    resetGame();
    modalOverlay.style.display = "flex";
    startGameModal.style.display = "block";
    victoryModal.style.display = "none";
}

/**
*@description Отображение модального окна с поздравлениями по окончанию игры
*/
function showEndGameModal(){
    modalOverlay.style.display = "flex";
    victoryModal.style.display = "block";
    startGameModal.style.display = "none";
}

/**
*@description Перезапуск игры во время продолжения игры
*/
restartButton.addEventListener("click", function(){
    showStartGameModal();
});

/**
*@description Начало новой игры после окончания предыдущей
*/
document.getElementById("play-again").addEventListener("click", function(){
    showStartGameModal();
});

/**
*@description Инициализация карточек, их отрисовка и запуск новой игры
*/
document.getElementById("start-game").addEventListener("click", function(){
    initCards();
    startGame();
});

/**
*@description Выделяет нажатую кнопку с размером игрового поля.
*/
document.getElementById("size-container").addEventListener("click",
    function(e){
    if(e.target.classList.contains("grid-size")){
        let elements = document.getElementsByClassName("grid-size");
        // Убираем подсветку ранее выделенной кнопки.
        for(let i = 0; i < elements.length; i++){
            if(elements[i].classList.contains("selected")){
                elements[i].classList.remove("selected");
            }
        }
        // Подсвечиваем выбранную кнопку.
        e.target.classList.add("selected");
    }
});

/**
*@description  По клику на игровую карточку изменяет её состояние: 
открывает или скрывает, выполняя проверку на совпадения.
*/
cardGrid.addEventListener("click", function(e){
    if (!game.isStarted) return;
    // Если карточка закрыта и количество открытых карточек меньше двух,
    // открываем данную карточку.
    if (e.target.parentElement.classList.contains("card") &&
        e.target.parentElement.classList.contains("close") &&
        game.openCards.length < 2){
        const card = e.target.parentElement;
        card.classList.toggle("close");
        game.openCards.push(card);
    }
    if (game.openCards.length == 2){
        checkForMatches();
    }
});

/**
*@description Показывает модальное окно для начала новой игры
*/
showStartGameModal();