const BASE_URL = 'http://localhost:8080/ords/sitetp3';

// Lire toutes les données d'une table
function getAll(table) {
    return fetch(`${BASE_URL}/${table}/`)
        .then(response => response.json())
        .then(data => data.items); // ORDS retourne toujours un tableau "items"
}

// Lire un enregistrement précis par son ID
function getById(table, id) {
    return fetch(`${BASE_URL}/${table}/${id}`)
        .then(response => response.json());
}

// POST - Créer un nouvel enregistrement
function create(table, data) {
    return fetch(`${BASE_URL}/${table}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

// PUT - Modifier un enregistrement
function update(table, id, data) {
    return fetch(`${BASE_URL}/${table}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

// DELETE - Supprimer un enregistrement
function remove(table, id) {
    return fetch(`${BASE_URL}/${table}/${id}`, {
        method: 'DELETE'
    }).then(response => response.ok);
}

// GET — Lire tous les enregistrements de la table Fabricant
function getFabricants() {
    return getAll('fabricant');
}

// Obtenir les jeux d'un fabricant spécifique
async function getJeuxParFabricant(nomFabricant) {
    try {
        // 1. Récupérer tous les fabricants
        const fabricants = await getAll('fabricant');

        // 2. Trouver l'ID du fabricant recherché (insensible à la casse)
        const fabricantTrouve = fabricants.find(f =>
            f.nom_fabricant.toLowerCase() === nomFabricant.toLowerCase()
        );

        if (!fabricantTrouve) {
            console.error(`Fabricant "${nomFabricant}" introuvable.`);
            return [];
        }

        // 3. Récupérer toutes les consoles
        const consoles = await getAll('console');

        // 4. Isoler les IDs des consoles qui appartiennent à ce fabricant
        const idConsoles = consoles
            .filter(c => c.id_fabricant === fabricantTrouve.id_fabricant)
            .map(c => c.id_console);

        if (idConsoles.length === 0) {
            return []; // Le fabricant n'a aucune console enregistrée
        }

        // 5. Récupérer tous les jeux
        const jeux = await getAll('jeu');

        // 6. Filtrer pour ne garder que les jeux associés aux consoles trouvées
        const jeuxDuFabricant = jeux.filter(j => idConsoles.includes(j.id_console));

        return jeuxDuFabricant;

    } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
        return [];
    }
}

/**
 * Récupère les détails complets d'un exemplaire via les fonctions de base getById()
 * Utilise getById() au lieu de fetch() direct
 */
async function obtenirDetailsExemplaire(idExemplaire) {
    try {
        const exemplaire = await getById('exemplaire', idExemplaire);
        if (!exemplaire) throw new Error("Exemplaire introuvable");

        const jeu = await getById('jeu', exemplaire.id_jeu);
        if (!jeu) throw new Error("Jeu introuvable");

        const [consoleData, genreData] = await Promise.all([
            getById('console', jeu.id_console),
            getById('genre', jeu.id_genre)
        ]);

        if (!consoleData) throw new Error("Console introuvable");
        if (!genreData) throw new Error("Genre introuvable");

        return {
            titre: jeu.titre,
            nom_console: consoleData.nom_console,
            date_sortie_console: consoleData.date_sortie,
            nom_genre: genreData.nom_genre,
            annee_edition: jeu.annee_edition,
            prix_achat: exemplaire.prix_achat,
            stock: exemplaire.stock
        };
    } catch (erreur) {
        console.error("Erreur API (GET) :", erreur);
        return null;
    }
}

/**
 * Met à jour le stock d'un exemplaire via la fonction de base update()
 * Utilise update() au lieu de fetch() direct
 */
async function mettreAJourStock(idExemplaire, nouveauStock) {
    try {
        await update('exemplaire', idExemplaire, { stock: nouveauStock });
        return true; // Succès
    } catch (erreur) {
        console.error("Erreur API (PUT) :", erreur);
        return false; // Échec
    }
}