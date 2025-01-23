-- Se connecter en tant que postgres (à faire manuellement)
-- psql -U postgres

-- Mettre à jour le mot de passe de l'utilisateur
ALTER USER "pigeon-devis" WITH PASSWORD 'PigeonDevis2024!SecureDB';

-- Note : Pour exécuter ce script :
-- 1. Connectez-vous en tant que postgres : psql -U postgres
-- 2. Exécutez le script : \i chemin/vers/database-update-password.sql
-- 3. Vérifiez la connexion : psql -U "pigeon-devis" -d "pigeon-devis" -h localhost 