//---- DATA ----//
const categories = [
    { name: 'Action', icon: '⚔️' },
    { name: 'Puzzle', icon: '🧩' },
    { name: 'Racing', icon: '🏎️' },
    { name: 'Adventure', icon: '🌲' },
    { name: 'Kids', icon: '🧸' },
    { name: 'Sports', icon: '🏀' },
    { name: 'Card', icon: '🃏' },
    { name: 'Board', icon: '♟️'},
    { name: 'Match 3', icon: '💎'},
    { name: 'Dice', icon: '🎲'},
    { name: 'Fighting', icon: '🥊' },
    { name: 'Memory', icon: '🧠'},
    { name: 'Hidden Object', icon: '🕵️‍♂️'},
    { name: 'Word', icon: '🔤'},
    { name: '1 Player', icon: '👤'},
    { name: '2 Player', icon: '🧑‍🤝‍🧑'},
    { name: '3-4 Player', icon: '👨‍👩‍👧‍👦'},
    { name: 'Arcade', icon: '👾' }
];


// Sample games (delete/extend as desired)
const gamesList = [];

//---- SIDEBAR ----//
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.getElementById('sidebarLinks');

// Build Sidebar categories & All Games
function buildSidebarLinks() {
    let html = `<a class="sidebar-link active" data-section="allGamesSection" id="sidebarAllGames"><b>🎮 All Games</b></a>`;
    categories.forEach(cat => {
        html += `<a class="sidebar-link" data-section="cat_${cat.name}">${cat.icon} ${cat.name}</a>`;
    });
    sidebarLinks.innerHTML = html;
}
buildSidebarLinks();

// Sidebar open/close logic with animation
function openSidebar() {
    sidebar.classList.add('open');
    hamburgerBtn.classList.add('open');
    sidebarOverlay.style.display = 'block';
    setTimeout(() => sidebarOverlay.style.opacity = 1, 5);
}
function closeSidebar() {
    sidebar.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    sidebarOverlay.style.opacity = 0;
    setTimeout(() => sidebarOverlay.style.display = 'none', 350);
}
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
sidebarOverlay.addEventListener('click', closeSidebar);

//---- PAGE TRANSITION ----//
// Only 1 page-section is .active at once
function switchSection(sectionId) {
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    if (sectionId === "allGamesSection") {
        document.getElementById('sidebarAllGames').classList.add('active');
    } else {
        let link = [...sidebarLinks.children].find(
            a => a.getAttribute('data-section') === sectionId
        ); link && link.classList.add('active');
    }

    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });
    closeSidebar();
}

// Sidebar link click → change section, animate
sidebarLinks.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('sidebar-link')) {
        const sectionId = e.target.getAttribute('data-section');
        showSection(sectionId);
    }
});

// Show/hide sections with dynamic generation if needed
function showSection(sectionId) {
    if (sectionId === 'allGamesSection') {
        switchSection('allGamesSection');
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }
    // If category page section doesn't exist, create it!
    let sec = document.getElementById(sectionId);
    if (!sec) {
        sec = document.createElement('section');
        sec.className = 'page-section';
        sec.id = sectionId;
        sec.innerHTML =
            `<div class="category-grid" id="catGrid_${sectionId.replace("cat_", "")}"></div>`;
        document.querySelector('main').appendChild(sec);
        // Populate with cards from that category
        renderCategoryGames(sectionId.replace("cat_", ""));
    }
    // Animate transition
    switchSection(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

//---- GAME GRID RENDERING ----//
const gridAll = document.getElementById('gamesGrid');

function renderGameCard({ url, thumb, name, category }) {
    return `
        <div class="game-card" data-category="${category}">
          <div class="game-thumb"><img src="${thumb}" alt="${name}"></div>
          <div class="game-info">
            <div class="game-title">${name}</div>
           <button class="game-play-btn" data-gameurl="${url}">Play</button>

          </div>
        </div>
      `;
}

// Initial load: show all games
function renderAllGames() {
    gridAll.innerHTML = gamesList.map(g => renderGameCard(g)).join('');
}
renderAllGames();

// Render category-specific
function renderCategoryGames(category) {
    let filtered = gamesList.filter(g => g.category === category);
    let catGrid = document.getElementById('catGrid_' + category);
    if (!catGrid) return;
    catGrid.innerHTML = filtered.length
        ? filtered.map(g => renderGameCard(g)).join('')
        : `<div style="padding:56px 0 0 12px; font-size:1.18rem;">No games yet in this category.</div>`;
}

//---- Add New Game API ----//
// You can call this externally as window.addNewGame(...)
function addNewGame(gameURL, thumbnailURL, gameName, categoryName) {
    const newGame = {
        url: gameURL,
        thumb: thumbnailURL,
        name: gameName,
        category: categoryName
    };
    gamesList.push(newGame);

    // Add to all games grid
    gridAll.insertAdjacentHTML('beforeend', renderGameCard(newGame));

    // If a category tab/section is open and matches, add there too
    const catGrid = document.getElementById('catGrid_' + categoryName);
    if (catGrid) {
        catGrid.insertAdjacentHTML('beforeend', renderGameCard(newGame));
    }
}
window.addNewGame = addNewGame; // global for dev/testing

//---- SCROLL TO TOP ----//
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 240) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});
scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scrollBtn.blur();
});

