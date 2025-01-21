-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') NOT NULL,
    email VARCHAR(255) NOT NULL;
);

-- Clients Table
  CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    company_id VARCHAR(100) DEFAULT NULL,
    company_name VARCHAR(25) DEFAULT NULL,
    ein VARCHAR(9) DEFAULT NULL,
    address VARCHAR(50) DEFAULT NULL,
    city VARCHAR(50) DEFAULT NULL,
    entity_corp VARCHAR(100) DEFAULT NULL,
    state VARCHAR(25) DEFAULT NULL,
    owner_address VARCHAR(100) DEFAULT NULL,
    phone_num VARCHAR(15) DEFAULT NULL;
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Employees Table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

ALTER TABLE clients 
ADD COLUMN company_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN company_name VARCHAR(25) DEFAULT NULL,
ADD COLUMN ein VARCHAR(9) DEFAULT NULL,
ADD COLUMN address VARCHAR(50) DEFAULT NULL,
ADD COLUMN city VARCHAR(50) DEFAULT NULL,
ADD COLUMN entity_corp VARCHAR(100) DEFAULT NULL,
ADD COLUMN state VARCHAR(25) DEFAULT NULL,
ADD COLUMN owner_address VARCHAR(100) DEFAULT NULL,
ADD COLUMN phone_num VARCHAR(15) DEFAULT NULL;

ALTER TABLE clients
ADD COLUMN employee_count INT(0) DEFAULT NULL;

CREATE TABLE employee_info (
    id INT AUTO_INCREMENT PRIMARY KEY, -- A unique identifier for each row
    date DATE NOT NULL,                -- The date
    check_number INT,                  -- Check number (Ck#)
    gross_wages_per_week DECIMAL(10, 2), -- Gross wages per week
    fed_income_tax_wh DECIMAL(10, 2),  -- Federal income tax withholding
    soc_sec DECIMAL(10, 2),     -- Social Security tax withholding (6.2%)
    medicare DECIMAL(10, 2),      -- Medicare tax (1.45%)
    futa_annual_er DECIMAL(10, 2),     -- FUTA annual employer tax
    ca_pit_wh DECIMAL(10, 2),          -- California PIT withholding
    sdi DECIMAL(10, 2),                -- SDI: 1.10%
    sui DECIMAL(10, 2),                -- SUI: 2.60%
    ett DECIMAL(10, 2),                -- ETT: 0.10%
    net_wages DECIMAL(10, 2)           -- Net wages
);

ALTER TABLE employee_info
ADD COLUMN employee_id INT AFTER id;