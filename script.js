document.addEventListener('DOMContentLoaded', () => {

    // --- IMPORTANT: PASTE YOUR KEYS AND CORRECT ID HERE ---
    // Make SURE this Calendar ID is from your calendar settings, NOT your gmail address.
    const GOOGLE_CALENDAR_API_KEY = 'AIzaSyB3V9S-lgQr995pllU1LBpqsOTOKdziRmw';
    const GEMINI_API_KEY = 'AIzaSyCP9Zpk0Vnvy9FK-Ld63hYQmfxtQObzKHg';
    const CALENDAR_ID = '7e5da0215e1174212c4ded86ef4913e3aa40525501003ab15290f953ceb18efd@group.calendar.google.com'; // <-- It should look like: xxx@group.calendar.google.com
    // --------------------------------------------------------

    // --- LANGUAGE AND TRANSLATION ---
    const langToggle = document.getElementById('lang-toggle');
    const translatableElements = document.querySelectorAll('[data-key]');
    const translations = {
        en: {
            nav_about_me: "About me",
            nav_resources: "Channel Resources",
            nav_contact_me: "Contact me",
            nav_ask_gemini: "Ask Gemini",
            lang_toggle_text: "العربية",
            hero_name: "I'm Carlos",
            hero_title: "Software Engineer",
            about_me_title: "About me",
            about_me_p: "Hey! I'm Carlos — a 13-year-old who’s passionate about programming, learning new technologies, and creating smart digital ideas. I enjoy exploring free Artificial Intelligence tools and trying to change every thing in using the devices from complex to simple.",
            resources_title: "Channel Resources",
            resources_subtitle: "Latest videos, code, and links from the channel, updated automatically.",
            about_channel_title: "About The Channel",
            about_channel_p: "My channel, Techova (short for Technology Innovations), shares smart tips and tricks for mobile devices, quick coding templates in shorts, tutorials, and powerful AI tools to help everyone learn and create with technology.",
            contact_me_title: "Contact me",
            contact_suggestion: "Have an idea for a video? Feel free to reach out!",
        },
        ar: {
            nav_about_me: "عني",
            nav_resources: "مصادر القناة",
            nav_contact_me: "تواصل معي",
            nav_ask_gemini: "اسأل Gemini",
            lang_toggle_text: "English",
            hero_name: "أنا كارلوس",
            hero_title: "مهندس برمجيات",
            about_me_title: "عني",
            about_me_p: "أهلاً! أنا كارلوس — عمري 13 عامًا وشغوف بالبرمجة وتعلم التقنيات الجديدة وإنشاء أفكار رقمية ذكية. أستمتع باستكشاف أدوات الذكاء الاصطناعي المجانية ومحاولة تغيير كل شيء في استخدام الأجهزة من المعقد إلى البسيط.",
            resources_title: "مصادر القناة",
            resources_subtitle: "أحدث الفيديوهات، الأكواد، والروابط من القناة، محدثة تلقائياً.",
            about_channel_title: "عن القناة",
            about_channel_p: "قناتي، Techova (اختصار لـ Technology Innovations)، تشارك نصائح وحيل ذكية للأجهزة المحمولة، وقوالب برمجية سريعة في فيديوهات قصيرة، ودروس تعليمية، وأدوات ذكاء اصطناعي قوية لمساعدة الجميع على التعلم والإبداع باستخدام التكنولوجيا.",
            contact_me_title: "تواصل معي",
            contact_suggestion: "لديك فكرة لفيديو؟ لا تتردد في التواصل!",
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = translations[lang]?.[key];
            if (translation) {
                const textSpan = element.querySelector('span:not([class])'); // Target text span without a class
                if (textSpan) {
                     textSpan.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    };

    langToggle.addEventListener('click', () => {
        const newLang = document.documentElement.lang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });

    // --- GOOGLE CALENDAR FETCH AND RENDER ---
    const eventsContainer = document.getElementById('calendar-events-container');
    let calendarEventsData = [];

    async function fetchCalendarEvents() {
        if (!GOOGLE_CALENDAR_API_KEY.startsWith('AIza') || CALENDAR_ID === 'YOUR_CALENDAR_ID') {
            eventsContainer.innerHTML = `<p style="text-align:center; color: #ffc107;">Please configure Google Calendar API Key and Calendar ID in script.js</p>`;
            return;
        }
        const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}&singleEvents=true&orderBy=startTime&maxResults=9`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`HTTP error 404 (Not Found). This almost always means the Calendar ID is incorrect. Please double-check it.`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            calendarEventsData = data.items || [];
            renderEvents(calendarEventsData);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            eventsContainer.innerHTML = `<p style="text-align:center; color: #dc3545; padding: 1rem;">Failed to load channel resources. ${error.message}</p>`;
        }
    }
    
    function parseDescription(description) {
        // Implementation remains the same...
        const content = { desc: '', links: [], codes: [] };
        if (!description) return content;
        const parts = description.split(/---(LINKS|CODE)---/);
        content.desc = parts[0].trim();
        for (let i = 1; i < parts.length; i += 2) {
            const type = parts[i];
            const value = parts[i + 1];
            if (type === 'LINKS') {
                content.links = value.trim().split('\n').map(link => {
                    const [text, url] = link.split(' - ');
                    return { text: text.trim(), url: url ? url.trim() : '#' };
                }).filter(link => link.text);
            } else if (type === 'CODE') {
                const codeBlocks = value.match(/```(\w*)\n([\s\S]*?)```/g) || [];
                content.codes = codeBlocks.map(block => {
                    const match = block.match(/```(\w*)\n([\s\S]*?)```/);
                    if (!match) return null;
                    return { lang: match[1].toLowerCase() || 'markup', code: match[2].trim() };
                }).filter(Boolean);
            }
        }
        return content;
    }

    function renderEvents(events) {
        // Implementation remains the same...
         eventsContainer.innerHTML = ''; 
        if (events.length === 0) {
            eventsContainer.innerHTML = `<p style="text-align:center;">No recent channel content found in the calendar.</p>`;
            return;
        }
        events.forEach(event => {
            const { desc, links, codes } = parseDescription(event.description);
            const card = document.createElement('div');
            card.className = 'event-card';
            let linksHtml = links.length > 0 ? `<h4>Links & Resources</h4><ul class="links-list">${links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a></li>`).join('')}</ul>` : '';
            let codesHtml = codes.length > 0 ? `<h4>Code Snippets</h4>${codes.map(code => `<pre class="language-${code.lang}"><code class="language-${code.lang}">${Prism.highlight(code.code, Prism.languages[code.lang] || Prism.languages.markup, code.lang)}</code></pre>`).join('')}` : '';
            card.innerHTML = `<h3>${event.summary || 'No Title'}</h3>${event.location ? `<a href="${event.location}" target="_blank" rel="noopener noreferrer" class="video-link">Watch Video →</a>` : ''}<p>${desc || 'No description provided.'}</p>${(links.length > 0 && codes.length > 0) ? '<hr class="event-separator">' : ''}${linksHtml}${codesHtml}`;
            eventsContainer.appendChild(card);
        });
    }

    // --- GEMINI CHAT MODAL ---
    const modal = document.getElementById('gemini-modal');
    const openBtn = document.getElementById('ask-gemini-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContainer = document.getElementById('chat-container');

    const toggleModal = (show) => {
        // Implementation remains the same...
         if (show) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        } else {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    };
    openBtn.addEventListener('click', () => toggleModal(true));
    closeBtn.addEventListener('click', () => toggleModal(false));
    modal.addEventListener('click', (e) => e.target === modal && toggleModal(false));

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userQuery = chatInput.value.trim();
        if (!userQuery) return;
        addChatMessage(userQuery, 'user');
        chatInput.value = '';

        if (!GEMINI_API_KEY.startsWith('AIza')) {
            addChatMessage('Please configure the Gemini API Key in script.js', 'ai error');
            return;
        }

        addChatMessage('...', 'ai thinking');

        try {
            const context = calendarEventsData.map(event => `Video Title: ${event.summary}\nVideo Link: ${event.location || 'Not provided'}\nDescription: ${event.description || 'No description.'}`).join('\n\n---\n\n');
            const prompt = `You are a helpful assistant for the 'Techova' YouTube channel. Based ONLY on the following context about the channel's videos, answer the user's question. If the answer is not in the context, say that you don't have information on that topic.\n\nCONTEXT:\n${context}\n\nUSER QUESTION:\n${userQuery}`;
            
            // *** THIS IS THE FIX: Using the newer gemini-1.5-flash-latest model ***
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            
            if (!response.ok) throw new Error(`API error! status: ${response.status}`);

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;
            addChatMessage(aiResponse, 'ai', true);
        } catch (error) {
            console.error("Error with Gemini API:", error);
            addChatMessage('Sorry, I ran into an error. Please check that the Gemini API key is correct and try again.', 'ai error', true);
        }
    });

    function addChatMessage(message, sender, replaceLast = false) {
        if (replaceLast) {
            const thinkingMsg = chatContainer.querySelector('.thinking');
            if (thinkingMsg) thinkingMsg.remove();
        }
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // --- INITIALIZATION ---
    document.getElementById('year').textContent = new Date().getFullYear();
    setLanguage('en');
    fetchCalendarEvents();
});