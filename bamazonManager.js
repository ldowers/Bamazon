'use strict';
// Require NPM Packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

// Create MySQL Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Connect to MySQL Database and call function to display action choices
connection.connect(function (err) {
    if (err) throw err;
    chooseAction();
});

// Prompt user to choose action
var chooseAction = function () {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory",
            "Add to Inventory", "Add New Product", "Quit"]
    }).then(function (answer) {

        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "Quit":
                connection.end();
                break;
        }
    });
};

// View all items available for sale
var viewProducts = function () {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";

    // Query database for all items
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("\nFULL INVENTORY");

        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity);
        };

        console.log();
        chooseAction();
    });
};

// View all items with stock quantity less than 5
var viewLowInventory = function () {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";

    // Query database for all items
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("\nLOW INVENTORY");

        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity);
        };

        console.log();
        chooseAction();
    });

};

// Prompt user for ID and quantity of item to add
var addToInventory = function () {
    prompt.message = '';
    prompt.start();

    var schema = {
        properties: {
            item_id: {
                description: 'Enter ID of the item you want to add more of to inventory',
                type: 'integer',
                message: 'Not a valid ID',
                required: true,
                conform: function (value) {
                    if (value >= 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            quantity: {
                description: 'Enter quantity of the item you want to add to inventory',
                type: 'integer',
                message: 'Not a valid quantity',
                required: true,
                conform: function (value) {
                    if (value >= 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    };

    prompt.get(schema, function (err, result) {
        if (err) throw err;

        addItem(result.item_id, result.quantity);
    });
};

// Add quantity of item selected to inventory
var addItem = function (item_id, quantity) {
    var query = "SELECT * FROM products WHERE item_id=?";

    // Query database for item selected
    connection.query(query, item_id, function (err, result) {
        if (err) throw err;

        var chosenItem = result[0];

        if (chosenItem) {

            query = "UPDATE products SET ? WHERE ?";

            // Add quantity to stock in database
            connection.query(query, [{
                stock_quantity: (parseInt(chosenItem.stock_quantity) + parseInt(quantity))
            },
            {
                item_id: item_id
            }], function (err, res) {
                if (err) throw err;

                console.log("You added " + quantity + " of " + chosenItem.product_name + " to inventory.\n");

                chooseAction();
            });
        }
        else {
            // Item ID entered was not found
            console.log("Not a valid ID\n");
            chooseAction();
        }
    });
};

// Add new item to inventory
var addNewProduct = function () {
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "Enter product name: "
    }, {
        name: "department_name",
        type: "input",
        message: "Enter department name: "
    },
    {
        name: "price",
        type: "input",
        message: "Enter price: ",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },
    {
        name: "stock_quantity",
        type: "input",
        message: "Enter stock quantity: ",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function (answer) {
        var query = "INSERT INTO products SET ?";

        connection.query(query, {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: parseFloat(answer.price),
            stock_quantity: parseInt(answer.stock_quantity)
        }, function (err, res) {
            if (err) throw err;

            console.log("You added " + answer.stock_quantity + " of " + answer.product_name + " to inventory.\n");

            chooseAction();
        });
    });
};