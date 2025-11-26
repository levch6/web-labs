let tabs = [];
const titleInput = document.getElementById('tabTitle');
const contentInput = document.getElementById('tabContent');
const tabsList = document.getElementById('tabsList');
const saveBtn = document.getElementById('saveBtn');

// Load existing tabs on page load
fetch('server.php')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            tabs = data;
            renderList();
        }
    })
    .catch(error => console.error('Error loading tabs:', error));

document.getElementById('addTabBtn').addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
        tabs.push({ title, content });
        renderList();
        titleInput.value = '';
        contentInput.value = '';
    } else {
        alert('Будь ласка, заповніть обидва поля.');
    }
});

function renderList() {
    tabsList.innerHTML = '';
    tabs.forEach((tab, index) => {
        const li = document.createElement('li');
        li.textContent = `${tab.title} - ${tab.content.substring(0, 30)}...`;
        tabsList.appendChild(li);
    });
}

saveBtn.addEventListener('click', () => {
    fetch('server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tabs)
    })
    .then(response => response.json())
    .then(data => {
        alert('Дані успішно збережено!');
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Помилка при збереженні.');
    });
});

document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (confirm('Ви впевнені, що хочете видалити всі таби?')) {
        fetch('server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([]) // Send empty array to clear data
        })
        .then(response => response.json())
        .then(data => {
            tabs = []; // Clear local array
            renderList(); // Update UI
            alert('Всі дані успішно видалено!');
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Помилка при видаленні.');
        });
    }
});
