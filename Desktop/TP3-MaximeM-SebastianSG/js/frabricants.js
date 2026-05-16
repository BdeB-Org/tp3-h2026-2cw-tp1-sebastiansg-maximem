'use strict';

const corpsTableau = document.getElementById('tableFabricants');
const formulaire = document.getElementById('formFabricant');

function chargerFabricants() {
    corpsTableau.innerHTML = '';

    getAll('fabricant').then(fabricants => {
        for (const fabricant of fabricants) {
            const ligne = document.createElement('tr');

            ligne.innerHTML = `
                <td>${fabricant.id_fabricant}</td>
                <td>${fabricant.nom_fabricant}</td>
                <td>${fabricant.pays_origine}</td>
                <td>
                    <button onclick="supprimerFabricant(${fabricant.id_fabricant})">
                        Supprimer
                    </button>
                </td>
            `;

            corpsTableau.appendChild(ligne);
        }
    });
}

function supprimerFabricant(id) {
    remove('fabricant', id).then(() => {
        chargerFabricants();
    });
}

formulaire.addEventListener('submit', event => {
    event.preventDefault();

    const nouveauFabricant = {
        id_fabricant: document.getElementById('id_fabricant').value,
        nom_fabricant: document.getElementById('nom_fabricant').value,
        pays_origine: document.getElementById('pays_origine').value
    };

    create('fabricant', nouveauFabricant).then(() => {
        formulaire.reset();
        chargerFabricants();
    });
});

chargerFabricants();