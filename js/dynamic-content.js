// Dynamic Content Loader for LocalStorage DB using LMS_DB Global
document.addEventListener('DOMContentLoaded', () => {
    // Ensure LMS_DB is available (it should be loaded before this script)
    if (typeof LMS_DB !== 'undefined') {
        loadNews();
        loadEvents();
        loadAppConfig();
    } else {
        console.error('LMS_DB not found. Ensure data-store.js is loaded.');
    }
});

function loadAppConfig() {
    try {
        const config = LMS_DB.getAppConfig();

        // Update Landing Hero Background if exists
        const heroBg = document.querySelector('.relative.h-screen.flex');
        if (heroBg && config.landingBg) {
            const img = heroBg.querySelector('img.absolute.inset-0');
            if (img) img.src = config.landingBg;
        }

        // Update Title if exists
        const heroTitle = document.querySelector('h1.text-5xl');
        if (heroTitle && config.landingTitle) {
            // Apply title directly, preserving specific span if present in config, otherwise just text
            if (config.landingTitle.includes('<span')) {
                heroTitle.innerHTML = config.landingTitle;
            } else {
                // Format: Welcome to Invertis <br> <span class="text-blue-400">Learning Management System</span>
                // If the user set a custom title, we might lose the styling unless we force it.
                // Let's assume the user just types "Welcome to Invertis University"
                // We'll wrap the last few words in blue span for effect if it's long? 
                // Or just simpler:
                heroTitle.textContent = config.landingTitle;
            }
        }
    } catch (e) {
        console.error('Error loading app config', e);
    }
}

function loadNews() {
    try {
        const newsItems = LMS_DB.getNews();
        const newsContainer = document.getElementById('news-container');

        if (newsContainer && newsItems.length > 0) {
            renderNews(newsItems, newsContainer);
        } else if (newsContainer) {
            newsContainer.innerHTML = '<p class="text-gray-500">No news available.</p>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

function loadEvents() {
    try {
        const eventItems = LMS_DB.getEvents();
        const eventsContainer = document.getElementById('events-container');

        if (eventsContainer && eventItems.length > 0) {
            renderEvents(eventItems, eventsContainer);
        } else if (eventsContainer) {
            eventsContainer.innerHTML = '<p class="text-gray-500">No upcoming events.</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function renderNews(newsItems, container) {
    container.innerHTML = newsItems.map(item => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="${item.image || 'https://placehold.co/600x400'}" alt="${item.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <span class="text-sm text-blue-600 font-semibold">${item.date}</span>
                <h3 class="text-lg font-bold text-slate-800 mt-2 mb-2">${item.title}</h3>
                <p class="text-slate-600 text-sm line-clamp-3">${item.content || item.description}</p>
                <a href="#" class="inline-block mt-4 text-amber-600 font-medium hover:text-amber-700">Read More &rarr;</a>
            </div>
        </div>
    `).join('');
}

function renderEvents(eventItems, container) {
    container.innerHTML = eventItems.map(item => `
        <div class="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div class="bg-blue-50 text-blue-700 rounded-lg p-3 text-center min-w-[70px]">
                <span class="block text-xl font-bold">${new Date(item.date).getDate()}</span>
                <span class="block text-xs uppercase font-semibold">${new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div>
                <h4 class="font-bold text-slate-800">${item.title}</h4>
                <p class="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    ${item.location}
                </p>
            </div>
        </div>
    `).join('');
}
