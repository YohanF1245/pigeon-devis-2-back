-- Script d'insertion des données de test
-- Auteur: Yohan
-- Date: 19/01/2024

-- Utilisateurs de test
INSERT INTO users (email, password, first_name, last_name, phone, is_verified, role_id)
VALUES 
    ('admin@test.com', '$2a$10$8HxzqXHuNkwPdBXPmjRSo.F5N6RqDhFXAZKltJw2QlF1ZQLH0Qmk2', 'Admin', 'Test', '0123456789', true, (SELECT role_id FROM roles WHERE name = 'ROLE_ADMIN')),
    ('user@test.com', '$2a$10$8HxzqXHuNkwPdBXPmjRSo.F5N6RqDhFXAZKltJw2QlF1ZQLH0Qmk2', 'User', 'Test', '0123456789', true, (SELECT role_id FROM roles WHERE name = 'ROLE_USER'));

-- Adresses de test
INSERT INTO addresses (street_number, street_name, zip_code, city)
VALUES 
    ('1', 'Rue du Test', '75000', 'Paris'),
    ('2', 'Avenue des Tests', '75001', 'Paris');

-- Entreprises de test
INSERT INTO businesses (owner_id, siret, ape_code, tax_code, address_id)
VALUES 
    ((SELECT user_id FROM users WHERE email = 'user@test.com'), '12345678901234', '12345', 'FR12345678901', (SELECT address_id FROM addresses WHERE street_number = '1')),
    ((SELECT user_id FROM users WHERE email = 'admin@test.com'), '98765432109876', '54321', 'FR98765432109', (SELECT address_id FROM addresses WHERE street_number = '2'));

-- Prestations de test
INSERT INTO performances (business_id, name, description, price, tax_rate, type)
VALUES 
    ((SELECT business_id FROM businesses WHERE siret = '12345678901234'), 'Service 1', 'Description du service 1', 100.00, 20.00, 'SERVICE'),
    ((SELECT business_id FROM businesses WHERE siret = '12345678901234'), 'Produit 1', 'Description du produit 1', 50.00, 20.00, 'PRODUCT'),
    ((SELECT business_id FROM businesses WHERE siret = '98765432109876'), 'Service 2', 'Description du service 2', 150.00, 20.00, 'SERVICE'),
    ((SELECT business_id FROM businesses WHERE siret = '98765432109876'), 'Produit 2', 'Description du produit 2', 75.00, 20.00, 'PRODUCT');

-- Clients de test
INSERT INTO customers (business_id, type, business_name, first_name, last_name, email, phone, address_id)
VALUES 
    ((SELECT business_id FROM businesses WHERE siret = '12345678901234'), 'PROFESSIONAL', 'Entreprise Test 1', NULL, NULL, 'client1@test.com', '0123456789', (SELECT address_id FROM addresses WHERE street_number = '1')),
    ((SELECT business_id FROM businesses WHERE siret = '12345678901234'), 'INDIVIDUAL', NULL, 'Jean', 'Test', 'client2@test.com', '0123456789', (SELECT address_id FROM addresses WHERE street_number = '2')),
    ((SELECT business_id FROM businesses WHERE siret = '98765432109876'), 'PROFESSIONAL', 'Entreprise Test 2', NULL, NULL, 'client3@test.com', '0123456789', (SELECT address_id FROM addresses WHERE street_number = '1')),
    ((SELECT business_id FROM businesses WHERE siret = '98765432109876'), 'INDIVIDUAL', NULL, 'Marie', 'Test', 'client4@test.com', '0123456789', (SELECT address_id FROM addresses WHERE street_number = '2'));

-- Note : Le mot de passe pour tous les utilisateurs est 'password' 