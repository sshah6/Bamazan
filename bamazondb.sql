DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL (8,2) NOT NULL,
    stock_quantity INTEGER(10)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Notebook", "Stationary", 3.49, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Picture Frame", "Home Goods", 4.80, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Desk Lamp", "Home Goods", 19.89, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pencil Box", "Stationary", 3.50, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Utensil Set", "Home Goods", 9.99, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hard Drive", "Technology", 70.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HDMI Cord", "Technology", 17.70, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toy Truck", "Toys", 13.50, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rubber Duck", "Toys", 4.50, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wall Art", "Home Goods", 18.00, 8);

SELECT * FROM products;
