'use strict';
var mysql = require("mysql");
var prompt = require("prompt");

var password = require("./password.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: password.myPassword,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

var displayAllItems = function () {
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + res[i].price);
        }
        promptUser();
    });
};

var promptUser = function () {
    prompt.start();

    var property = [{
        name: 'product_id',
        message: 'Enter Item ID'
    },{
        name: 'quantity',
        message: 'How many?'
    }];

    prompt.get(property, function (err, result) {
        if (err) throw err;

        console.log('Command-line input received:');
        console.log('  result: ' + result.product_id);
        console.log('  result: ' + result.quantity);
    });
};

displayAllItems();