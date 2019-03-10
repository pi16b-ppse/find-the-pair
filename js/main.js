console.log('Find The Pair started!');

 /* Объявляем картинки для карточек. */
const images = ['img/cat1.png', 'img/cat2.png',
'img/cat3.png', 'img/cat4.png', 'img/cat5.png',
'img/cat6.png', 'img/cat7.png', 'img/cat8.png'];
let numberOfCards = 16;
const cardGrid = document.getElementById("card-grid");
let startTime;
let timerHandle;
let delayTime = 2000;
let isAnimation = false;

initCards();

// Генерирует карточки для игровой сетки.
function generateCard(number){
    let card = document.createElement('div');
    card.classList.add("card-wrapper");
    card.innerHTML = '<div class="card flip"><div class="back">' +
    '</div><img class="front" src="'+images[number]+'" ' +
    'alt="'+(number+1)+'"></div></div>';
    return card;
}

// Создаёт пары карточек и добавляет их на игровую сетку.
function initCards(){
// Создаём массив последовательно идущих попарных картинок.
    let initialCards = [];
    for(let i = 0;i<numberOfCards/2;i++){
        initialCards.push(generateCard(i));
        initialCards.push(generateCard(i));
    }

    // Перемешиваем картинки.
    let cards = [];
    while(initialCards.length>0){
        let ranNum = Math.floor(Math.random()*initialCards.length);
        cards.push(initialCards[ranNum]);
        if(ranNum>-1){
            initialCards.splice(ranNum,1);
        }
    }

    // Добавляем карточки на игровую сетку.
    for(let i = 0;i<cards.length;i++){
        cardGrid.appendChild(cards[i]);
    }
}

/* Изменяет состояние всех карточек одновременно: 
если они были открыты картинкой наружу, закрывает их,
и наоборот, если были показаны рубашкой вверх, показывает картинки.*/
function changeAllCardsState(){
    let cards = document.getElementsByClassName('card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("flip");        
    }
}

function showAll(){
    changeAllCardsState();
    setTimeout(changeAllCardsState, delayTime);
}

// Запускает таймер игры и делает доступными кнопку начала игры.
function startTimer(){
    isAnimation = false;
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
    isAnimation = true;
    document.getElementById("start-game").disabled = true;

    showAll(); // Показываем карточки на 2 секунды для запоминания.
    // Запускаем таймер игры после того,
    // как будут открыты и закрыты карточки (после двух секунд).
    setTimeout(startTimer, delayTime);
}

// Обнуляет все данные в игре.
function resetGame(){
    // Сбрасываем игру, если была она была запущена.
    if(timerHandle != null){
        clearInterval(timerHandle);
        document.getElementById("timer").innerHTML = "00:00";
    }
}

document.getElementById("start-game").addEventListener("click", function(){
    resetGame();
    startGame();
});

// По клику на игровую карточку изменяем её состояние:
// открытую - скрывам, закрытую - открываем.
cardGrid.addEventListener("click", function(e){
    if(isAnimation) return;
    if(e.target.parentElement.classList.contains("card")){
        const card = e.target.parentElement;
        card.classList.toggle("flip");
    }
});