-- ==============================================================================
-- 1. CRÉATION DES TABLES
-- ==============================================================================

-- Création de la table Fabricant
CREATE TABLE Fabricant (
    id_fabricant INT PRIMARY KEY,
    nom_fabricant VARCHAR(100) NOT NULL
);

-- Création de la table Console
CREATE TABLE Console (
    id_console INT PRIMARY KEY,
    nom_console VARCHAR(100) NOT NULL,
    date_sortie INT,
    id_fabricant INT NOT NULL,
    CONSTRAINT fk_console_fabricant FOREIGN KEY (id_fabricant) REFERENCES Fabricant(id_fabricant)
);

-- Création de la table Genre
CREATE TABLE Genre (
    id_genre INT PRIMARY KEY,
    nom_genre VARCHAR(50) NOT NULL
);

-- Création de la table Jeu
CREATE TABLE Jeu (
    id_jeu INT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    annee_edition INT,
    id_console INT NOT NULL,
    id_genre INT NOT NULL,
    CONSTRAINT fk_jeu_console FOREIGN KEY (id_console) REFERENCES Console(id_console),
    CONSTRAINT fk_jeu_genre FOREIGN KEY (id_genre) REFERENCES Genre(id_genre)
);

-- Création de la table Exemplaire
CREATE TABLE Exemplaire (
    id_exemplaire INT PRIMARY KEY,
    stock INT NOT NULL,
    prix_achat DECIMAL(8,2),
    id_jeu INT NOT NULL,
    CONSTRAINT fk_exemplaire_jeu FOREIGN KEY (id_jeu) REFERENCES Jeu(id_jeu)
);

-- ==============================================================================
-- 2. INSERTION DES DONNÉES DE BASE
-- ==============================================================================

-- Insertion dans Fabricant
INSERT INTO Fabricant (id_fabricant, nom_fabricant) VALUES (1, 'Nintendo');
INSERT INTO Fabricant (id_fabricant, nom_fabricant) VALUES (2, 'Sega');
INSERT INTO Fabricant (id_fabricant, nom_fabricant) VALUES (3, 'Sony');
INSERT INTO Fabricant (id_fabricant, nom_fabricant) VALUES (4, 'Atari');

-- Insertion dans Console
INSERT INTO Console (id_console, nom_console, date_sortie, id_fabricant) VALUES (1, 'Super Nintendo', 1990, 1);
INSERT INTO Console (id_console, nom_console, date_sortie, id_fabricant) VALUES (2, 'Game Boy', 1989, 1);
INSERT INTO Console (id_console, nom_console, date_sortie, id_fabricant) VALUES (3, 'Mega Drive', 1988, 2);
INSERT INTO Console (id_console, nom_console, date_sortie, id_fabricant) VALUES (4, 'PlayStation', 1994, 3);
INSERT INTO Console (id_console, nom_console, date_sortie, id_fabricant) VALUES (5, 'Atari 2600', 1977, 4);

-- Insertion dans Genre
INSERT INTO Genre (id_genre, nom_genre) VALUES (1, 'Plateforme');
INSERT INTO Genre (id_genre, nom_genre) VALUES (2, 'RPG');
INSERT INTO Genre (id_genre, nom_genre) VALUES (3, 'Combat');
INSERT INTO Genre (id_genre, nom_genre) VALUES (4, 'Sport');

-- Insertion dans Jeu
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (1, 'Super Mario World', 1991, 1, 1);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (2, 'The Legend of Zelda: A Link to the Past', 1992, 1, 2);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (3, 'Street Fighter II', 1992, 1, 3);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (4, 'FIFA: Road to World Cup 98', 1997, 4, 4);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (5, 'Sonic the Hedgehog', 1991, 3, 1);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (6, 'Final Fantasy VII', 1997, 4, 2);
INSERT INTO Jeu (id_jeu, titre, annee_edition, id_console, id_genre) VALUES (7, 'Pit-Fighter', 1991, 2, 3);

-- Insertion dans Exemplaire
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (1, 3, 45.00, 1);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (2, 1, 20.50, 2);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (3, 2, 50.00, 3);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (4, 0, 105.00, 4);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (5, 4, 10.50, 5);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (6, 1, 35.00, 6);
INSERT INTO Exemplaire (id_exemplaire, stock, prix_achat, id_jeu) VALUES (7, 5, 25.50, 7);

-- Valider la transaction (Bonne pratique recommandée dans les notes de cours)
COMMIT;