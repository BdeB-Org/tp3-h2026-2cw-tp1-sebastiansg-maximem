'use strict';

const corpsTableau = document.getElementById('tableConsoles');
const formulaire = document.getElementById('formConsole');

function chargerConsoles() {
    corpsTableau.innerHTML = '';

    getAll('console').then(consoles => {
        for (const consoleJeu of consoles) {
            const ligne = document.createElement('tr');

            ligne.innerHTML = `
                <td>${consoleJeu.id_console}</td>
                <td>${consoleJeu.nom_console}</td>
                <td>${consoleJeu.date_sortie}</td>
                <td>${consoleJeu.id_fabricant}</td>
                <td>
                    <button onclick="supprimerConsole(${consoleJeu.id_console})">
                        Supprimer
                    </button>
                </td>
            `;

            corpsTableau.appendChild(ligne);
        }
    });
}

function supprimerConsole(id) {
    remove('console', id).then(() => {
        chargerConsoles();
    });
}

formulaire.addEventListener('submit', event => {
    event.preventDefault();

    const nouvelleConsole = {
        id_console: document.getElementById('id_console').value,
        nom_console: document.getElementById('nom_console').value,
        date_sortie: document.getElementById('date_sortie').value,
        id_fabricant: document.getElementById('id_fabricant').value
    };

    create('console', nouvelleConsole).then(() => {
        formulaire.reset();
        chargerConsoles();
    });
});

chargerConsoles();