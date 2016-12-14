-- Create the "Bamazon" database --
CREATE DATABASE Bamazon;

-- Use the "Bamazon" database --
USE Bamazon;

-- Create the "products" table --
CREATE TABLE products
(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price FLOAT(10) NULL,
stock_quantity INTEGER(10) NULL,
PRIMARY KEY (item_id)
);

SELECT * FROM products