-- Se connecter en tant que postgres (à faire manuellement)
-- psql -U postgres

-- Supprimer l'utilisateur et la base de données s'ils existent déjà
DROP DATABASE IF EXISTS "pigeon-devis";
DROP USER IF EXISTS "pigeon-devis";

-- Créer l'utilisateur pour l'API
CREATE USER "pigeon-devis" WITH PASSWORD 'votre_mot_de_passe_securise';

-- Créer la base de données
CREATE DATABASE "pigeon-devis"
    WITH 
    OWNER = "pigeon-devis"
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Se connecter à la base de données pigeon-devis
\c "pigeon-devis";

-- Accorder les privilèges nécessaires
GRANT ALL PRIVILEGES ON DATABASE "pigeon-devis" TO "pigeon-devis";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "pigeon-devis";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "pigeon-devis";

-- Définir les privilèges par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "pigeon-devis";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "pigeon-devis";

-- Commentaire sur la base de données
COMMENT ON DATABASE "pigeon-devis" IS 'Base de données pour l''application de gestion de devis et factures';

-- Note : Pour exécuter ce script :
-- 1. Connectez-vous en tant que postgres : psql -U postgres
-- 2. Exécutez le script : \i chemin/vers/database-init.sql
-- 3. Vérifiez la connexion : psql -U "pigeon-devis" -d "pigeon-devis" -h localhost 