'use strict';

const corpsTableau = document.getElementById('tableJeux');
const formulaire = document.getElementById('formJeu');

function chargerJeux() {
    corpsTableau.innerHTML = '';

    getAll('jeu').then(jeux => {
        for (const jeu of jeux) {
            const ligne = document.createElement('tr');

            ligne.innerHTML = `
                <td>${jeu.id_jeu}</td>
                <td>${jeu.titre}</td>
                <td>${jeu.annee_edition}</td>
                <td>${jeu.id_console}</td>
                <td>${jeu.id_genre}</td>
                <td>
                    <button onclick="supprimerJeu(${jeu.id_jeu})">
                        Supprimer
                    </button>
                </td>
            `;

            corpsTableau.appendChild(ligne);
        }
    });
}

function supprimerJeu(id) {
    remove('jeu', id).then(() => {
        chargerJeux();
    });
}

formulaire.addEventListener('submit', event => {
    event.preventDefault();

    const nouveauJeu = {
        id_jeu: document.getElementById('id_jeu').value,
        titre: document.getElementById('titre').value,
        annee_edition: document.getElementById('annee_edition').value,
        id_console: document.getElementById('id_console').value,
        id_genre: document.getElementById('id_genre').value
    };

    create('jeu', nouveauJeu).then(() => {
        formulaire.reset();
        chargerJeux();
    });
});

chargerJeux();