'use strict';
// Require NPM Packages
var mysql = require("mysql");
var prompt = require("prompt");

// Create MySQL Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Connect to MySQL Database
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

// Start application
var start = function () {
    displayAllItems();
};

// Display all items available for sale
var displayAllItems = function () {
    var query = "SELECT item_id, product_name, price FROM products";

    // Query database for all items
    connection.query(query, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + res[i].price);
        }

        getItemToBuy();
    });
};

// Prompt user for ID and quantity of item to buy
var getItemToBuy = function () {
    prompt.message = '';
    prompt.start();

    var schema = {
        properties: {
            item_id: {
                description: 'Enter ID of the item you want to buy',
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
                description: 'Enter quantity of the item you want to buy',
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

        buyItem(result.item_id, result.quantity);
    });
};

// Purchase quantity of item selected
var buyItem = function (item_id, quantity) {
    var query = "SELECT * FROM products WHERE item_id=?";

    // Query database for item selected
    connection.query(query, item_id, function (err, result) {
        if (err) throw err;

        var chosenItem = result[0];

        if (chosenItem) {

            // Check if quantity selected is available
            if (parseInt(chosenItem.stock_quantity) < parseInt(quantity)) {
                console.log("Insufficient quantity!\n");
            }
            else {
                query = "UPDATE products SET ? WHERE ?";

                // Subtract quantity sold from stock in database and display total cost of purchase
                connection.query(query, [{
                    stock_quantity: (parseInt(chosenItem.stock_quantity) - parseInt(quantity))
                },
                {
                    item_id: item_id
                }], function (err, res) {
                    if (err) throw err;

                    // Round total cost to 2 decimal places
                    var totalCost = Math.round(chosenItem.price * quantity * 100) / 100;

                    console.log("You purchased " + quantity + " " + chosenItem.product_name + ".");
                    console.log("Total cost of your purchase: \$" + totalCost + "\n");
                });
            }
        }
        else {
            // Item ID entered was not found
            console.log("Not a valid ID\n");
        }

        displayAllItems();
    });
};

start();