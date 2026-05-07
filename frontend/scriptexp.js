// ===== матричный фон =====
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// символы для матричного дождя
const chars =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
    "あいうえおかきくけこさしすせそ" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "ЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" +
    "!@#$%^&*";

const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(11, 18, 32, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(120, 134, 255, 0.85)";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
});

// ===== работа с бэкендом =====
const api = 'http://localhost:3000';

// получение элементов dom
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordInput = document.getElementById("password");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const historyDiv = document.getElementById("history");

// отображение текущей длины
if (lengthInput && lengthValue) {
    lengthValue.textContent = lengthInput.value;
    lengthInput.addEventListener("input", () => {
        lengthValue.textContent = lengthInput.value;
    });
}

// загрузка истории с сервера
async function loadHistory() {
    try {
        const response = await fetch(`${api}/api/history`);
        if (!response.ok) {
            throw new Error('ошибка загрузки истории');
        }
        const history = await response.json();
        renderHistory(history);
    } catch (err) {
        console.error('не удалось загрузить историю:', err);
        if (historyDiv) {
            historyDiv.innerHTML = '<div class="item" style="justify-content:center;">не удалось загрузить историю</div>';
        }
    }
}

// отображение истории на странице
function renderHistory(history) {
    if (!historyDiv) return;

    if (!history || history.length === 0) {
        historyDiv.innerHTML = '<div class="item" style="justify-content:center;">история пуста</div>';
        return;
    }

    historyDiv.innerHTML = "";

    for (let i = 0; i < history.length; i++) {
        const item = history[i];
        const password = item.password;
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <span>${escapeHtml(password)}</span>
            <button class="copy-history-btn" data-password="${escapeHtml(password)}">copy</button>
        `;
        historyDiv.appendChild(div);
    }

    // обработчики для кнопок копирования в истории
    document.querySelectorAll('.copy-history-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pwd = btn.getAttribute('data-password');
            navigator.clipboard.writeText(pwd);
            btn.textContent = 'copied';
            setTimeout(() => btn.textContent = 'copy', 1500);
        });
    });
}

// проверка силы пароля через бэкенд
async function checkStrength(password) {
    try {
        const response = await fetch(`${api}/api/check-strength`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });
        const data = await response.json();
        console.log(`сила пароля: ${data.strength}`); // можно вывести в интерфейс
        return data;
    } catch (err) {
        console.warn('ошибка проверки силы:', err);
        return null;
    }
}

// генерация пароля через бэкенд
async function generatePassword() {
    const length = Number(lengthInput.value);
    const useUpper = uppercaseCheck.checked;
    const useLower = lowercaseCheck.checked;
    const useDigits = numbersCheck.checked;
    const useSpecial = symbolsCheck.checked;

    // проверка: выбран хотя бы один тип символов
    if (!useUpper && !useLower && !useDigits && !useSpecial) {
        alert("выберите хотя бы один тип символов");
        return;
    }

    const payload = {
        length: length,
        useUpper: useUpper,
        useLower: useLower,
        useDigits: useDigits,
        useSpecial: useSpecial,
        excludeAmbiguous: false
    };

    try {
        const response = await fetch(`${api}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            alert('ошибка: ' + (error.error || 'неизвестная ошибка'));
            return;
        }

        const data = await response.json();

        if (data.password) {
            passwordInput.value = data.password;
            checkStrength(data.password);
            if (data.history) {
                renderHistory(data.history);
            } else {
                loadHistory();
            }
        }
    } catch (err) {
        console.error('ошибка соединения с сервером:', err);
        alert('не удалось соединиться с сервером. убедитесь, что бэкенд запущен (node server.js)');
    }
}

// копирование основного пароля в буфер обмена
function copyPassword() {
    if (!passwordInput.value) return;
    navigator.clipboard.writeText(passwordInput.value);
    const copyBtn = document.querySelector('.copy-main');
    if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'copied';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    }
}

// очистка истории через бэкенд
async function clearHistory() {
    try {
        const response = await fetch(`${api}/api/history`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadHistory();
        } else {
            alert('ошибка при очистке истории');
        }
    } catch (err) {
        console.error('ошибка:', err);
        alert('не удалось очистить историю');
    }
}

// защита от xss атак
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// загрузка истории при старте
loadHistory();

// делаем функции глобальными для вызова из html onclick
window.generatePassword = generatePassword;
window.copyPassword = copyPassword;
window.clearHistory = clearHistory;