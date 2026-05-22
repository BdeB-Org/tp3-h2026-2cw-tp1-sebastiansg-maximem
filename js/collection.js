// PAGE : collection.html — liste des fabricants

document.addEventListener('DOMContentLoaded', () => {
    // Uniquement si on est sur la page collection.html (le conteneur fabricants existe)
    if (document.getElementById('fabricants-container')) {
        chargerFabricantsCollection();

        // Branchement du bouton Ajouter un fabricant
        const btnAjouter = document.getElementById('btn-ajouter-fabricant');
        if (btnAjouter) {
            btnAjouter.addEventListener('click', () => {
                const nom = document.getElementById('input-nom-fabricant').value.trim();
                soumettreNouveauFabricant(nom);
            });
        }
    }
});

/**
 * Charge et affiche la liste des fabricants dans collection.html
 */
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

/**
 * Valide et envoie un nouveau fabricant via POST, puis rafraîchit la liste
 */
async function soumettreNouveauFabricant(nomFabricant) {
    const messageEl = document.getElementById('message-fabricant');

    // Validation de base
    if (!nomFabricant) {
        afficherMessage(messageEl, 'Veuillez entrer un nom de fabricant.', false);
        return;
    }

    try {
        // Calculer le prochain ID disponible
        const fabricants = await getAll('fabricant');

        // Vérifier si le nom existe déjà (insensible à la casse)
        const dejaExiste = fabricants.some(f =>
            f.nom_fabricant.toLowerCase() === nomFabricant.toLowerCase()
        );
        if (dejaExiste) {
            afficherMessage(messageEl, `Le fabricant "${nomFabricant}" existe déjà.`, false);
            return;
        }

        const maxId = fabricants.reduce((max, f) => Math.max(max, Number(f.id_fabricant)), 0);
        const nouvelId = maxId + 1;

        // Appel POST via api.js
        await create('fabricant', {
            id_fabricant: nouvelId,
            nom_fabricant: nomFabricant
        });

        // Réinitialiser le champ et afficher un message de succès
        document.getElementById('input-nom-fabricant').value = '';
        afficherMessage(messageEl, `Fabricant "${nomFabricant}" ajouté avec succès !`, true);

        // Rafraîchir la liste
        chargerFabricantsCollection();

    } catch (erreur) {
        console.error("Erreur lors de l'ajout du fabricant :", erreur);
        afficherMessage(messageEl, "Erreur lors de l'ajout. Veuillez réessayer.", false);
    }
}


// PAGE : collection-jeux.html — liste des jeux d'un fabricant

/**
 * Charge les listes déroulantes (consoles du fabricant, genres) dans le formulaire et branche le bouton d'ajout
 */
async function chargerFormulairJeux(nomFabricant) {
    try {
        // Récupérer les fabricants pour trouver l'ID du fabricant courant
        const fabricants = await getAll('fabricant');
        const fabricantTrouve = fabricants.find(f =>
            f.nom_fabricant.toLowerCase() === nomFabricant.toLowerCase()
        );

        if (!fabricantTrouve) return;

        // Remplir la liste déroulante des consoles (seulement celles du fabricant)
        const toutesLesConsoles = await getAll('console');
        const consolesduFabricant = toutesLesConsoles.filter(
            c => Number(c.id_fabricant) === Number(fabricantTrouve.id_fabricant)
        );

        const selectConsole = document.getElementById('select-console-jeu');
        consolesduFabricant.forEach(console => {
            const option = document.createElement('option');
            option.value = console.id_console;
            option.textContent = console.nom_console;
            selectConsole.appendChild(option);
        });

        // Remplir la liste déroulante des genres
        const genres = await getAll('genre');
        const selectGenre = document.getElementById('select-genre-jeu');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id_genre;
            option.textContent = genre.nom_genre;
            selectGenre.appendChild(option);
        });

        // Brancher le bouton Ajouter
        const btnAjouter = document.getElementById('btn-ajouter-jeu');
        if (btnAjouter) {
            btnAjouter.addEventListener('click', () => {
                soumettreNouveauJeu(nomFabricant);
            });
        }

    } catch (erreur) {
        console.error("Erreur lors du chargement du formulaire :", erreur);
    }
}

/**
 * Valide et envoie un nouveau jeu (+ son exemplaire) via POST, puis rafraîchit la liste
 */
