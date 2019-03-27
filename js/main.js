 /* Объявляем картинки для карточек. */
const images = ['img/cat1.png', 'img/cat2.png',
'img/cat3.png', 'img/cat4.png', 'img/cat5.png',
'img/cat6.png', 'img/cat7.png', 'img/cat8.png'];
let cardCount = 16; // Количество карточек на поле.
let row = 4;
let column = 4;
let startTime;
let timerHandle;
let delayTime = 2000;
let isStarted = false;

let openCards = []; // Открытые карточки для проверки совпадений.
let matchesNumber = 0; // Количество совпавших карточек.

initGame();

// Генерирует карточки для игровой сетки.
function generateCard(number){
    let card = document.createElement('div');
    card.classList.add("card-wrapper");
    card.innerHTML = '<div class="card close"><div class="back">' +
    '</div><img class="front" src="'+images[number]+'" ' +
    'alt="'+(number+1)+'"></div></div>';
    return card;
}

// Создаёт пары карточек и добавляет их на игровую сетку.
function initCards(){
    // Создаём массив последовательно идущих попарных картинок.
    let initialCards = [];
    for(let i = 0; i < cardCount / 2; i++){
        initialCards.push(generateCard(i));
        initialCards.push(generateCard(i));
    }

    // Перемешиваем картинки.
    let cards = [];
    while(initialCards.length > 0){
        let ranNum = Math.floor(Math.random() * initialCards.length);
        cards.push(initialCards[ranNum]);
        if(ranNum > -1){
            initialCards.splice(ranNum, 1);
        }
    }

    // Если игровая сетка была не пустая, удаляем все карточки.
    let cardGrid = document.getElementById("card-grid");
    while (cardGrid.firstChild) {
        cardGrid.removeChild(cardGrid.firstChild);
    }

    // Добавляем созданные карточки на игровую сетку.
    for(let i = 0;i<cards.length;i++){
        cardGrid.appendChild(cards[i]);
    }

    // Рассчитываем высоту и длину карточек.
    // Учитываем внутренний отступ у игровой сетки (card-grid.style.padding).
    let padding = 15 * 2; // 15px * 2 отступа (слева/справа или сверху/снизу).
    // Учитываем внешний отступ каждой карточки.
    // (margin = 5px * (column - 1) всего расстояний между карточками) 
    let margin = 5 * (column - 1);
    let indents = padding + margin;

    let cardWrappers = document.getElementsByClassName("card-wrapper");
    for (var i = 0; i < cardWrappers.length; i++) {
        cardWrappers[i].style.width = "calc((100% - "+indents+"px) / "+column+")";
        cardWrappers[i].style.height = "calc((100% - "+indents+"px) / "+row+")";
    }
}

/* Изменяет состояние всех карточек одновременно: 
если они были открыты картинкой наружу, закрывает их,
и наоборот, если были показаны рубашкой вверх, показывает картинки.*/
function changeAllCardsState(){
    let cards = document.getElementsByClassName('card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("close");        
    }
}

function showAll(){
    changeAllCardsState();
    setTimeout(changeAllCardsState, delayTime);
}

// Запускает таймер игры и делает доступными кнопку начала игры.
function startTimer(){
    isStarted = true;
    document.getElementById("start-game").disabled = false;

    let min = 0;
    let sec = 0;
    startTime = new Date().getTime();

    // Обновляем счётчик игры каждую секунду.
    timerHandle = setInterval(function(){
        let endTime = new Date().getTime();
        endTime = endTime - startTime;

        let min = Math.floor(endTime / 60000);
        let sec = (endTime % 60000 / 1000).toFixed(0);

        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;

        document.getElementById("timer").innerHTML = min + ":" + sec;
    }, 1000);
}

// Начинает игру.
function startGame(){
    document.getElementById("start-game").disabled = true;
    showAll(); // Показываем карточки на 2 секунды для запоминания.
    // Запускаем таймер игры после того,
    // как будут открыты и закрыты карточки (после двух секунд).
    setTimeout(startTimer, delayTime);
}

// Инициализация игры.
function initGame(){
    isStarted = false;
    document.getElementById("modal-overlay").style.display = "none";
    document.getElementById("timer").innerHTML = "00:00";
    initCards();
    if (timerHandle != null) {
        clearInterval(timerHandle); // Обнуляем счётчик времени.
    }
}

// Проверяет, совпадают ли открытые карточки.
function checkForMatches() {
    setTimeout(function(){
        if (openCards[0].innerHTML != openCards[1].innerHTML){
            openCards[0].classList.toggle("close");
            openCards[1].classList.toggle("close");
        } else {
            matchesNumber += 2;
        }
        openCards = [];

        if (matchesNumber == cardCount){
            clearInterval(timerHandle); // Обнуляем счётчик времени.
            document.getElementById("modal-overlay").style.display = "flex";
            document.getElementById('time').innerHTML = 
            document.getElementById("timer").innerHTML;
            isStarted = false;
        }
    }, 1000);
}

document.getElementById("start-game").addEventListener("click", function(){
    initGame();
    startGame();
});

document.getElementById("play-again").addEventListener("click", function(){
    initGame();
});

// По клику на игровую карточку изменяем её состояние:
// открытую - скрывам, закрытую - открываем.
document.getElementById("card-grid").addEventListener("click", function(e){
    if (!isStarted) return;
    // Если карточка закрыта и количество открытых карточек меньше двух,
    // открываем данную карточку.
    if (e.target.parentElement.classList.contains("card") &&
        e.target.parentElement.classList.contains("close") &&
        openCards.length < 2){
        const card = e.target.parentElement;
        card.classList.toggle("close");
        openCards.push(card);
    }
    if (openCards.length == 2){
        checkForMatches();
    }
});