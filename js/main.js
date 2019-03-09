console.log('Find The Pair started!');

 /* Объявляем картинки для карточек. */
const images = ['img/cat1.png', 'img/cat2.png', 'img/cat3.png', 'img/cat4.png', 'img/cat5.png', 'img/cat6.png', 'img/cat7.png', 'img/cat8.png'];
let numberOfCards = 16;
const cardGrid = document.getElementById("card-grid");

// Генерирует карточки для игровой сетки.
function generateCard(number){
    let card = document.createElement('div');
    card.classList.add("card-wrapper");
    card.innerHTML = '<div class="card"><img class="front" src="'+images[number]+'" alt="'+number+'"></div></div>';
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

initCards();