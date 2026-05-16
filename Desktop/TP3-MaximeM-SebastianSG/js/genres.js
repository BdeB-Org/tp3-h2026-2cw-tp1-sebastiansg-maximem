'use strict';

const corpsTableau = document.getElementById('tableGenres');
const formulaire = document.getElementById('formGenre');

function chargerGenres() {
    corpsTableau.innerHTML = '';

    getAll('genre').then(genres => {
        for (const genre of genres) {
            const ligne = document.createElement('tr');

            ligne.innerHTML = `
                <td>${genre.id_genre}</td>
                <td>${genre.nom_genre}</td>
                <td>
                    <button onclick="supprimerGenre(${genre.id_genre})">
                        Supprimer
                    </button>
                </td>
            `;

            corpsTableau.appendChild(ligne);
        }
    });
}

function supprimerGenre(id) {
    remove('genre', id).then(() => {
        chargerGenres();
    });
}

formulaire.addEventListener('submit', event => {
    event.preventDefault();

    const nouveauGenre = {
        id_genre: document.getElementById('id_genre').value,
        nom_genre: document.getElementById('nom_genre').value
    };

    create('genre', nouveauGenre).then(() => {
        formulaire.reset();
        chargerGenres();
    });
});

chargerGenres();