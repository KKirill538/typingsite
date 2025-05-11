document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const textInputElement = document.getElementById('text-input');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('reset-button');
    const resultsContainer = document.createElement('div'); 
    resultsContainer.className = 'results-container';
    resultsContainer.style.display = 'none'; 

    const resultsWpm = document.createElement('p');
    const resultsAccuracy = document.createElement('p');
    const resultsRestartButton = document.createElement('button');
    resultsRestartButton.textContent = 'Начать заново';
    resultsRestartButton.addEventListener('click', startTest);

    resultsContainer.appendChild(resultsWpm);
    resultsContainer.appendChild(resultsAccuracy);
    resultsContainer.appendChild(resultsRestartButton);
    document.querySelector('.typing-area').appendChild(resultsContainer); 

    let currentText = "";
    let typedText = "";
    let startTime;
    let timerInterval;
    let errors = 0;
    let charactersTypedTotal = 0;
    let correctCharsInCurrentWordStream = 0;
    let testActive = false;

    async function fetchNewText() {
        textInputElement.disabled = true;
        textToTypeElement.textContent = "Загрузка нового текста...";
        try {
            const response = await fetch('/get_text');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("Не удалось загрузить текст:", error);
            textToTypeElement.textContent = "Ошибка загрузки текста. Попробуйте еще раз.";
            return "Ошибка загрузки. Пожалуйста, нажмите сброс.";
        } finally {
            textInputElement.disabled = false;
        }
    }

    function updateTextDisplay() {
        textToTypeElement.innerHTML = '';
        const textChars = currentText.split('');
        const inputChars = textInputElement.value.split('');

        textChars.forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char;
            if (index < inputChars.length) {
                if (inputChars[index] === char) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('incorrect');
                }
            }
            if (index === inputChars.length) {
                span.classList.add('current');
            }
            textToTypeElement.appendChild(span);
        });
    }

    function calculateStats() {
        if (!startTime) return;

        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.textContent = `${elapsedTime}s`;

        const wordsTyped = correctCharsInCurrentWordStream / 5;
        const minutes = elapsedTime / 60;
        let currentWpm = 0;
        if (minutes > 0) {
            currentWpm = Math.round(wordsTyped / minutes);
        }
        wpmElement.textContent = currentWpm < 0 ? 0 : currentWpm;

        if (charactersTypedTotal === 0) {
            accuracyElement.textContent = "100%";
        } else {
            const accuracy = Math.round(((charactersTypedTotal - errors) / charactersTypedTotal) * 100);
            accuracyElement.textContent = `${accuracy < 0 ? 0 : accuracy}%`;
        }
    }

    function endTest() {
        if (!testActive) return;
        testActive = false;
        clearInterval(timerInterval);
        textInputElement.disabled = true;
        calculateStats();
        resultsWpm.textContent = `Ваша скорость: ${wpmElement.textContent} WPM`;
        resultsAccuracy.textContent = `Точность: ${accuracyElement.textContent}%`;
        resultsContainer.style.display = 'block'; 
    }

    async function startTest() {
        clearInterval(timerInterval);
        currentText = await fetchNewText();

        textInputElement.value = "";
        textInputElement.disabled = false;
        textInputElement.focus();

        errors = 0;
        charactersTypedTotal = 0;
        correctCharsInCurrentWordStream = 0;
        startTime = null;
        testActive = true;
        resultsContainer.style.display = 'none';

        wpmElement.textContent = "0";
        accuracyElement.textContent = "100%";
        timerElement.textContent = "0s";

        updateTextDisplay();
    }

    textInputElement.addEventListener('input', () => {
        if (!currentText || currentText.startsWith("Ошибка загрузки") || !testActive) {
            textInputElement.value = "";
            return;
        }

        if (!startTime) {
            startTime = new Date();
            timerInterval = setInterval(calculateStats, 1000);
        }

        typedText = textInputElement.value;
        charactersTypedTotal = typedText.length;
        errors = 0;
        correctCharsInCurrentWordStream = 0;

        for (let i = 0; i < typedText.length; i++) {
            if (i < currentText.length) {
                if (typedText[i] === currentText[i]) {
                    correctCharsInCurrentWordStream++;
                } else {
                    errors++;
                }
            } else {
                errors++;
            }
        }

        updateTextDisplay();
        calculateStats();

        if (typedText.length === currentText.length) {
            endTest();
        }
    });

    resetButton.addEventListener('click', () => {
        startTest();
    });

    startTest();
});