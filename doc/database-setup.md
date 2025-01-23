# Configuration de la Base de Données PostgreSQL

## Prérequis
- PostgreSQL installé sur la machine
- Accès administrateur à PostgreSQL

## Étapes de Configuration

### 1. Création de l'Utilisateur
```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Créer l'utilisateur pour l'API
CREATE USER "pigeon-devis" WITH PASSWORD 'votre_mot_de_passe_securise';
```

### 2. Création de la Base de Données
```sql
-- Créer la base de données
CREATE DATABASE "pigeon-devis" WITH OWNER "pigeon-devis";
```

### 3. Configuration des Droits
```sql
-- Se connecter à la base de données pigeon-devis
\c "pigeon-devis"

-- Accorder les privilèges nécessaires
GRANT ALL PRIVILEGES ON DATABASE "pigeon-devis" TO "pigeon-devis";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "pigeon-devis";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "pigeon-devis";

-- Définir les privilèges par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "pigeon-devis";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "pigeon-devis";
```

### 4. Vérification
```sql
-- Tester la connexion avec le nouvel utilisateur
psql -U "pigeon-devis" -d "pigeon-devis" -h localhost
```

## Notes de Sécurité
- Remplacer 'votre_mot_de_passe_securise' par un mot de passe fort
- En production, limiter les droits aux opérations strictement nécessaires
- Configurer pg_hba.conf pour restreindre les connexions si nécessaire

## Variables d'Environnement Requises
```properties
POSTGRES_USER=pigeon-devis
POSTGRES_PASSWORD=votre_mot_de_passe_securise
POSTGRES_DB=pigeon-devis
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
``` 