CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
	item_id INTEGER (11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price FLOAT(22) NOT NULL,
    stock_quantity INTEGER (100) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Shooting Star", "Rare Artifacts", 35.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Phoenix Tears", "Rare Artifacts", 100.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Unicorn Hair", "Rare Artifacts", 200.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Dragon Breath", "Rare Artifacts", 200.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Magical Theory", "Spell Books", 20.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Magic for Beginners", "Spell Books", 25.00, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Spells 101", "Spell Books", 20.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("History of Magic", "Spell Books", 10.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Lucky Potion", "Magic Charms", 10.00, 105);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Fortune Candle", "Magic Charms", 5.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Four Leaf Clover", "Magic Charms", 1.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Lavender Satchel", "Magic Charms", 2.00, 100);

USE bamazon;
UPDATE products
SET stock_quantity = 100
WHERE item_id = 9;

DELETE FROM products WHERE product_name = "Pixie Dust";