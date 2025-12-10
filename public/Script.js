// Login form (localStorage-based)
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('email');

    // Prefill email from last registered user if available
    const storedForLogin = localStorage.getItem('mysticUser');
    if (storedForLogin && loginEmailInput) {
        try {
            const u = JSON.parse(storedForLogin);
            if (u.email) loginEmailInput.value = u.email;
        } catch (e) {
            // ignore bad data
        }
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = loginEmailInput.value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        const stored = localStorage.getItem('mysticUser');
        if (!stored) {
            alert('No user found. Please register first.');
            return;
        }

        try {
            const user = JSON.parse(stored);
            if (user.email === email && user.password === password) {
                localStorage.setItem('mysticLoggedIn', 'true');
                alert('Login successful! Welcome back, ' + (user.name || 'traveller') + '.');
                window.location.href = 'UserHome.html';
            } else {
                alert('Invalid email or password.');
            }
        } catch (e) {
            alert('Saved user data is corrupted. Please register again.');
        }
    });
}
// Traveller guide interaction + dynamic services

document.addEventListener('DOMContentLoaded', function () {
    const exploreButton = document.getElementById('exploreButton');
    const travellerSection = document.getElementById('traveller-guide');
    const chatWindow = document.getElementById('chatWindow');
    const travellerInput = document.getElementById('travellerInput');
    const travellerSend = document.getElementById('travellerSend');
    const questionPills = document.querySelectorAll('.question-pill');

    // Services page elements
    const servicesDynamic = document.getElementById('servicesDynamic');
    const staticServicesList = document.getElementById('staticServicesList');
    const serviceDetailTitle = document.getElementById('serviceDetailTitle');
    const serviceDetailText = document.getElementById('serviceDetailText');
    const serviceEmailLink = document.getElementById('serviceEmailLink');
    const serviceWhatsAppLink = document.getElementById('serviceWhatsAppLink');

    // User home page elements
    const userWelcomeText = document.getElementById('userWelcomeText');
    const userDetailsText = document.getElementById('userDetailsText');

    // User reviews elements (UserHome page)
    const userPlaceSelect = document.getElementById('userPlaceSelect');
    const userReviewText = document.getElementById('userReviewText');
    const userRatingSelect = document.getElementById('userRatingSelect');
    const userSaveReview = document.getElementById('userSaveReview');
    const userReviewsList = document.getElementById('userReviewsList');

    if (exploreButton && travellerSection) {
        exploreButton.addEventListener('click', function () {
            travellerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function appendBubble(text, type) {
        if (!chatWindow) return;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + type;
        bubble.textContent = text;
        chatWindow.appendChild(bubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function guideReply(userText) {
        const lower = userText.toLowerCase();
        let reply = "Every journey on the Mystic Path is unique. Tell me what kind of experience you seek — peace, adventure, or spirituality?";

        if (lower.includes('time') || lower.includes('best time')) {
            reply = "Early winter and post-monsoon are perfect – cool weather, clear skies, and comfortable walks on the pathways.";
        } else if (lower.includes('family') || lower.includes('kids')) {
            reply = "Yes, most of our spots are family friendly. I recommend calmer places like lakes and temples for children and elders.";
        } else if (lower.includes('hidden') || lower.includes('secret')) {
            reply = "There are many hidden corners – small village shrines, silent ghats, and forest trails. Ask me about any specific place and I will guide you.";
        } else if (lower.includes('devdari')) {
            reply = "DevDari is powerful and peaceful at the same time. Go early morning to feel the mist and avoid the crowd.";
        } else if (lower.includes('sarnath')) {
            reply = "In Sarnath, spend time just sitting near the stupa. The silence there teaches more than any guidebook.";
        }

        setTimeout(function () {
            appendBubble(reply, 'guide');
        }, 400);
    }

    function handleSend(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        appendBubble(trimmed, 'user');
        guideReply(trimmed);
    }

    if (travellerSend && travellerInput) {
        travellerSend.addEventListener('click', function () {
            handleSend(travellerInput.value);
            travellerInput.value = '';
        });

        travellerInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend(travellerInput.value);
                travellerInput.value = '';
            }
        });
    }

    if (questionPills.length && travellerInput) {
        questionPills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                const q = pill.getAttribute('data-question') || pill.textContent;
                handleSend(q);
            });
        });
    }

    // Load services from backend if we are on the Services page
    if (servicesDynamic) {
        (async function loadServices() {
            try {
                const res = await fetch('/api/services');
                if (!res.ok) return; // keep static list
                const services = await res.json();
                if (!Array.isArray(services) || services.length === 0) return;

                // Hide static hardcoded list if backend data exists
                if (staticServicesList) {
                    staticServicesList.style.display = 'none';
                }

                const list = document.createElement('ul');
                services.forEach(function (svc) {
                    const li = document.createElement('li');
                    const name = svc.name || 'Service';
                    const desc = svc.description || '';
                    li.innerHTML = '<strong>' + name + '</strong>' + (desc ? ' – ' + desc : '');
                    li.dataset.serviceName = name;
                    list.appendChild(li);
                });
                servicesDynamic.appendChild(list);
            } catch (e) {
                // On error, just fall back to static list silently
            }
        })();
    }

    // Make services clickable: update detail panel and enquiry links (static + dynamic)
    function getServiceDescription(name) {
        switch (name) {
            case 'Customized Tour Packages':
                return 'Tailor-made itineraries designed around your time, budget, and spiritual or adventure preferences across our mystic destinations.';
            case 'Guided Mystical Adventures':
                return 'Local guides lead you through temples, waterfalls, lakes and ancient routes with stories, rituals and hidden legends.';
            case 'Accommodation Bookings':
                return 'Comfortable stays near mystical spots, from homestays to hotels, chosen for safety, cleanliness and local charm.';
            case 'Transportation Arrangements':
                return 'Safe, reliable cabs and local transport to connect all destinations in your itinerary without hassle.';
            case 'Hotels, Wages':
                return 'Transparent hotel bookings and fair wages for local guides and support staff, keeping tourism ethical and sustainable.';
            case '24X7 Customer Support':
                return 'Round-the-clock assistance before and during your trip for emergencies, changes or help with local information.';
            default:
                return 'Tap this service to tell us what you need and we will guide you with options and next steps.';
        }
    }

    function bindServiceClickHandlers(container) {
        if (!container) return;
        container.addEventListener('click', function (e) {
            const target = e.target.closest('li');
            if (!target) return;
            const name = target.dataset.serviceName || target.textContent.trim();
            if (!name || !serviceDetailTitle || !serviceDetailText) return;

            // Update detail title & text
            serviceDetailTitle.textContent = name;
            serviceDetailText.textContent = getServiceDescription(name);

            // Update enquiry links to include service name
            const encodedName = encodeURIComponent(name);
            const mailHref = 'mailto:mysticpathways2@gmail.com?subject=' + encodedName + '%20enquiry';
            const whatsappHref = 'https://wa.me/911234567890?text=' + encodedName + '%20service%20enquiry';

            if (serviceEmailLink) {
                serviceEmailLink.href = mailHref;
            }
            if (serviceWhatsAppLink) {
                serviceWhatsAppLink.href = whatsappHref;
            }

            // Scroll the detail card into view for the user
            if (serviceDetailTitle.scrollIntoView) {
                serviceDetailTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    bindServiceClickHandlers(staticServicesList);
    bindServiceClickHandlers(servicesDynamic);

    // Populate user info on UserHome page
    if (userWelcomeText && userDetailsText) {
        const stored = localStorage.getItem('mysticUser');
        const loggedIn = localStorage.getItem('mysticLoggedIn') === 'true';

        if (!stored || !loggedIn) {
            // If no user saved, send them back to login
            window.location.href = 'Login.html';
            return;
        }

        try {
            const user = JSON.parse(stored);
            const name = user.name || 'traveller';
            userWelcomeText.textContent = 'Welcome back, ' + name + '.';

            const bits = [];
            if (user.email) bits.push('Email: ' + user.email);
            if (user.contact) bits.push('Contact: ' + user.contact);
            if (user.whatsapp) bits.push('WhatsApp: ' + user.whatsapp);
            userDetailsText.textContent = bits.join('  |  ');

            // Local helper to load and display this user's reviews
            function loadUserReviews() {
                if (!userReviewsList) return;
                userReviewsList.innerHTML = '';
                const raw = localStorage.getItem('mysticUserReviews');
                if (!raw) return;
                let all = [];
                try {
                    all = JSON.parse(raw);
                } catch (e) {
                    return;
                }
                const mine = all.filter(function (r) { return r.email === user.email; });
                if (!mine.length) {
                    userReviewsList.textContent = 'No reviews saved yet.';
                    return;
                }

                mine.forEach(function (r) {
                    const item = document.createElement('div');
                    item.className = 'review';
                    const when = r.date ? new Date(r.date).toLocaleString() : '';
                    item.innerHTML = '<p><strong>' + r.place + '</strong>' + (r.rating ? ' – Rating: ' + r.rating + '/5' : '') + '</p>' +
                                    '<p>' + (r.text || '') + '</p>' +
                                    (when ? '<p style="font-size: 0.8rem; opacity: 0.8;">' + when + '</p>' : '');
                    userReviewsList.appendChild(item);
                });
            }

            // Setup save handler
            if (userSaveReview && userPlaceSelect && userReviewText && userRatingSelect) {
                userSaveReview.addEventListener('click', function () {
                    const place = userPlaceSelect.value;
                    const text = userReviewText.value.trim();
                    const rating = userRatingSelect.value;

                    if (!place) {
                        alert('Please select a place you visited.');
                        return;
                    }
                    if (!text) {
                        alert('Please write a short review or feedback.');
                        return;
                    }

                    const raw = localStorage.getItem('mysticUserReviews');
                    let all = [];
                    if (raw) {
                        try { all = JSON.parse(raw) || []; } catch (e) { all = []; }
                    }

                    all.push({
                        email: user.email,
                        place: place,
                        text: text,
                        rating: rating,
                        date: new Date().toISOString()
                    });

                    localStorage.setItem('mysticUserReviews', JSON.stringify(all));
                    userReviewText.value = '';
                    userRatingSelect.value = '';
                    userPlaceSelect.value = '';
                    loadUserReviews();
                    alert('Your feedback has been saved on this PC.');
                });
            }

            // Initial load of this user's reviews
            loadUserReviews();
        } catch (e) {
            window.location.href = 'Login.html';
        }
    }
});
// Registration form (localStorage-based)
if (document.getElementById('registrationForm')) {
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const password = document.getElementById('password').value;

        if (!name || !email || !contact || !whatsapp || !password) {
            alert('Please fill in all fields.');
            return;
        }

        const user = { name, email, contact, whatsapp, password };
        localStorage.setItem('mysticUser', JSON.stringify(user));
        localStorage.setItem('mysticLoggedIn', 'true');
        alert('Registration successful! You are now logged in locally on this PC.');
    });
}
