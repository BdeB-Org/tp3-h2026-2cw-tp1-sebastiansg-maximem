document.addEventListener('DOMContentLoaded', () => {
    chargerFabricants();
});

/**
 * Charge et affiche les fabricants de consoles.
 * Récupère les données des fabricants depuis la base de données via getFabricants(), les trie selon un ordre personnalisé (Sony, Atari, Sega, Nintendo), puis les affiche dans le conteneur avec leurs logos et noms respectifs.
 * Chaque fabricant a un logo et une largeur d'affichage spécifiques.
 * En cas d'erreur, affiche un message d'erreur dans le conteneur.
 */
function chargerFabricants() {
    const conteneur = document.querySelector('.logo_consoles1');
    conteneur.innerHTML = 'Chargement des fabricants...';

    getFabricants().then(fabricants => {
        conteneur.innerHTML = '';

        // 1. On définit l'ordre d'affichage désiré (en minuscules)
        const ordreDesire = {
            'sony': 1, // Sony correspond à PlayStation
            'atari': 2,
            'sega': 3,
            'nintendo': 4
        }; // Les fabricants non listés auront une valeur de 99 (affichés à la fin)

        // 2. On trie le tableau reçu de la BD en fonction de notre ordre défini
        fabricants.sort((a, b) => {
            const indexA = ordreDesire[a.nom_fabricant.toLowerCase()] || 99;
            const indexB = ordreDesire[b.nom_fabricant.toLowerCase()] || 99;
            return indexA - indexB;
        });

        // 3. On boucle sur le tableau maintenant trié
        fabricants.forEach(fab => {
            let srcImage = '';
            let largeur = '200px';
            let nomAffiche = fab.nom_fabricant; // Par défaut, on garde le nom de la BD

            switch (fab.nom_fabricant.toLowerCase()) {
                case 'sony':
                    srcImage = 'Logo Playstation.png';
                    nomAffiche = 'Sony (PlayStation)'; // On remplace "Sony" par "Sony (PlayStation)" pour l'affichage
                    break;
                case 'atari':
                    srcImage = 'Logo Atari.png';
                    largeur = '112px';
                    break;
                case 'sega':
                    srcImage = 'Logo SEGA.png';
                    break;
                case 'nintendo':
                    srcImage = 'Logo Nintendo.png';
                    largeur = '250px';
                    break;
                default:
                    srcImage = 'defaultv2.png';
                    largeur = '150px';
            }

            const div = document.createElement('div');
            div.classList.add('logo_consoles2');

            // On utilise nomAffiche pour le texte
            div.innerHTML = `
                <img src="../images/${srcImage}" alt="Logo ${nomAffiche}" width="${largeur}">
                <p>${nomAffiche}</p>
            `;

            conteneur.appendChild(div);
        });
    }).catch(err => {
        console.error("Erreur de chargement :", err);
        conteneur.innerHTML = '<p>Erreur lors du chargement des fabricants.</p>';
    });
}