async function soumettreNouveauJeu(nomFabricant) {
    const messageEl = document.getElementById('message-jeu');

    const titre = document.getElementById('input-titre-jeu').value.trim();
    const annee = Number(document.getElementById('input-annee-jeu').value);
    const idConsole = Number(document.getElementById('select-console-jeu').value);
    const idGenre = Number(document.getElementById('select-genre-jeu').value);
    const stock = Number(document.getElementById('input-stock-jeu').value);
    const prix = parseFloat(document.getElementById('input-prix-jeu').value);

    // Validation
    if (!titre) {
        afficherMessage(messageEl, 'Veuillez entrer un titre.', false);
        return;
    }
    if (!annee || annee < 1970 || annee > 2026) {
        afficherMessage(messageEl, 'Veuillez entrer une année valide.', false);
        return;
    }
    if (!idConsole) {
        afficherMessage(messageEl, 'Veuillez choisir une console.', false);
        return;
    }
    if (!idGenre) {
        afficherMessage(messageEl, 'Veuillez choisir un genre.', false);
        return;
    }
    if (isNaN(stock) || stock < 0) {
        afficherMessage(messageEl, 'Veuillez entrer un stock valide (≥ 0).', false);
        return;
    }
    if (isNaN(prix) || prix < 0) {
        afficherMessage(messageEl, 'Veuillez entrer un prix valide.', false);
        return;
    }

    try {
        // Calculer le prochain ID de jeu
        const jeux = await getAll('jeu');
        const maxIdJeu = jeux.reduce((max, j) => Math.max(max, Number(j.id_jeu)), 0);
        const nouvelIdJeu = maxIdJeu + 1;

        // POST du jeu
        await create('jeu', {
            id_jeu: nouvelIdJeu,
            titre: titre,
            annee_edition: annee,
            id_console: idConsole,
            id_genre: idGenre
        });

        // Calculer le prochain ID d'exemplaire
        const exemplaires = await getAll('exemplaire');
        const maxIdEx = exemplaires.reduce((max, e) => Math.max(max, Number(e.id_exemplaire)), 0);
        const nouvelIdEx = maxIdEx + 1;

        // POST de l'exemplaire associé
        await create('exemplaire', {
            id_exemplaire: nouvelIdEx,
            stock: stock,
            prix_achat: prix,
            id_jeu: nouvelIdJeu
        });

        // Réinitialiser le formulaire
        document.getElementById('input-titre-jeu').value = '';
        document.getElementById('input-annee-jeu').value = '';
        document.getElementById('select-console-jeu').selectedIndex = 0;
        document.getElementById('select-genre-jeu').selectedIndex = 0;
        document.getElementById('input-stock-jeu').value = '';
        document.getElementById('input-prix-jeu').value = '';

        afficherMessage(messageEl, `Jeu "${titre}" ajouté avec succès !`, true);

        // Rafraîchir la liste des jeux
        afficherCollection(nomFabricant);

    } catch (erreur) {
        console.error("Erreur lors de l'ajout du jeu :", erreur);
        afficherMessage(messageEl, "Erreur lors de l'ajout. Veuillez réessayer.", false);
    }
}


// FONCTIONS PARTAGÉES

/**
 * Affiche un message de succès ou d'erreur sous le formulaire
 */
function afficherMessage(element, texte, succes) {
    if (!element) return;
    element.textContent = texte;
    element.className = 'message-retour ' + (succes ? 'message-succes' : 'message-erreur');

    // Effacer le message après 4 secondes
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message-retour';
    }, 4000);
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

/**
 * Charge et affiche la liste des jeux d'un fabricant dans collection-jeux.html
 */
async function afficherCollection(nomFabricant) {
    const conteneur = document.getElementById('jeux-container');
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

            const btnInfo = document.createElement('a');
            btnInfo.textContent = "Plus d'informations";
            btnInfo.classList.add('btn');
            btnInfo.href = `./collection-exemplaire.html?id_exemplaire=${encodeURIComponent(jeu.id_exemplaire)}&fabricant=${encodeURIComponent(nomFabricant)}`;

            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = 'Supprimer';
            btnSupprimer.classList.add('btn', 'btn-supprimer');
            btnSupprimer.addEventListener('click', () => {
                supprimerJeu(jeu.id_jeu, jeu.id_exemplaire, jeu.titre, nomFabricant);
            });

            li.appendChild(nom);
            li.appendChild(espace);
            li.appendChild(btnInfo);
            li.appendChild(btnSupprimer);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        conteneur.appendChild(nav);
    } catch (erreur) {
        console.error("Erreur d'affichage :", erreur);
        conteneur.innerHTML = `<p>Impossible de charger la collection.</p>`;
    }
}

/**
 * Supprime un jeu et son exemplaire associé de la base de données, puis rafraîchit la liste sans recharger la page.
 *
 * L'ordre est important : l'exemplaire (clé étrangère) doit être supprimé EN PREMIER, avant le jeu parent.
 */
async function supprimerJeu(idJeu, idExemplaire, titreJeu, nomFabricant) {
    // Demande de confirmation avant de supprimer
    const confirmation = window.confirm(
        `Voulez-vous vraiment supprimer "${titreJeu}" ?\n\nCette action est irréversible.`
    );
    if (!confirmation) return;

    try {
        // 1. Supprimer l'exemplaire en premier (contrainte de clé étrangère)
        const exemplaireSupp = await remove('exemplaire', idExemplaire);
        if (!exemplaireSupp) throw new Error("Échec de la suppression de l'exemplaire.");

        // 2. Supprimer le jeu
        const jeuSupp = await remove('jeu', idJeu);
        if (!jeuSupp) throw new Error("Échec de la suppression du jeu.");

        // 3. Rafraîchir la liste
        afficherCollection(nomFabricant);

    } catch (erreur) {
        console.error("Erreur lors de la suppression :", erreur);
        alert("Une erreur est survenue lors de la suppression. Veuillez réessayer.");
    }
}