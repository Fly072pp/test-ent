async function fetchUsers() {
    try {
        const response = await fetch('users.json');
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return [];
    }
}

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorElement = document.getElementById('error');

    const users = await fetchUsers();

    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        localStorage.setItem('role', role);
        window.location.href = 'dashboard.html';
    } else {
        errorElement.textContent = "Identifiants incorrects";
    }
});

// Récupérer les éléments du DOM
const form = document.querySelector('form');
const messageInput = document.querySelector('textarea');
const recipientSelect = document.querySelector('#recipient');
const chatContent = document.querySelector('.chat-content');

// Charge les messages depuis le localStorage au chargement de la page
window.addEventListener('load', () => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const recipient = recipientSelect.value; // Récupère le destinataire sélectionné
    filterAndDisplayMessages(storedMessages, recipient);
});

// Gestion de l'envoi de message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    const messageContent = messageInput.value.trim(); // Récupérer le contenu du message
    const recipient = recipientSelect.value; // Récupérer le destinataire sélectionné

    // Vérifier que le message n'est pas vide
    if (messageContent === "") {
        alert("Veuillez entrer un message !");
        return;
    }

    // Créer un nouvel objet message
    const newMessage = {
        content: messageContent,
        recipient: recipient,
        createdAt: new Date().toISOString() // Date de création du message
    };

    // Récupérer les messages existants depuis le localStorage
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    // Ajouter le nouveau message à la liste
    messages.push(newMessage);

    // Sauvegarder les messages dans le localStorage
    localStorage.setItem('messages', JSON.stringify(messages));

    // Filtrer et afficher les messages pour le destinataire sélectionné
    filterAndDisplayMessages(messages, recipient);

    // Effacer le champ de saisie après l'envoi
    messageInput.value = '';
});

// Fonction pour afficher un message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    messageElement.innerHTML = `
        <p><strong>${message.recipient}:</strong> ${message.content}</p>
        <small>${new Date(message.createdAt).toLocaleString()}</small>
    `;
    
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Fonction pour filtrer et afficher les messages pour le destinataire sélectionné
function filterAndDisplayMessages(messages, recipient) {
    // Vider la zone de chat avant de rajouter les messages filtrés
    chatContent.innerHTML = '';

    // Filtrer les messages selon le destinataire sélectionné
    const filteredMessages = messages.filter(message => message.recipient === recipient);

    // Afficher les messages filtrés
    filteredMessages.forEach(displayMessage);
}

const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const monthYear = document.getElementById('monthYear');
const calendarDays = document.getElementById('calendarDays');
const eventDateInput = document.getElementById('eventDate');
const eventDescriptionInput = document.getElementById('eventDescription');
const addEventBtn = document.getElementById('addEventBtn');
const eventsList = document.getElementById('eventsList');

let currentDate = new Date();
let currentMonth = currentDate.getMonth(); // Mois actuel (0-11)
let currentYear = currentDate.getFullYear(); // Année actuelle

// Charger et afficher les événements stockés dans le localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    eventsList.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.innerHTML = `
            <p><strong>${event.date}</strong>: ${event.description}</p>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Afficher le calendrier pour le mois et l'année sélectionnés
function renderCalendar() {
    // Afficher le mois et l'année
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentYear}`;
    
    // Effacer les jours précédents
    calendarDays.innerHTML = '';

    // Calculer le premier jour du mois
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 - Dimanche, 1 - Lundi, ...
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate(); // Dernier jour du mois

    // Ajouter les jours du mois au calendrier
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('calendar-day');
        
        // Ajouter un événement sur clic
        dayCell.addEventListener('click', () => {
            eventDateInput.value = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        });

        calendarDays.appendChild(dayCell);
    }
}

// Ajouter un événement au calendrier et au localStorage
addEventBtn.addEventListener('click', () => {
    const eventDate = eventDateInput.value;
    const eventDescription = eventDescriptionInput.value.trim();

    if (!eventDate || !eventDescription) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Récupérer les événements existants
    const events = JSON.parse(localStorage.getItem('events')) || [];
    
    // Ajouter le nouvel événement
    events.push({ date: eventDate, description: eventDescription });

    // Sauvegarder dans le localStorage
    localStorage.setItem('events', JSON.stringify(events));

    // Recharger les événements
    loadEvents();

    // Réinitialiser le formulaire
    eventDateInput.value = '';
    eventDescriptionInput.value = '';
});

// Navigation entre les mois
prevMonthBtn.addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    renderCalendar();
});

// Initialiser le calendrier
renderCalendar();
loadEvents();