//---- Responsive: hide sidebar if window resized wide ----//
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && sidebar.classList.contains('open'))
        closeSidebar();
});

//---- Make All Games default on page load
switchSection('allGamesSection');

//---- For Demo: Show animation on initial render
setTimeout(() => { document.body.style.opacity = 1; }, 100);

// Game Modal logic
const gameModal = document.getElementById('gameModal');
const gameIframe = document.getElementById('gameIframe');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('gameModalOverlay');
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', function () {
    const gameIframe = document.getElementById('gameIframe');
    if (gameIframe.requestFullscreen) {
        gameIframe.requestFullscreen();
    } else if (gameIframe.webkitRequestFullscreen) { // Safari
        gameIframe.webkitRequestFullscreen();
    } else if (gameIframe.msRequestFullscreen) { // IE11
        gameIframe.msRequestFullscreen();
    }
});


document.body.addEventListener('click', function (e) {
    // Play button click
    if (e.target && e.target.classList.contains('game-play-btn')) {
        const gameURL = e.target.getAttribute('data-gameurl');
        if (gameURL && gameURL !== '#') {
            gameIframe.src = gameURL;
            gameModal.style.display = 'flex';
            setTimeout(() => { gameModal.style.opacity = 1; }, 10);
        } else {
            alert('Embed URL is missing!');
        }
    }
    // Close modal logic
    if (e.target === closeModalBtn || e.target === modalOverlay) {
        gameModal.style.opacity = 0;
        setTimeout(() => {
            gameModal.style.display = 'none';
            gameIframe.src = '';
        }, 300);
    }
});
addNewGame('https://cdn.htmlgames.com/DutchShuffleboard/', 'https://www.htmlgames.com/uploaded/game/thumb200/dutchshuffleboard200.webp', 'Dutch Shuffleboard', 'Sports');
addNewGame('https://cdn.htmlgames.com/MayaGolf2/', 'https://www.htmlgames.com/uploaded/game/thumb200/mayagolf2200.webp', 'Maya Golf 2', 'Sports');
addNewGame('https://cdn.htmlgames.com/BubbleShooter/', 'https://www.htmlgames.com/uploaded/game/thumb200/bubbleshooter200.webp', 'Bubble Shooter', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/Chess/', 'https://www.htmlgames.com/uploaded/game/thumb/chess-300x200.webp', 'Chess', 'Board');
addNewGame('https://cdn.htmlgames.com/Checkers/', 'https://www.htmlgames.com/uploaded/game/thumb/checkers300.webp', 'Checkers', 'Board');
addNewGame('https://cdn.htmlgames.com/BounceBall2/', 'https://www.htmlgames.com/uploaded/game/thumb200/bounceball2200.webp', 'Bounce Ball 2', 'Arcade');
addNewGame('https://cdn.htmlgames.com/CubeBuster/', 'https://www.htmlgames.com/uploaded/game/thumb200/cubebuster200.webp', 'Cube Buster', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/SolitaireReverse/', 'https://www.htmlgames.com/uploaded/game/thumb200/solitairereverse200.webp', 'Solitaire Reverse', 'Card');
addNewGame('https://cdn.htmlgames.com/WildWestKlondike/', 'https://www.htmlgames.com/uploaded/game/thumb200/wildwestklondike200.webp', 'Wild West Klondike', 'Card');
addNewGame('https://cdn.htmlgames.com/MontanaSolitaire/', 'https://www.htmlgames.com/uploaded/game/thumb200/montanasolitaire200.webp', 'Montana Solitaire', 'Card');
addNewGame('https://cdn.htmlgames.com/FlowerWorld2/', 'https://www.htmlgames.com/uploaded/game/thumb200/flowerworld2200.webp', 'Flower World 2', 'Match 3');
addNewGame('https://cdn.htmlgames.com/AladdinSolitaire/', 'https://www.htmlgames.com/uploaded/game/thumb200/aladdinsolitaire200.webp', 'Aladdin Solitaire', 'Card');
addNewGame('https://cdn.htmlgames.com/LoveBubbles/', 'https://www.htmlgames.com/uploaded/game/thumb200/lovebubbles200.webp', 'Love Bubbles', 'Bubble Shooter');
addNewGame('https://cdn.htmlgames.com/PantagruelDoubleKlondike/', 'https://www.htmlgames.com/uploaded/game/thumb200/pantagrueldoubleklondike200.webp', 'Pantagruel Double Klondike', 'Card');
addNewGame('https://cdn.htmlgames.com/MysteriousPirateJewels3/', 'https://www.htmlgames.com/uploaded/game/thumb200/mysteriouspiratejewels3200.webp', 'Mysterious Pirate Jewels 3', 'Match 3');
addNewGame('https://cdn.htmlgames.com/TripleDimensionsIceAge/', 'https://www.htmlgames.com/uploaded/game/thumb200/triple-dimensions-ice-age-200.webp', 'Triple Dimensions Ice Age', 'Card');
addNewGame('https://cdn.htmlgames.com/NinjaBreakout/', 'https://www.htmlgames.com/uploaded/game/thumb200/ninjabreakout200.webp', 'Ninja Breakout', 'Arcade');
addNewGame('https://cdn.htmlgames.com/ChristmasTreeSolitaire/', 'https://www.htmlgames.com/uploaded/game/thumb200/christmastreesolitaire200.webp', 'Christmas Tree Solitaire', 'Card');
addNewGame('https://cdn.htmlgames.com/HiddenSpotsCity/', 'https://www.htmlgames.com/uploaded/game/thumb200/hiddenspots-city200.webp', 'Hidden Spots City', 'Hidden Object');
addNewGame('https://cdn.htmlgames.com/BalloonMaze/', 'https://www.htmlgames.com/uploaded/game/thumb200/balloonmaze200.webp', 'Balloon Maze', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/DeliciousDuos/', 'https://www.htmlgames.com/uploaded/game/thumb200/deliciousduos200.webp', 'Delicious Duos', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/ChristmasMatch3/', 'https://www.htmlgames.com/uploaded/game/thumb200/christmasmatch3200.webp', 'Christmas Match 3', 'Match 3');
addNewGame('https://cdn.htmlgames.com/CarParkSort/', 'https://www.htmlgames.com/uploaded/game/thumb200/carparksort200.webp', 'Car Park Sort', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/Mahjong/', 'https://www.htmlgames.com/uploaded/game/thumb200/mahjong200.webp', 'Mahjong', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/Sudoku/', 'https://www.htmlgames.com/uploaded/game/thumb/dailysudoku300x200.webp', 'Sudoku', 'Puzzle');
addNewGame('https://cdn.htmlgames.com/WordSearch/', 'https://www.htmlgames.com/uploaded/game/thumb/wordsearch300.webp', 'Word Search', 'Word');
addNewGame('https://cdn.htmlgames.com/Hangman/', 'https://www.htmlgames.com/uploaded/game/thumb200/hangman200.webp', 'Hangman', 'Word');
addNewGame('https://cdn.htmlgames.com/TicTacToe/', 'https://www.htmlgames.com/uploaded/game/thumb200/tictactoe200.webp', 'Tic Tac Toe', 'Board');
addNewGame('https://cdn.htmlgames.com/ConnectFour/', 'https://www.htmlgames.com/uploaded/game/thumb/connect4300.webp', 'Connect Four', 'Board');
addNewGame('https://cdn.htmlgames.com/Reversi/', 'https://www.htmlgames.com/uploaded/game/thumb/reversi300.webp', 'Reversi', 'Board');
addNewGame('https://cdn.htmlgames.com/Backgammon/', 'https://www.htmlgames.com/uploaded/game/thumb200/backgammon200.webp', 'Backgammon', 'Board');
