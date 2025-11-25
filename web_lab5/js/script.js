// Task 1: Swap texts in Block 2 and Block 6
function swapContent() {
    const block2 = document.querySelector('.block-2');
    const block6 = document.querySelector('.block-6');
    
    if (block2 && block6) {
        const temp = block2.innerHTML;
        block2.innerHTML = block6.innerHTML;
        block6.innerHTML = temp;
    }
}

// Task 2: Calculate Rhombus Area
function calculateRhombusArea(d1, d2) {
    return (d1 * d2) / 2;
}

function task2() {
    const d1 = 12; // Diagonal 1
    const d2 = 16; // Diagonal 2
    const area = calculateRhombusArea(d1, d2);
    
    const block5 = document.querySelector('.block-5');
    if (block5) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'js-form-container';
        resultDiv.innerHTML = `<p><strong>Площа ромба</strong> (d1=${d1}, d2=${d2}): ${area}</p>`;
        block5.appendChild(resultDiv);
    }
}

// Task 3: Min/Max with Cookies
function task3() {
    const block5 = document.querySelector('.block-5');
    const cookieName = "minMaxResult";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const savedResult = getCookie(cookieName);

    if (savedResult) {
        const deleteCookie = confirm(`Збережений результат: ${savedResult}. Видалити дані з cookies?`);
        if (deleteCookie) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            location.reload(); 
        } else {
            alert("Cookies наявні. Необхідно перезавантажити сторінку, щоб побачити форму знову.");
        }
    } else {
        const formHtml = `
            <div class="js-form-container">
                <h4>Знайти мінімальне та максимальне (10 чисел)</h4>
                <form onsubmit="processMinMax(event)" class="min-max-form">
                    <input type="number" name="num" required value="10">
                    <input type="number" name="num" required value="5">
                    <input type="number" name="num" required value="8">
                    <input type="number" name="num" required value="3">
                    <input type="number" name="num" required value="12">
                    <input type="number" name="num" required value="7">
                    <input type="number" name="num" required value="1">
                    <input type="number" name="num" required value="9">
                    <input type="number" name="num" required value="4">
                    <input type="number" name="num" required value="6">
                    <button type="submit">Обчислити</button>
                </form>
            </div>
        `;
        block5.insertAdjacentHTML('beforeend', formHtml);
    }
}

window.processMinMax = function(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll('input[name="num"]');
    let numbers = [];
    inputs.forEach(input => numbers.push(parseFloat(input.value)));
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    
    const result = `Min: ${min}, Max: ${max}`;
    alert(result);
    
    document.cookie = `minMaxResult=${result}; path=/`;
};

// Task 4: Border Color on Focus
function task4() {
    const allBlocks = document.querySelectorAll('.block');
    // Select only side blocks (Block 1 and Block 4) for the trigger
    const triggerBlocks = document.querySelectorAll('.block-1, .block-4');
    let lastFocusTime = 0; // Debounce timestamp
    
    const savedColor = localStorage.getItem('borderColor');
    if (savedColor) {
        allBlocks.forEach(b => b.style.borderColor = savedColor);
    }

    triggerBlocks.forEach(b => {
        b.setAttribute('tabindex', '0'); 
        b.addEventListener('focus', () => {
            // Prevent infinite loop: ignore focus events that happen immediately after prompt closes
            const now = Date.now();
            if (now - lastFocusTime < 500) return;
            lastFocusTime = now;

            const currentColor = localStorage.getItem('borderColor') || 'black';
            
            setTimeout(() => {
                const newColor = prompt("Введіть колір рамки (наприклад, red, blue, #00ff00):", currentColor);
                
                lastFocusTime = Date.now();

                if (newColor) {
                    allBlocks.forEach(block => block.style.borderColor = newColor);
                    localStorage.setItem('borderColor', newColor);
                }
            }, 10);
        });
    });
}

// Task 5: Images
function task5() {
    const blockY = document.querySelector('.footer-slogan'); 
    const block5 = document.querySelector('.block-5');
    const block4 = document.querySelector('.block-4');
    
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
    savedImages.forEach(url => addImageToBlock(url));

    function addImageToBlock(url) {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'added-image';
        img.style.maxWidth = '100%';
        img.style.marginTop = '10px';
        img.style.display = 'block';
        block4.appendChild(img);
    }

    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (blockY.contains(range.commonAncestorContainer) && !selection.isCollapsed) {
                if (!document.getElementById('imageForm')) {
                    const formHtml = `
                        <div id="imageForm" class="js-form-container">
                            <h4>Додати зображення</h4>
                            <div class="image-form">
                                <input type="url" id="imgUrl" placeholder="URL зображення" value="https://picsum.photos/200/300">
                                <button onclick="saveImage()">Зберегти</button>
                                <button onclick="clearImages()" style="background-color: #dc3545;">Видалити все</button>
                            </div>
                        </div>
                    `;
                    block5.insertAdjacentHTML('beforeend', formHtml);
                }
            }
        }
    });

    window.saveImage = function() {
        const urlInput = document.getElementById('imgUrl');
        const url = urlInput.value;
        if (url) {
            const images = JSON.parse(localStorage.getItem('savedImages') || '[]');
            images.push(url);
            localStorage.setItem('savedImages', JSON.stringify(images));
            addImageToBlock(url);
            alert('Зображення додано!');
        }
    };

    window.clearImages = function() {
        localStorage.removeItem('savedImages');
        const addedImages = block4.querySelectorAll('.added-image');
        addedImages.forEach(img => img.remove());
        alert('Зображення видалено!');
    };
}

document.addEventListener('DOMContentLoaded', () => {
    swapContent();
    task2();
    task3();
    task4();
    task5();
});
