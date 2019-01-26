/*
 * Variables declaration
 */
// list of cardIcons that will be appended to html
let cardsIcons = [
  "fa-anchor",
  "fa-anchor",
  "fa-bicycle",
  "fa-bolt",
  "fa-cube",
  "fa-diamond",
  "fa-diamond",
  "fa-plane",
  "fa-leaf",
  "fa-bomb",
  "fa-leaf",
  "fa-bomb",
  "fa-bolt",
  "fa-bicycle",
  "fa-plane",
  "fa-cube"
];
// holds the  two opened cards to be compared
let openedCards = [];
// holds two cards when matched
let matchedCards = [];
/*
 * Restart the game Button
 */
let resetBtn = document.getElementsByClassName("restart")[0];
/*
 * Deck of cards container
 */
let deck = document.querySelector(".deck");
let counter = 0;
let moveCounter = document.querySelector(".moves");
let lblSeconds = document.getElementById("seconds");
let lblMinutes = document.getElementById("minutes");
let totalSeconds = 0;
let modal = document.getElementById("congratsModal");
/*
 * This function will add a move each time its called
 */
moveCounter.textContent = counter;
let incrementMoveCounter = function() {
  moveCounter.textContent = ++counter;
  calculateStarRatingScore();
  return counter;
};
/*
 * display Card if clicked
 */
let displayCard = function(card) {
  card.classList.add("open", "show", "disabled");
};
/*
 * this function will animate two cards by adding (.animated , .animation type) classes to the card then removing it specifed time
 */
let animateCard = function(firstCard, SecondCard, animationType) {
  firstCard.classList.add("animated", animationType); // Add animation Type  class
  SecondCard.classList.add("animated", animationType); // Add animation Type  class
  setTimeout(function() {
    firstCard.classList.remove("animated", animationType); // Remove Type  class
    SecondCard.classList.remove("animated", animationType); // Remove Type  class
  }, 700);
};
/*
 * If the two cards matched :
 * 1. add .match class to the currentCard , PreviousCard.
 * 2. animate them using animateCard function.
 * 3. remove the two cards from the array.
 */
let matching = function(PreviousCard, currentCard) {
  PreviousCard.classList.add("match");
  currentCard.classList.add("match");
  animateCard(PreviousCard, currentCard, "heartBeat");
  openedCards.splice(0, 2);
};
/*
 * If the two cards dont matched :
 * 1. remove open , show , disabled classes
 * 2. remove the two cards from the array.
 */
let nonMatching = function(PreviousCard, currentCard) {
  PreviousCard.classList.remove("open", "show", "disabled");
  currentCard.classList.remove("open", "show", "disabled");
  openedCards.splice(0, 2);
};
/*
 * This function will set a timer and display in the specifed labels
 */
let setTimer = function() {
  ++totalSeconds;
  lblSeconds.innerHTML = "" + (totalSeconds % 60);
  lblMinutes.innerHTML = "" + parseInt(totalSeconds / 60);
};
/*
 * calculateStarRatingScore
 */

let stars = document.querySelectorAll(".fa-star");

let calculateStarRatingScore = function() {
  stars.forEach(star => {
    star.classList.add("yellowStars");
  });
  for (let i = 0; i <= matchedCards.length; i++) {
    if (
      moveCounter.textContent >= 16 &&
      moveCounter.textContent <= 20 &&
      moveCounter.textContent <= 25
    ) {
      stars[2].classList.add("whiteStars");
    } else if (moveCounter.textContent >= 20 && moveCounter.textContent <= 25) {
      stars[1].classList.add("whiteStars");
      stars[2].classList.add("whiteStars");
    }
  }
};
let openCard = function() {
  let firstClick = true;
  let AllCardsList = document.querySelectorAll(".card");
  // convert to an array using spread operator
  let AllCardsArr = [...AllCardsList];
  // loop on each element and add an eventListener on click
  AllCardsArr.forEach(function(card) {
    card.addEventListener("click", function() {
      //  if there is an existing card in opened card array do the following
      if (openedCards.length === 1) {
        // show card and add it to the openedCardsarray
        displayCard(card);
        openedCards.push(card);
        // store the two cards in the array in variables to compare them
        let PreviousCard = openedCards[0];
        let currentCard = openedCards[1];
        // if the cards match keep them open and add them to matched cards
        if (PreviousCard.innerHTML === currentCard.innerHTML) {
          matching(PreviousCard, currentCard);
          matchedCards.push(PreviousCard, currentCard);
          setTimeout(isGameOver, 400);
          // if they dont match flip them back
        } else {
          setTimeout(nonMatching, 700, PreviousCard, currentCard);
          setTimeout(animateCard(PreviousCard, currentCard, "rubberBand"), 700);
        }
        // add a move
        incrementMoveCounter();
        // if opened cards array is empty
      } else {
         // run the timer once only if clicked on any card
         if (firstClick == true) {
          setInterval(setTimer, 1000); // start
          firstClick = false;
        }
        displayCard(card);
        openedCards.push(card);
      }
    });
  });
};
/*
 * 1. Shuffle Cards then create its html by appending each one to the deck container
 * 2. But instead of appending cards to deck every time  we can just create document fragment
 *  and append cards to it then append it one to time to the deck (better performance)
 */
let startGame = function() {
  // shuffle list of cards
  const shuffledCards = shuffle(cardsIcons);
  const documentFragment = document.createDocumentFragment();
  for (let i = 0; i < cardsIcons.length; i++) {
    let card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="fa ${shuffledCards[i]}"></i>`;
    documentFragment.appendChild(card);
  }
  deck.appendChild(documentFragment);
  openCard();
};
let showModal = function() {
  console.log("modal");
  let modalContent = document.getElementsByClassName("modal-content")[0];
  let closeBtn = document.getElementsByClassName("closeBtn")[0];
  let totalMoves = document.getElementsByClassName("totalMoves")[0];
  let RestartBtn = document.getElementsByClassName("restartLink")[0];
  let starRatingScore = document.getElementsByClassName("stars")[0];
  let timer = document.getElementsByClassName("timer")[0];
  // clone or copy the starRatingScore , timer node to atatch it to the modal
  let starRatingScoreClone = starRatingScore.cloneNode(true);
  let timerClone = timer.cloneNode(true);
  // close the modal when close button is clicked
  closeBtn.addEventListener("click", closeModal);
  // atatch final (moves,timing,score) in the modal
  totalMoves.textContent = "Total Moves :   " + moveCounter.textContent;
  starRatingScoreClone.innerHTML = "Final Rating :  " + starRatingScoreClone.innerHTML;
  modalContent.insertBefore(starRatingScoreClone, RestartBtn);
  timerClone.innerHTML = "Final time :    " + timerClone.innerHTML;
  modalContent.insertBefore(timerClone, RestartBtn);
  starRatingScoreClone.id = "cloneRating";
  // reset game on click
  RestartBtn.addEventListener("click", function() {
    location.reload();
  });
};
let closeModal = function() {
  modal.classList.toggle("d-none");
};
/*
 * If total matched cards equals total of all cards game is over and show results (Modal)
 */
let isGameOver = function() {
  if (matchedCards.length === 16) {
    showModal();
    modal.classList.toggle("d-none");
  }
};
/*
 * This function will fire an event when the resetBtn is clicked and will reset needed elements (counter,timer etc..) and start game again
 */
let restartGame = function() {
  resetBtn.addEventListener("click", function() {
    location.reload();
  });
};
/*
 * Shuffle function
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
/*
 * Start the game
 */
startGame();
/*
 * Activate restart button
 */
restartGame();
