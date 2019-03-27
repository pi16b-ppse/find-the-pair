 /* Объявляем картинки для карточек. */
const images = ['img/cat1.png', 'img/cat2.png',
'img/cat3.png', 'img/cat4.png', 'img/cat5.png',
'img/cat6.png', 'img/cat7.png', 'img/cat8.png'];
let timerHandle;
let delayTime = 2000;
let isStarted = false;

let cardCount; // Количество карточек на поле.
let openCards = []; // Открытые карточки для проверки совпадений.
let matchesNumber = 0; // Количество совпавших карточек.
let movesCounter = 0; // Количество попыток открыть парные карточки.

showStartGameModal();

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
    // Получаем размер игровой сетки и рассчитываем общее количество карточек.
    let gridSizeElements = document.getElementsByClassName("grid-size");
    let row, column = 0;
    for (let i = 0; i < gridSizeElements.length; i++) {
        if(gridSizeElements[i].classList.contains("selected")){
            row = Number.parseInt(gridSizeElements[i].innerHTML[0]);
            column = Number.parseInt(gridSizeElements[i].innerHTML[2]);
            cardCount = row * column;
        }
    }   

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
let isPaused = false;

// Запускает таймер игры и делает доступными кнопку начала игры.
function startTimer(){
    isStarted = true;
    document.getElementById("restart").disabled = false;
    document.getElementById("pause").disabled = false;
    document.getElementById("pause").style.backgroundImage = "url(\"img/pause.png\")";

    let sec = 0;
    let min = 0;
    timerHandle = setInterval(function() {
        if (isStarted) {
            sec++;
            if (sec > 60){
                min++;
                sec = 0;
            }
    
            let minstr = (min < 10) ? "0" + min : min;
            sec = (sec < 10) ? "0" + sec : sec;
    
            document.getElementById("timer").innerHTML = minstr + ":" + sec;
        }
    }, 1000);
}

document.getElementById("pause").addEventListener("click", function(){
    isStarted = !isStarted;
    document.getElementById("pause").style.backgroundImage = isStarted ? 
    "url(\"img/pause.png\")" : "url(\"img/play.png\")";
});

// Начинает игру.
function startGame(){
    document.getElementById("modal-overlay").style.display = "none";
    document.getElementById("restart").disabled = true;
    document.getElementById("pause").disabled = true;
    showAll(); // Показываем карточки на 2 секунды для запоминания.
    // Запускаем таймер игры после того,
    // как будут открыты и закрыты карточки (после двух секунд).
    setTimeout(startTimer, delayTime);
}

// Сброс игры.
function resetGame(){
    isStarted = false;
    openCards = []; // Создаём новый пустой массив с открытыми карточками.
    matchesNumber = 0; // Обнуляем количество совпадений.
    movesCounter = 0;
    document.getElementById("timer").innerHTML = "00:00";
    document.getElementById("moves").innerHTML = "0";
    document.getElementById("pause").style.backgroundImage = "url(\"img/play.png\")";
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
        movesCounter++;
        document.getElementById("moves").innerHTML = movesCounter;

        if (matchesNumber == cardCount){
            clearInterval(timerHandle); // Обнуляем счётчик времени.
            isStarted = false;
            showEndGameModal();
        }
    }, 1000);
}

function showStartGameModal(){
    resetGame();
    document.getElementById("modal-overlay").style.display = "flex";
    document.getElementById("start-game-modal").style.display = "block";
    document.getElementById("victory-modal").style.display = "none";
}

function showEndGameModal(){
    document.getElementById("modal-overlay").style.display = "flex";
    document.getElementById("victory-modal").style.display = "block";
    document.getElementById("start-game-modal").style.display = "none";
    document.getElementById('result-time').innerHTML = 
    document.getElementById("timer").innerHTML;
    document.getElementById('result-moves').innerHTML = 
    document.getElementById("moves").innerHTML;
}

document.getElementById("restart").addEventListener("click", function(){
    showStartGameModal();
});

document.getElementById("play-again").addEventListener("click", function(){
    showStartGameModal();
});

document.getElementById("start-game").addEventListener("click", function(){
    initCards(); /// удалить из метода resetgame
    startGame();
});

function setSize(count){
    cardCount = count;
    console.log(cardCount);
}

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