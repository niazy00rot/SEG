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