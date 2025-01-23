-- Script de création des tables pour l'application Pigeon Devis
-- Auteur: Yohan
-- Date: 19/01/2024

-- Nettoyage des tables existantes (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS estimate_lines CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS password_reset_links CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Nettoyage des types énumérés
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS estimate_status CASCADE;
DROP TYPE IF EXISTS customer_type CASCADE;
DROP TYPE IF EXISTS performance_type CASCADE;
DROP TYPE IF EXISTS role_type CASCADE;

-- Extension pour la génération d'UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fonction pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Type énuméré pour les rôles
CREATE TYPE role_type AS ENUM ('ROLE_USER', 'ROLE_ADMIN');

-- Table des rôles
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name role_type NOT NULL UNIQUE
);

COMMENT ON TABLE roles IS 'Table des rôles utilisateur';

-- Insertion des rôles par défaut
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Table des utilisateurs
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    signature_path VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Table des utilisateurs de l''application';

-- Table des liens de réinitialisation de mot de passe
CREATE TABLE password_reset_links (
    reset_link_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    unique_link UUID NOT NULL DEFAULT uuid_generate_v4(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE password_reset_links IS 'Table des liens de réinitialisation de mot de passe';

-- Table des adresses
CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    street_number VARCHAR(10) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    complement VARCHAR(255)
);

COMMENT ON TABLE addresses IS 'Table des adresses postales';

-- Table des entreprises
CREATE TABLE businesses (
    business_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    siret VARCHAR(14) NOT NULL UNIQUE,
    ape_code VARCHAR(5) NOT NULL,
    tax_code VARCHAR(50) NOT NULL,
    logo_path VARCHAR(255),
    address_id UUID NOT NULL REFERENCES addresses(address_id) ON DELETE RESTRICT
);

COMMENT ON TABLE businesses IS 'Table des entreprises';

-- Types énumérés
CREATE TYPE performance_type AS ENUM ('SERVICE', 'PRODUCT');
CREATE TYPE customer_type AS ENUM ('PROFESSIONAL', 'INDIVIDUAL');
CREATE TYPE estimate_status AS ENUM ('EMITTED', 'ACCEPTED');
CREATE TYPE invoice_status AS ENUM ('EMITTED', 'PAID');

COMMENT ON TYPE performance_type IS 'Type de prestation (service ou produit)';
COMMENT ON TYPE customer_type IS 'Type de client (professionnel ou particulier)';
COMMENT ON TYPE estimate_status IS 'Statut du devis (émis ou accepté)';
COMMENT ON TYPE invoice_status IS 'Statut de la facture (émise ou payée)';

-- Table des prestations
CREATE TABLE performances (
    performance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    type performance_type NOT NULL
);

COMMENT ON TABLE performances IS 'Table des prestations (services ou produits)';

-- Table des clients
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    type customer_type NOT NULL,
    business_name VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(15),
    address_id UUID REFERENCES addresses(address_id) ON DELETE SET NULL,
    CONSTRAINT check_customer_type CHECK (
        (type = 'PROFESSIONAL' AND business_name IS NOT NULL) OR
        (type = 'INDIVIDUAL' AND first_name IS NOT NULL AND last_name IS NOT NULL)
    )
);

COMMENT ON TABLE customers IS 'Table des clients';

-- Table des devis
CREATE TABLE estimates (
    estimate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    status estimate_status NOT NULL DEFAULT 'EMITTED',
    discount DECIMAL(5,2) DEFAULT 0,
    expiration_date DATE NOT NULL,
    delivery_time INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE estimates IS 'Table des devis';

-- Table des lignes de devis
CREATE TABLE estimate_lines (
    estimate_line_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id UUID NOT NULL REFERENCES estimates(estimate_id) ON DELETE CASCADE,
    performance_id UUID NOT NULL REFERENCES performances(performance_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL
);

COMMENT ON TABLE estimate_lines IS 'Table des lignes de devis';

-- Table des factures
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id UUID NOT NULL REFERENCES estimates(estimate_id) ON DELETE RESTRICT,
    status invoice_status NOT NULL DEFAULT 'EMITTED',
    surcharge DECIMAL(10,2) DEFAULT 0,
    payment_limit DATE NOT NULL,
    payment_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE invoices IS 'Table des factures';

-- Table des dépenses
CREATE TABLE expenses (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE expenses IS 'Table des dépenses';

-- Index pour optimiser les performances
CREATE INDEX idx_password_reset_links_user_id ON password_reset_links(user_id);
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_address_id ON businesses(address_id);
CREATE INDEX idx_performances_business_id ON performances(business_id);
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_address_id ON customers(address_id);
CREATE INDEX idx_estimates_business_id ON estimates(business_id);
CREATE INDEX idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX idx_estimate_lines_estimate_id ON estimate_lines(estimate_id);
CREATE INDEX idx_estimate_lines_performance_id ON estimate_lines(performance_id);
CREATE INDEX idx_invoices_estimate_id ON invoices(estimate_id);
CREATE INDEX idx_expenses_business_id ON expenses(business_id);

-- Index pour les recherches fréquentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_businesses_siret ON businesses(siret);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_performances_name ON performances(name); 