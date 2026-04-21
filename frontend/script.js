const API = 'http://localhost:3000';

    const passwordInput = document.getElementById('password'); // Получаем ссылки на все элементы HTML
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const useUpper = document.getElementById('useUpper');
    const useLower = document.getElementById('useLower');
    const useDigits = document.getElementById('useDigits');
    const useSpecial = document.getElementById('useSpecial');
    const excludeAmbiguous = document.getElementById('excludeAmbiguous');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const historyList = document.getElementById('historyList');

    lengthSlider.addEventListener('input', () => { // ползунок
        lengthValue.textContent = lengthSlider.value;
    });

    async function loadHistory() {
        try {
            const res = await fetch(`${API}/api/history`); // get api запрос на историю
            const history = await res.json();
            renderHistory(history);
        } catch (err) {
            console.warn('Не удалось загрузить историю', err);
        }
    }

    function renderHistory(history) { //отображение истории
        if (!history.length) {
            historyList.innerHTML = '<li style="color:#666;">История пуста</li>';
            return;
        }
        // Превращаем массив истории в HTML-элементы
        historyList.innerHTML = history.map(item => ` 
            <li>
                <span class="history-password">${escapeHtml(item.password)}</span> 
                <button class="history-copy" data-password="${escapeHtml(item.password)}">Копировать</button>
            </li>
        `).join('');

        document.querySelectorAll('.history-copy').forEach(btn => { // Для каждой кнопки копирования в истории добавляем обработчик
            btn.addEventListener('click', () => {
                const pwd = btn.getAttribute('data-password');
                navigator.clipboard.writeText(pwd);
                btn.textContent = '✅';
                setTimeout(() => btn.textContent = 'Копировать', 1000);
            });
        });
    }

    async function checkStrength(password) { // Проверка силы пароля через бэкенд
        try {
            const res = await fetch(`${API}/api/check-strength`, { // Отправляем POST-запрос на /api/check-strength
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            strengthBar.style.width = (data.score / 7) * 100 + '%';  // Обновляем индикатор силы: ширина = процент от максимального счёта (7)
            strengthBar.style.backgroundColor = data.color;
            strengthText.textContent = data.strength === 'strong' ? '💪 Сильный' : (data.strength === 'medium' ? '⚠️ Средний' : '❌ Слабый');
        } catch (err) {
            console.warn('Ошибка проверки силы');
        }
    }

    async function generatePassword() { // Генерация пароля через бэкенд. эта функция делает запрос на бэкенд(вроде не апи) для генерации
        const length = parseInt(lengthSlider.value);
        const payload = {
            length,
            useUpper: useUpper.checked,
            useLower: useLower.checked,
            useDigits: useDigits.checked,
            useSpecial: useSpecial.checked,
            excludeAmbiguous: excludeAmbiguous.checked
        };

        try {   // Отправляем POST-запрос на /api/generate
            const res = await fetch(`${API}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.password) {
                passwordInput.value = data.password;
                checkStrength(data.password);
                if (data.history) renderHistory(data.history);
                else loadHistory();
            } else {
                alert('Ошибка: ' + (data.error || 'неизвестная'));
            }
        } catch (err) {
            console.error(err);
            alert('Не удалось соединиться с бэкендом. Запустили node server.js?');
        }
    }

    copyBtn.addEventListener('click', () => { // Копирование основного пароля в буфер
        if (passwordInput.value) {
            navigator.clipboard.writeText(passwordInput.value);
            copyBtn.textContent = '✅ Скопировано!';
            setTimeout(() => copyBtn.textContent = '📋 Копировать', 1500);
        }
    });

    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        generatePassword();
    });

    function escapeHtml(str) { // Функция защиты от XSS-атак (экранирование спецсимволов)?????? возможно удалить ????
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    loadHistory();
    console.log('Страница загружена, бэкенд на ' + API);