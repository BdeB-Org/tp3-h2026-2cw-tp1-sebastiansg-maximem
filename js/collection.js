document.addEventListener('DOMContentLoaded', () => {
    chargerFabricantsCollection();
});

function chargerFabricantsCollection() {
    const conteneur = document.getElementById('fabricants-container');
    if (!conteneur) return;

    conteneur.innerHTML = 'Chargement des fabricants...';

    getFabricants().then(fabricants => {
        conteneur.innerHTML = '';

        const ordreDesire = {
            'sony': 1,
            'atari': 2,
            'sega': 3,
            'nintendo': 4
        };

        fabricants.sort((a, b) => {
            const indexA = ordreDesire[a.nom_fabricant.toLowerCase()] || 99;
            const indexB = ordreDesire[b.nom_fabricant.toLowerCase()] || 99;
            return indexA - indexB;
        });

        const nav = document.createElement('nav');
        nav.classList.add('nav_collection');

        const ul = document.createElement('ul');

        fabricants.forEach(fab => {
            const nomFabricant = fab.nom_fabricant;

            const li = document.createElement('li');

            const nom = document.createElement('b');
            nom.textContent = nomFabricant;

            const espace = document.createElement('div');
            espace.style.width = '100px';

            const btn = document.createElement('a');
            btn.textContent = 'Voir les jeux';
            btn.classList.add('btn');
            // Une seule page collection-jeux.html, le fabricant est passé en paramètre URL
            btn.href = `./collection-jeux.html?fabricant=${encodeURIComponent(nomFabricant)}`;

            li.appendChild(nom);
            li.appendChild(espace);
            li.appendChild(btn);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        conteneur.appendChild(nav);
    }).catch(err => {
        console.error("Erreur de chargement de la collection :", err);
        conteneur.innerHTML = '<p>Erreur lors du chargement des fabricants.</p>';
    });
}

function normaliserCle(texte) {
    return (texte || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function creerBlocAucunJeu() {
    const nav = document.createElement('nav');
    nav.classList.add('nav_collection');

    const ul = document.createElement('ul');
    const message = document.createElement('b');
    message.textContent = "Aucun jeu disponible pour l'instant";

    ul.appendChild(message);
    nav.appendChild(ul);

    return nav;
}

async function afficherCollection(nomFabricant) {
    const conteneur = document.getElementById('conteneur-jeux');
    if (!conteneur) return;

    conteneur.innerHTML = 'Chargement des jeux...';

    // Met à jour le titre de la page dynamiquement
    const titrePage = document.getElementById('titre-fabricant');
    if (titrePage) titrePage.textContent = `Collection - ${nomFabricant}`;

    try {
        const [jeux, exemplaires] = await Promise.all([
            getJeuxParFabricant(nomFabricant),
            getAll('exemplaire')
        ]);

        // Construit une Map : id_jeu → id_exemplaire
        const idExemplaireParJeu = new Map(
            (exemplaires || []).map(exemplaire => [
                Number(exemplaire.id_jeu),
                exemplaire.id_exemplaire
            ])
        );

        // Associe chaque jeu à son id_exemplaire (si disponible)
        const jeuxAvecExemplaire = (jeux || [])
            .map(jeu => ({
                ...jeu,
                id_exemplaire: idExemplaireParJeu.get(Number(jeu.id_jeu))
            }))
            .filter(jeu => Number.isInteger(Number(jeu.id_exemplaire)));

        conteneur.innerHTML = '';

        if (jeuxAvecExemplaire.length === 0) {
            conteneur.appendChild(creerBlocAucunJeu());
            return;
        }

        const nav = document.createElement('nav');
        nav.classList.add('nav_collection');

        const ul = document.createElement('ul');

        jeuxAvecExemplaire.forEach(jeu => {
            const li = document.createElement('li');

            const nom = document.createElement('b');
            nom.textContent = jeu.titre;

            const espace = document.createElement('div');
            espace.style.width = '100px';

            const btn = document.createElement('a');
            btn.textContent = "Plus d'informations";
            btn.classList.add('btn');
            // Une seule page collection-exemplaire.html
            // On passe l'id_exemplaire ET le fabricant pour le bouton "Page précédente"
            btn.href = `./collection-exemplaire.html?id_exemplaire=${encodeURIComponent(jeu.id_exemplaire)}&fabricant=${encodeURIComponent(nomFabricant)}`;

            li.appendChild(nom);
            li.appendChild(espace);
            li.appendChild(btn);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        conteneur.appendChild(nav);
    } catch (erreur) {
        console.error("Erreur d'affichage :", erreur);
        conteneur.innerHTML = `<p>Impossible de charger la collection.</p>`;
    }
}