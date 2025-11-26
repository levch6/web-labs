const tabsContainer = document.getElementById('tabsContainer');
let currentTabsData = [];

function fetchTabs() {
    fetch('server/server.php')
        .then(response => response.json())
        .then(data => {
            // Simple check to avoid unnecessary re-renders if data hasn't changed
            if (JSON.stringify(data) !== JSON.stringify(currentTabsData)) {
                currentTabsData = data;
                renderTabs(data);
            }
        })
        .catch(error => console.error('Error fetching tabs:', error));
}

function renderTabs(tabs) {
    tabsContainer.innerHTML = '';

    if (tabs.length === 0) {
        tabsContainer.innerHTML = '<p>Немає доступної інформації.</p>';
        return;
    }

    const headersDiv = document.createElement('div');
    headersDiv.className = 'tab-headers';

    const contentsDiv = document.createElement('div');
    contentsDiv.className = 'tab-contents';

    tabs.forEach((tab, index) => {
        // Header
        const header = document.createElement('button');
        header.className = 'tab-header';
        header.textContent = tab.title;
        header.title = tab.title; // Tooltip for truncated text
        header.dataset.index = index;
        if (index === 0) header.classList.add('active');
        
        header.addEventListener('click', () => {
            document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            header.classList.add('active');
            contentsDiv.children[index].classList.add('active');
        });

        headersDiv.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.className = 'tab-content';
        content.textContent = tab.content;
        if (index === 0) content.classList.add('active');
        
        contentsDiv.appendChild(content);
    });

    tabsContainer.appendChild(headersDiv);
    tabsContainer.appendChild(contentsDiv);
}

// Initial fetch
fetchTabs();

// Auto-update every 3 seconds
setInterval(fetchTabs, 3000);
