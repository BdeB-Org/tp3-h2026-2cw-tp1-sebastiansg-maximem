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

        const pagesFabricants = {
            'sony': 'collection-playstation.html',
            'atari': 'collection-atari.html',
            'sega': 'collection-sega.html',
            'nintendo': 'collection-nintendo.html'
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
            const cleFabricant = nomFabricant.toLowerCase();
            const page = pagesFabricants[cleFabricant];
            if (!page) return;

            const li = document.createElement('li');

            const nom = document.createElement('b');
            nom.textContent = nomFabricant;

            const espace = document.createElement('div');
            espace.style.width = '100px';

            const btn = document.createElement('a');
            btn.textContent = 'Voir les jeux';
            btn.classList.add('btn');
            btn.href = `./${page}`;

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

const pagesJeuxParFabricant = {
    sony: {
        'fifa: road to world cup 98': 'collection-ps-fifa.html',
        'final fantasy vii': 'collection-ps-finalfantasy.html'
    },
    sega: {
        'sonic the hedgehog': 'collection-sega-sonic.html'
    },
    nintendo: {
        'super mario world': 'collection-nin-supermarioworld.html',
        'the legend of zelda: a link to the past': 'collection-nin-zelda.html',
        'street fighter ii': 'collection-nin-streetfighter.html',
        'pit-fighter': 'collection-nin-pitfighter.html'
    }
};

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

    try {
        const [jeux, exemplaires] = await Promise.all([
            getJeuxParFabricant(nomFabricant),
            getAll('exemplaire')
        ]);
        const idExemplaireParJeu = new Map(
            (exemplaires || []).map(exemplaire => [
                normaliserCle(exemplaire.id_jeu),
                exemplaire.id_exemplaire
            ])
        );
        const pagesDuFabricant = pagesJeuxParFabricant[normaliserCle(nomFabricant)] || {};
        const jeuxAvecPage = (jeux || [])
            .map(jeu => ({
                ...jeu,
                page: pagesDuFabricant[normaliserCle(jeu.titre)],
                id_exemplaire: idExemplaireParJeu.get(normaliserCle(jeu.id_jeu))
            }))
            .filter(jeu => Boolean(jeu.page) && Number.isInteger(Number(jeu.id_exemplaire)));

        conteneur.innerHTML = '';

        if (jeuxAvecPage.length === 0) {
            conteneur.appendChild(creerBlocAucunJeu());
            return;
        }

        const nav = document.createElement('nav');
        nav.classList.add('nav_collection');

        const ul = document.createElement('ul');

        jeuxAvecPage.forEach(jeu => {
            const li = document.createElement('li');

            const nom = document.createElement('b');
            nom.textContent = jeu.titre;

            const espace = document.createElement('div');
            espace.style.width = '100px';

            const btn = document.createElement('a');
            btn.textContent = "Plus d'informations";
            btn.classList.add('btn');
            btn.href = `./${jeu.page}?id_exemplaire=${encodeURIComponent(jeu.id_exemplaire)}`;

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
