// L'ID de l'exemplaire est transmis dans l'URL depuis la page collection
let idExemplaireActuel = null;
let stockActuel = 0;

function lireIdExemplaireDepuisURL() {
    const valeur = new URLSearchParams(window.location.search).get('id_exemplaire');
    const id = Number(valeur);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Fonction principale pour afficher les détails du jeu dans le HTML vide
 */
async function afficherDetails() {
    if (idExemplaireActuel === null) {
        document.getElementById('info-titre').textContent = "Jeu introuvable";
        document.getElementById('info-console').textContent = "-";
        document.getElementById('info-genre').textContent = "-";
        document.getElementById('info-annee-sortie').textContent = "-";
        document.getElementById('info-prix').textContent = "-";
        document.getElementById('info-stock').textContent = "0";
        verifierBoutonAcheter();
        return;
    }

    // Appel à la fonction de api.js
    const details = await obtenirDetailsExemplaire(idExemplaireActuel);

    if (details) {
        // Injection des données dans les balises <span> vides
        document.getElementById('info-titre').textContent = details.titre;
        const dateSortieConsole = Number(details.date_sortie_console);
        document.getElementById('info-console').textContent = Number.isInteger(dateSortieConsole)
            ? `${details.nom_console} (${dateSortieConsole})`
            : details.nom_console;
        document.getElementById('info-genre').textContent = details.nom_genre;
        document.getElementById('info-annee-sortie').textContent = details.annee_edition;
        document.getElementById('info-prix').textContent = details.prix_achat.toFixed(2);

        // Initialisation du stock
        stockActuel = details.stock;
        document.getElementById('info-stock').textContent = stockActuel;

        // Vérification initiale du bouton Acheter
        verifierBoutonAcheter();
    } else {
        console.error("Impossible de charger les détails dans l'interface.");
    }
}

/**
 * Désactive le bouton Acheter si le stock tombe à 0
 */
function verifierBoutonAcheter() {
    const btnAcheter = document.getElementById('btn-acheter');
    if (stockActuel <= 0) {
        btnAcheter.disabled = true;
        btnAcheter.style.opacity = "0.5";
        btnAcheter.style.cursor = "not-allowed";
    } else {
        btnAcheter.disabled = false;
        btnAcheter.style.opacity = "1";
        btnAcheter.style.cursor = "pointer";
    }
}

// ÉCOUTEURS D'ÉVÉNEMENTS

document.addEventListener('DOMContentLoaded', () => {
    idExemplaireActuel = lireIdExemplaireDepuisURL();

    // 1. On lance l'affichage des détails dès que la page est chargée
    afficherDetails();

    // 2. Gestion du clic sur "Acheter"
    document.getElementById('btn-acheter').addEventListener('click', async (e) => {
        e.preventDefault();
        if (stockActuel > 0 && idExemplaireActuel !== null) {
            const nouveauStock = stockActuel - 1;
            // On attend la confirmation de api.js avant de changer l'affichage
            const succes = await mettreAJourStock(idExemplaireActuel, nouveauStock);

            if (succes) {
                stockActuel = nouveauStock;
                document.getElementById('info-stock').textContent = stockActuel;
                verifierBoutonAcheter();
            }
        }
    });

    // 3. Gestion du clic sur "Vendre"
    document.getElementById('btn-vendre').addEventListener('click', async (e) => {
        e.preventDefault();
        if (idExemplaireActuel === null) return;
        const nouveauStock = stockActuel + 1;
        // On attend la confirmation de api.js avant de changer l'affichage
        const succes = await mettreAJourStock(idExemplaireActuel, nouveauStock);

        if (succes) {
            stockActuel = nouveauStock;
            document.getElementById('info-stock').textContent = stockActuel;
            verifierBoutonAcheter(); // Réactive le bouton Acheter au besoin
        }
    });
});
