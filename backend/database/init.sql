-- ======================================================
-- SEG Auto Parts E-Commerce Database
-- PostgreSQL
-- ======================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================================
-- ROLES
-- ======================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- USERS
-- ======================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT,

    phone TEXT,

    google_id TEXT,

    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    last_login TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_users_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
);

-- ======================================================
-- REFRESH TOKENS
-- ======================================================

CREATE TABLE refresh_tokens (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ======================================================
-- OTP
-- ======================================================

CREATE TABLE otp (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    code TEXT NOT NULL,

    purpose TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    is_used BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_otp_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ======================================================
-- BRANDS
-- ======================================================

CREATE TABLE brands (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- MODELS
-- ======================================================

CREATE TABLE models (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    brand_id UUID NOT NULL,

    name TEXT NOT NULL,

    CONSTRAINT fk_models_brand
        FOREIGN KEY(brand_id)
        REFERENCES brands(id)
        ON DELETE CASCADE
);

-- ======================================================
-- VEHICLES
-- ======================================================

CREATE TABLE vehicles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    brand_id UUID NOT NULL,

    model_id UUID NOT NULL,

    year INTEGER NOT NULL,

    CONSTRAINT fk_vehicle_brand
        FOREIGN KEY(brand_id)
        REFERENCES brands(id),

    CONSTRAINT fk_vehicle_model
        FOREIGN KEY(model_id)
        REFERENCES models(id)
);

-- ======================================================
-- CATEGORIES
-- ======================================================

CREATE TABLE categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- PRODUCT TYPES
-- ======================================================

CREATE TABLE product_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- PRODUCTS
-- ======================================================

CREATE TABLE products (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL,

    product_type_id UUID NOT NULL,

    created_by UUID,

    updated_by UUID,

    name TEXT NOT NULL,

    description TEXT,

    sku TEXT NOT NULL UNIQUE,

    price NUMERIC(10,2) NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 0,

    deleted_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_product_type
        FOREIGN KEY(product_type_id)
        REFERENCES product_types(id),

    CONSTRAINT fk_product_creator
        FOREIGN KEY(created_by)
        REFERENCES users(id),

    CONSTRAINT fk_product_updater
        FOREIGN KEY(updated_by)
        REFERENCES users(id)
);

-- ======================================================
-- PRODUCT IMAGES
-- ======================================================

CREATE TABLE product_images (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL,

    image_path TEXT NOT NULL,

    is_primary BOOLEAN DEFAULT FALSE,

    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_images_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- ======================================================
-- PRODUCT COMPATIBILITY
-- ======================================================

CREATE TABLE product_compatibility (

    product_id UUID NOT NULL,

    vehicle_id UUID NOT NULL,

    PRIMARY KEY(product_id, vehicle_id),

    CONSTRAINT fk_pc_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pc_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE
);

-- ======================================================
-- CARTS
-- ======================================================

CREATE TABLE carts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cart_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ======================================================
-- CART ITEMS
-- ======================================================

CREATE TABLE cart_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    cart_id UUID NOT NULL,

    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL,

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY(cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);

-- ======================================================
-- ORDER STATUS
-- ======================================================

CREATE TABLE order_statuses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- ORDERS
-- ======================================================

CREATE TABLE orders (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    order_status_id UUID NOT NULL,

    order_number TEXT NOT NULL UNIQUE,

    phone TEXT NOT NULL,

    country TEXT NOT NULL,

    city TEXT NOT NULL,

    street TEXT NOT NULL,

    building TEXT,

    floor TEXT,

    address_notes TEXT,

    total_price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_orders_user
        FOREIGN KEY(user_id)
        REFERENCES users(id),

    CONSTRAINT fk_orders_status
        FOREIGN KEY(order_status_id)
        REFERENCES order_statuses(id)
);

-- ======================================================
-- ORDER ITEMS
-- ======================================================

CREATE TABLE order_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL,

    unit_price NUMERIC(10,2) NOT NULL,

    subtotal NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);

-- ======================================================
-- PART REQUEST STATUS
-- ======================================================

CREATE TABLE part_request_statuses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE
);

-- ======================================================
-- PART REQUESTS
-- ======================================================

CREATE TABLE part_requests (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    brand_id UUID NOT NULL,

    model_id UUID NOT NULL,

    status_id UUID NOT NULL,

    vehicle_year INTEGER NOT NULL,

    description TEXT NOT NULL,

    image_path TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_pr_user
        FOREIGN KEY(user_id)
        REFERENCES users(id),

    CONSTRAINT fk_pr_brand
        FOREIGN KEY(brand_id)
        REFERENCES brands(id),

    CONSTRAINT fk_pr_model
        FOREIGN KEY(model_id)
        REFERENCES models(id),

    CONSTRAINT fk_pr_status
        FOREIGN KEY(status_id)
        REFERENCES part_request_statuses(id)
);

-- ======================================================
-- LOGS
-- ======================================================

CREATE TABLE logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    action TEXT NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID,

    ip_address TEXT,

    user_agent TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_logs_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ======================================================
-- INDEXES
-- ======================================================

CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_products_name ON products(name);

CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_orders_user ON orders(user_id);

CREATE INDEX idx_orders_status ON orders(order_status_id);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE INDEX idx_product_compatibility_vehicle
ON product_compatibility(vehicle_id);

CREATE INDEX idx_part_requests_user
ON part_requests(user_id);

-- ======================================================
-- DEFAULT ROLES
-- ======================================================

INSERT INTO roles (name)
VALUES
    ('Client'),
    ('Employee'),
    ('Admin')
ON CONFLICT (name) DO NOTHING;

-- ======================================================
-- DEFAULT ORDER STATUSES
-- ======================================================
INSERT INTO order_statuses (name)
VALUES
    ('Pending'),
    ('Processing'),
    ('Shipped'),
    ('Delivered'),
    ('Cancelled')
ON CONFLICT (name) DO NOTHING;

-- ======================================================
-- DEFAULT PART REQUEST STATUSES        
-- ======================================================
INSERT INTO part_request_statuses (name)
VALUES
    ('Pending'),
    ('In Progress'),
    ('Completed'),
    ('Rejected')
ON CONFLICT (name) DO NOTHING;

-- ======================================================
-- DEFAULT BRANDS
-- ======================================================
INSERT INTO brands (name)
VALUES
    ('Toyota'),
    ('Honda'),
    ('Chevrolet'),
    ('Nissan'),
    ('BMW'),
    ('Mercedes-Benz'),
    ('Volkswagen'),
    ('Hyundai'),
    ('Kia'),
    ('Audi'),
    ('Mazda'),
    ('Subaru'),
    ('Jeep'),
    ('Chrysler'),
    ('Mitsubishi'),
    ('Volvo'),
    ('Fiat')
ON CONFLICT (name) DO NOTHING;

-- ======================================================
-- DEFAULT MODELS
-- ======================================================
INSERT INTO models (brand_id, name)
VALUES
    ((SELECT id FROM brands WHERE name = 'Toyota'), 'Camry'),
    ((SELECT id FROM brands WHERE name = 'Toyota'), 'Corolla'),
    ((SELECT id FROM brands WHERE name = 'Honda'), 'Civic'),
    ((SELECT id FROM brands WHERE name = 'Honda'), 'Accord'),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Cruze'),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), 'Impala'),
    ((SELECT id FROM brands WHERE name = 'Nissan'), 'Sunny'),
    ((SELECT id FROM brands WHERE name = 'Nissan'), 'Sentra'),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), 'Elantra'),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), 'Matrix'),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), 'Tucson'),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), 'Verna'),
    ((SELECT id FROM brands WHERE name = 'Kia'), 'Cirato'),
    ((SELECT id FROM brands WHERE name = 'Kia'), 'Picanto'),
    ((SELECT id FROM brands WHERE name = 'Kia'), 'Rio'),
    ((SELECT id FROM brands WHERE name = 'Kia'), 'Sportage'),
    ((SELECT id FROM brands WHERE name = 'BMW'), '3 Series'),
    ((SELECT id FROM brands WHERE name = 'BMW'), '5 Series'),
    ((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'C-Class'),
    ((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'E-Class'),
    ((SELECT id FROM brands WHERE name = 'Volkswagen'), 'Golf'),
    ((SELECT id FROM brands WHERE name = 'Volkswagen'), 'Passat'),
    ((SELECT id FROM brands WHERE name = 'Audi'), 'A4'),
    ((SELECT id FROM brands WHERE name = 'Audi'), 'A6'),
    ((SELECT id FROM brands WHERE name = 'Mazda'), '3'),
    ((SELECT id FROM brands WHERE name = 'Mazda'), '6'),
    ((SELECT id FROM brands WHERE name = 'Subaru'), 'Impreza'),
    ((SELECT id FROM brands WHERE name = 'Subaru'), 'Legacy'),
    ((SELECT id FROM brands WHERE name = 'Jeep'), 'Wrangler'),
    ((SELECT id FROM brands WHERE name = 'Jeep'), 'Grand Cherokee'),
    ((SELECT id FROM brands WHERE name = 'Chrysler'), '300C'),
    ((SELECT id FROM brands WHERE name = 'Chrysler'), 'Pacifica'),
    ((SELECT id FROM brands WHERE name = 'Mitsubishi'), 'Lancer_Buma'),
    ((SELECT id FROM brands WHERE name = 'Mitsubishi'), 'Lancer_Skark'),
    ((SELECT id FROM brands WHERE name = 'Volvo'), 'S60'),
    ((SELECT id FROM brands WHERE name = 'Volvo'), 'XC90'),
    ((SELECT id FROM brands WHERE name = 'Fiat'), '500'),
    ((SELECT id FROM brands WHERE name = 'Fiat'), 'Panda'),
    ((SELECT id FROM brands WHERE name = 'Fiat'), 'Tipo'),
    ((SELECT id FROM brands WHERE name = 'Fiat'), 'Punto'),
    
ON CONFLICT (name) DO NOTHING;

-- ======================================================
-- DEFAULT VEHICLES
-- =====================================================
INSERT INTO vehicles (brand_id, model_id, year)
VALUES
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2010),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2011),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2012),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2013),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2014),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2015),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2016),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2017),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2016),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2017),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2018),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2019),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2020),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2021),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2022),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2023),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2024),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2025),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Camry'), 2026),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2010),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2011),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2012),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2013),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2014),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2015),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2016),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2017),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2018),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2019),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2020),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2021),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2022),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2023),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2024),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2025),
    ((SELECT id FROM brands WHERE name = 'Toyota'), (SELECT id FROM models WHERE name = 'Corolla'), 2026),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2016),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2017),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2018),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2019),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2020),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2021),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2022),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2023),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2024),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2025),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Civic'), 2026),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2016),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2017),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2018),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2019),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2020),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2021),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2022),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2023),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2024),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2025),
    ((SELECT id FROM brands WHERE name = 'Honda'), (SELECT id FROM models WHERE name = 'Accord'), 2026),
    
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2016),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2017),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2018),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2019),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2020),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2021),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2022),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2023),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2024),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2025),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Cruze'), 2026),
    
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2016),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2017),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2018),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2019),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2020),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2021),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2022),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2023),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2024),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2025),
    ((SELECT id FROM brands WHERE name = 'Chevrolet'), (SELECT id FROM models WHERE name = 'Impala'), 2026),
    
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2016),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2017),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2018),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2019),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2020),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2021),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2022),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2023),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2024),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2025),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sunny'), 2026),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2016),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2017),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2018),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2019),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2020),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2021),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2022),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2023),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2024),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2025),
    ((SELECT id FROM brands WHERE name = 'Nissan'), (SELECT id FROM models WHERE name = 'Sentra'), 2026),
    
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2016),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2017),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2018),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2019),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2020),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2021),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2022),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2023),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2024),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2025),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Elantra'), 2026),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2016),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2017),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2018),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2019),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2020),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2021),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2022),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2023),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2024),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2025),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Matrix'), 2026),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2016),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2017),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2018),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2019),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2020),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2021),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2022),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2023),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2024),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2025),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Tucson'), 2026),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2016),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2017),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2018),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2019),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2020),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2021),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2022),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2023),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2024),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2025),
    ((SELECT id FROM brands WHERE name = 'Hyundai'), (SELECT id FROM models WHERE name = 'Verna'), 2026);

