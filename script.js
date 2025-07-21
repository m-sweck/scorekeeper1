document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded! Script is running.');

    const numPlayersInput = document.getElementById('numPlayers');
    const startGameBtn = document.getElementById('startGame');
    const gameplaySection = document.getElementById('gameplay-section');
    const playerNamesInputDiv = document.getElementById('player-names-input');
    const savePlayerNamesBtn = document.getElementById('savePlayerNames');
    const playerHeadersRow = document.getElementById('player-headers');
    const scoreBody = document.getElementById('score-body');
    const totalRow = document.getElementById('total-row');
    const addRoundBtn = document.getElementById('addRound');
    const setupSection = document.querySelector('.setup-section');

    // Initial console logs to check if elements are found
    console.log('numPlayersInput:', numPlayersInput);
    console.log('startGameBtn:', startGameBtn);
    console.log('gameplaySection:', gameplaySection);
    console.log('playerNamesInputDiv:', playerNamesInputDiv);
    console.log('savePlayerNamesBtn:', savePlayerNamesBtn);
    console.log('setupSection:', setupSection);


    let numPlayers = 0;
    let playerNames = [];
    let scores = [];
    let roundNumber = 0;

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        console.log('Start Game button clicked!');

        numPlayers = parseInt(numPlayersInput.value);
        if (isNaN(numPlayers) || numPlayers < 2) { // Added isNaN check for robustness
            alert('Please enter a valid number of players (at least 2).');
            return;
        }

        playerNames = Array(numPlayers).fill('');
        scores = [];
        roundNumber = 0;

        // Hide setup, show gameplay section
        setupSection.classList.add('hidden');
        gameplaySection.classList.remove('hidden');

        // Prepare and show player name input section
        generatePlayerNameInputs(); // This function will populate playerNamesInputDiv
        playerNamesInputDiv.classList.remove('hidden'); // Ensure the container is visible
        savePlayerNamesBtn.classList.remove('hidden'); // Ensure the button is visible

        console.log('After Start Game Click - playerNamesInputDiv content:', playerNamesInputDiv.innerHTML); // Debugging line
    });

    savePlayerNamesBtn.addEventListener('click', () => {
        console.log('Save Player Names button clicked!');
        const nameInputs = playerNamesInputDiv.querySelectorAll('input[type="text"]');
        let allNamesEntered = true;
        nameInputs.forEach((input, index) => {
            if (input.value.trim() === '') {
                allNamesEntered = false;
                input.focus();
            }
            playerNames[index] = input.value.trim() || `Player ${index + 1}`;
        });

        if (!allNamesEntered) {
            alert('Please enter names for all players.');
            return;
        }

        updatePlayerHeaders();
        addRound();
        playerNamesInputDiv.classList.add('hidden'); // Hide player name input section after saving
        savePlayerNamesBtn.classList.add('hidden'); // Hide save button after saving
    });

    addRoundBtn.addEventListener('click', addRound);

    // --- Functions ---

    function generatePlayerNameInputs() {
        console.log('Generating player name inputs for', numPlayers, 'players.'); // Debugging line
        playerNamesInputDiv.innerHTML = ''; // Clear any previous inputs before generating new ones
        for (let i = 0; i < numPlayers; i++) {
            const label = document.createElement('label');
            label.textContent = `Player ${i + 1} Name:`;
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Enter name for ${playerNames[i] || `Player ${i + 1}`}`; // Use existing name if available
            input.id = `player-name-${i}`;
            input.value = playerNames[i]; // Pre-fill if names were previously entered (e.g., if you reset game)
            playerNamesInputDiv.appendChild(label);
            playerNamesInputDiv.appendChild(input);
        }
        console.log('Player name inputs generated. Current innerHTML:', playerNamesInputDiv.innerHTML); // Debugging line
    }

    function updatePlayerHeaders() {
        // Clear existing headers except "Round"
        while (playerHeadersRow.children.length > 1) {
            playerHeadersRow.removeChild(playerHeadersRow.lastChild);
        }

        playerNames.forEach(name => {
            const th = document.createElement('th');
            th.textContent = name;
            playerHeadersRow.appendChild(th);
        });
    }

    function addRound() {
        roundNumber++;
        const newRow = document.createElement('tr');
        const roundCell = document.createElement('td');
        roundCell.textContent = roundNumber;
        newRow.appendChild(roundCell);

        const currentRoundScores = [];
        for (let i = 0; i < numPlayers; i++) {
            const scoreCell = document.createElement('td');
            const scoreInput = document.createElement('input');
            scoreInput.type = 'number';
            scoreInput.value = 0;
            scoreInput.min = 0;

            scoreInput.addEventListener('input', updateTotals);
            scoreCell.appendChild(scoreInput);
            newRow.appendChild(scoreCell);
            currentRoundScores.push(0);
        }
        scores.push(currentRoundScores);
        scoreBody.appendChild(newRow);

        updateTotals();
    }

	function updateTotals() {
        const totalScores = Array(numPlayers).fill(0);

        const scoreRows = scoreBody.querySelectorAll('tr');
        scoreRows.forEach((row, rowIndex) => {
            const inputs = row.querySelectorAll('input[type="number"]');
            inputs.forEach((input, playerIndex) => {
                const score = parseInt(input.value) || 0;
                totalScores[playerIndex] += score;
            });
        });

        // Clear existing total cells and re-add them
        while (totalRow.children.length > 1) { // Keep the first cell "Total"
            totalRow.removeChild(totalRow.lastChild);
        }

        let highestScore = -Infinity; // Initialize with a very low number
        if (totalScores.length > 0) {
            highestScore = Math.max(...totalScores); // Find the highest score
        }


        totalScores.forEach(total => {
            const td = document.createElement('td');
            td.textContent = total;

            // --- NEW LOGIC FOR WINNER HIGHLIGHTING ---
            if (totalScores.length > 0 && total === highestScore && highestScore !== 0) {
                // Check if there's a tie for the highest score.
                // If multiple players have the same highest score, highlight all of them.
                const countOfHighest = totalScores.filter(score => score === highestScore).length;
                if (countOfHighest >= 1) { // If it's the only winner or one of multiple winners
                     td.classList.add('winner');
                }
            }
            // --- END NEW LOGIC ---

            totalRow.appendChild(td);
        });
    }
});