// Get references to the language toggle button and all translatable elements
const langToggle = document.getElementById('lang-toggle');
const translatableElements = document.querySelectorAll('[data-key]');

// Object containing all translations, including the text for the new button
const translations = {
    en: {
        nav_about_me: "About me",
        nav_about_channel: "About channel",
        nav_contact_me: "Contact me",
        hero_name: "I'm Carlos",
        hero_title: "Software Engineer",
        about_me_title: "About me",
        about_me_p: "Hey! I'm Carlos — a 13-year-old who’s passionate about programming, learning new technologies, and creating smart digital ideas. I enjoy exploring free Artificial Intelligence tools and trying to change every thing in using the devices from complex to simple.",
        about_channel_title: "About channel",
        about_channel_p: "My channel, Techova (short for Technology Innovations), shares smart tips and tricks for mobile devices, quick coding templates in shorts, tutorials, and powerful AI tools to help everyone learn and create with technology.",
        contact_me_title: "Contact me",
        contact_suggestion: "You can suggest more ideas for the channel.",
        // This key now targets the span inside the button
        lang_toggle_text: "العربية"
    },
    ar: {
        nav_about_me: "عني",
        nav_about_channel: "عن القناة",
        nav_contact_me: "تواصل معي",
        hero_name: "أنا كارلوس",
        hero_title: "مهندس برمجيات",
        about_me_title: "عني",
        about_me_p: "أهلاً! أنا كارلوس — عمري 13 عامًا وشغوف بالبرمجة وتعلم التقنيات الجديدة وإنشاء أفكار رقمية ذكية. أستمتع باستكشاف أدوات الذكاء الاصطناعي المجانية ومحاولة تغيير كل شيء في استخدام الأجهزة من المعقد إلى البسيط.",
        about_channel_title: "عن القناة",
        about_channel_p: "قناتي، Techova (اختصار لـ Technology Innovations)، تشارك نصائح وحيل ذكية للأجهزة المحمولة، وقوالب برمجية سريعة في فيديوهات قصيرة، ودروس تعليمية، وأدوات ذكاء اصطناعي قوية لمساعدة الجميع على التعلم والإبداع باستخدام التكنولوجيا.",
        contact_me_title: "تواصل معي",
        contact_suggestion: "يمكنك اقتراح المزيد من الأفكار للقناة.",
        // This key now targets the span inside the button
        lang_toggle_text: "English"
    }
};

// Function to set the language of the page
const setLanguage = (lang) => {
    // This loop updates all elements with a data-key, including the new button's text span
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) { // Check if the key exists for the language
            element.textContent = translations[lang][key];
        }
    });

    // Update the page direction and language attribute
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
};

// Event listener for the toggle button
langToggle.addEventListener('click', () => {
    // Check current language and switch to the other one
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
});