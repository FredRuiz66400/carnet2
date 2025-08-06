CREATE TABLE plongeur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    niveau VARCHAR(50),
    organisme VARCHAR(50),
    unite_profondeur VARCHAR(10) DEFAULT 'm',
    unite_temperature VARCHAR(10) DEFAULT '°C',
    photo VARCHAR(255)
);

CREATE TABLE materiel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plongeur_id INT,
    nom VARCHAR(100),
    type VARCHAR(50),
    date_verification DATE,
    FOREIGN KEY (plongeur_id) REFERENCES plongeur(id)
);

CREATE TABLE plongee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plongeur_id INT,
    date DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(100),
    site VARCHAR(100),
    profondeur_max DECIMAL(5,2),
    duree INT,
    temperature DECIMAL(4,1),
    visibilite DECIMAL(4,1),
    conditions VARCHAR(255),
    binome VARCHAR(100),
    consommation_air DECIMAL(5,2),
    notes TEXT,
    FOREIGN KEY (plongeur_id) REFERENCES plongeur(id)
);


-- Exemple de vue pour la profondeur moyenne
CREATE VIEW stats_profondeur_moyenne AS
SELECT plongeur_id, AVG(profondeur_max) AS profondeur_moyenne
FROM plongee
GROUP BY plongeur_id;

-- Exemple de vue pour le temps total sous l'eau
CREATE VIEW stats_temps_total AS
SELECT plongeur_id, SUM(duree) AS temps_total
FROM plongee
GROUP BY plongeur_id;