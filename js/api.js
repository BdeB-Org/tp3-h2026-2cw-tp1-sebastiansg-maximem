// js/api.js

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

// DELETE - Supprimer un enregistrement (DELETE)
function remove(table, id) {
    return fetch(`${BASE_URL}/${table}/${id}`, {
        method: 'DELETE'
    }).then(response => response.ok);
}

// GET — Lire tous les enregistrements de la table Fabricant
function getFabricants() {
    return fetch(`${BASE_URL}/fabricant/`)
        .then(response => response.json()) // Convertit la réponse en JS
        .then(data => data.items); // Retourne data.items comme exigé par ORDS
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

// ── Raccourcis optionnels ──────────────────────────────────────────────────
function getJeuxSony() {
    return getJeuxParFabricant('Sony');
}

function getJeuxAtari() {
    return getJeuxParFabricant('Atari');
}

function getJeuxSega() {
    return getJeuxParFabricant('Sega');
}

function getJeuxNintendo() {
    return getJeuxParFabricant('Nintendo');
}


/**
 * Récupère les détails d'un jeu spécifique via une requête GET
 */
async function obtenirDetailsExemplaire(idExemplaire) {
    try {
        const reponseExemplaire = await fetch(`${BASE_URL}/exemplaire/${idExemplaire}`);
        if (!reponseExemplaire.ok) throw new Error("Erreur lors de la récupération de l'exemplaire");
        const exemplaire = await reponseExemplaire.json();

        const reponseJeu = await fetch(`${BASE_URL}/jeu/${exemplaire.id_jeu}`);
        if (!reponseJeu.ok) throw new Error("Erreur lors de la récupération du jeu");
        const jeu = await reponseJeu.json();

        const [reponseConsole, reponseGenre] = await Promise.all([
            fetch(`${BASE_URL}/console/${jeu.id_console}`),
            fetch(`${BASE_URL}/genre/${jeu.id_genre}`)
        ]);

        if (!reponseConsole.ok) throw new Error("Erreur lors de la récupération de la console");
        if (!reponseGenre.ok) throw new Error("Erreur lors de la récupération du genre");

        const [consoleData, genreData] = await Promise.all([
            reponseConsole.json(),
            reponseGenre.json()
        ]);

        return {
            titre: jeu.titre,
            nom_console: consoleData.nom_console,
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
 * Met à jour le stock d'un exemplaire spécifique via une requête PUT
 */
async function mettreAJourStock(idExemplaire, nouveauStock) {
    try {
        const reponse = await fetch(`${BASE_URL}/exemplaire/${idExemplaire}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stock: nouveauStock
            })
        });

        if (!reponse.ok) throw new Error("Erreur lors de la mise à jour du stock");
        
        return true; // Succès
    } catch (erreur) {
        console.error("Erreur API (PUT) :", erreur);
        return false; // Échec
    }
}
