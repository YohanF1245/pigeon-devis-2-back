-- Script d'insertion des données de production
-- Auteur: Yohan
-- Date: 19/01/2024

-- Les rôles sont déjà insérés dans le script create-tables.sql

-- Administrateur par défaut (à changer en production)
INSERT INTO users (email, password, first_name, last_name, is_verified, role_id)
VALUES (
    'admin@pigeon-devis.fr',
    -- Mot de passe temporaire à changer lors de la première connexion
    '$2a$10$8HxzqXHuNkwPdBXPmjRSo.F5N6RqDhFXAZKltJw2QlF1ZQLH0Qmk2',
    'Admin',
    'System',
    true,
    (SELECT role_id FROM roles WHERE name = 'ROLE_ADMIN')
); 