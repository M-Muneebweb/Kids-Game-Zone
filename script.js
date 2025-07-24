        document.addEventListener('DOMContentLoaded', function() {
            // Variables
            const modal = document.getElementById('game-modal');
            const modalContent = document.querySelector('.modal-content');
            const modalGameFrame = document.getElementById('modal-game-frame');
            const modalTitle = document.querySelector('.modal-title');
            const closeModal = document.querySelector('.close-modal');
            const toggleFullscreen = document.getElementById('toggle-fullscreen');
            const scrollTopBtn = document.getElementById('scroll-top');
            
            let isFullscreen = false;
            let currentGameUrl = '';
            let currentGameTitle = '';

            // Tab functionality
            function showTab(tabId) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show the selected tab
                document.getElementById(tabId + '-tab').classList.add('active');
                
                // Update active state in navigation
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-tab') === tabId) {
                        link.classList.add('active');
                    }
                });
                
                // Update active state in tab buttons
                document.querySelectorAll('.tab-button').forEach(button => {
                    button.classList.remove('active');
                    if (button.getAttribute('data-tab') === tabId) {
                        button.classList.add('active');
                    }
                });
                
                // Scroll to top when changing tabs
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
            // Add event listeners to all tab links
            document.querySelectorAll('[data-tab]').forEach(element => {
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tabId = this.getAttribute('data-tab');
                    showTab(tabId);
                });
            });

            // Scroll to top functionality
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 500) {
                    scrollTopBtn.classList.add('active');
                } else {
                    scrollTopBtn.classList.remove('active');
                }
            });

            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Game modal functionality
            function openModal(gameTitle, gameUrl, fullscreen = false) {
                currentGameTitle = gameTitle;
                currentGameUrl = gameUrl;
                modalTitle.textContent = gameTitle;
                 modalGameFrame.innerHTML = `<iframe src="${gameUrl}" frameborder="0" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
                
                if (fullscreen) {
                    modalContent.classList.add('fullscreen');
                    toggleFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
                    isFullscreen = true;
                } else {
                    modalContent.classList.remove('fullscreen');
                    toggleFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
                    isFullscreen = false;
                }
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }

            function closeModalFunction() {
                modal.style.display = 'none';
                modalGameFrame.innerHTML = '';
                document.body.style.overflow = 'auto';
                modalContent.classList.remove('fullscreen');
                isFullscreen = false;
            }

            // Event listeners for game cards
            document.querySelectorAll('.game-card').forEach(card => {
                const playButton = card.querySelector('.play-button');
                const fullscreenButton = card.querySelector('.fullscreen-button');
                const gameTitle = card.getAttribute('data-game-title');
                const gameUrl = card.getAttribute('data-game-url');

                if (playButton) {
                    playButton.addEventListener('click', function() {
                        openModal(gameTitle, gameUrl, false);
                    });
                }

                if (fullscreenButton) {
                    fullscreenButton.addEventListener('click', function() {
                        openModal(gameTitle, gameUrl, true);
                    });
                }
            });

            // Modal controls
            closeModal.addEventListener('click', closeModalFunction);

            toggleFullscreen.addEventListener('click', function() {
                if (isFullscreen) {
                    modalContent.classList.remove('fullscreen');
                    this.innerHTML = '<i class="fas fa-expand"></i>';
                    this.title = 'Fullscreen';
                    isFullscreen = false;
                } else {
                    modalContent.classList.add('fullscreen');
                    this.innerHTML = '<i class="fas fa-compress"></i>';
                    this.title = 'Exit Fullscreen';
                    isFullscreen = true;
                }
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModalFunction();
                }
            });

            // Escape key to close modal
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && modal.style.display === 'block') {
                    closeModalFunction();
                }
            });

            // Category filtering
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // Show the popular games tab
                    showTab('popular');
                    
                    // Add animation to show filtering
                    const gameCards = document.querySelectorAll('.game-card');
                    gameCards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    // Show a message about filtering
                    const gamesSection = document.querySelector('#popular-tab .section-title');
                    gamesSection.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Games';
                });
            });

            // Search functionality
            const searchInput = document.querySelector('.search-box input');
            const searchButton = document.querySelector('.search-box button');

            function performSearch() {
                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    // Show popular games tab for search results
                    showTab('popular');
                    
                    const gameCards = document.querySelectorAll('.game-card');
                    let foundGames = false;
                    
                    gameCards.forEach(card => {
                        const gameTitle = card.getAttribute('data-game-title').toLowerCase();
                        if (gameTitle.includes(query)) {
                            card.style.display = 'block';
                            foundGames = true;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Update section title to show search results
                    const gamesSection = document.querySelector('#popular-tab .section-title');
                    gamesSection.textContent = `Search Results for "${query}"`;
                    
                    if (!foundGames) {
                        alert('No games found matching your search. Try different keywords!');
                        gameCards.forEach(card => card.style.display = 'block');
                        gamesSection.textContent = 'Popular Games';
                    }
                } else {
                    document.querySelectorAll('.game-card').forEach(card => {
                        card.style.display = 'block';
                    });
                    
                    // Reset section title
                    const gamesSection = document.querySelector('#popular-tab .section-title');
                    gamesSection.textContent = 'Popular Games';
                }
            }

            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Add scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            document.querySelectorAll('.game-card, .category-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });

            // Add loading animation
            window.addEventListener('load', function() {
                document.body.classList.add('loaded');
            });

            // Add confetti effect when clicking play button
            document.querySelectorAll('.play-button').forEach(button => {
                button.addEventListener('mousedown', function(e) {
                    // Create confetti elements
                    for (let i = 0; i < 30; i++) {
                        createConfetti(e.clientX, e.clientY);
                    }
                });
            });

            function createConfetti(x, y) {
                const colors = ['#ff6b6b', '#4a3aff', '#ffd53e', '#4cd137', '#ff9a9e'];
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 10 + 5 + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.zIndex = '9999';
                confetti.style.pointerEvents = 'none';
                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';
                document.body.appendChild(confetti);
                
                // Animate confetti
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 5 + 5;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                let posX = x;
                let posY = y;
                
                const animate = () => {
                    posX += vx;
                    posY += vy - 0.5; // Add gravity
                    confetti.style.left = posX + 'px';
                    confetti.style.top = posY + 'px';
                    confetti.style.opacity = parseFloat(confetti.style.opacity || 1) - 0.02;
                    
                    if (parseFloat(confetti.style.opacity) > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        confetti.remove();
                    }
                };
                
                requestAnimationFrame(animate);
            }
        });