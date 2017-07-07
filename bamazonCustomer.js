// get inquirer
var inquirer = require("inquirer");

// get mysql
var mysql = require("mysql");

var connection = mysql.createConnection({

	host:"localhost",
	port:8889,
	user:"root",
	password:"root",
	database:"bamazon"
});

connection.connect(function(err){
	// make sure that a connection is established

	if (err) throw err;

	askCustomer();

});

function askCustomer() {

	// display all the items available for sale

	// ids, names, department, prices

	connection.query("SELECT * FROM products", function(err, res) {

		if (err) throw err;

		console.log("\n WELCOME TO BAMAZON ====================================");

		for (var i = 0; i <res.length; i++) {
			console.log("\nProduct ID: " + res[i].item_id + " | Product Name: " 
				+ res[i].product_name + "\nDepartment Name: " 
				+ res[i].department_name + " | Price: $" + res[i].price + "\n\n");
		}

	inquirer.prompt([

		// ask user for the id of the product they would like to purchase
		{
			type:"input",
			name:"id",
			message:"Please enter the id of the product you would like to purchase.",
			validate: function(id) {
					// validate if that id number exists

					for (var i =0; i < res.length; i++) {
						if (res[i].item_id == id) {
							console.log("This ID doesn't exist.");
						}
						return true;
					}
				}
		},

		// ask how many units of the product they would like to buy?
		{
			type:"input",
			name:"quantity",
			message:"How many units of the product would you like to purchase?",
			validate:function(amount) {
					if (isNaN(amount) === false){
						return true;
					}
					return false;
				}
		}
		]).then(function(user){

			var userID = parseInt(user.id);
			var userQuantity = parseInt(user.quantity);

			// check if the store has enough of the product
			// cycle through res to find the right id
			for (var i = 0; i < res.length; i++) {

				if (userID === (res[i].item_id - 1)) {

					if (userQuantity > res[i].stock_quantity) {

						// order won't go through - insufficient quantity
						console.log ("Sorry, insufficient quantity available.");

					}

					else if (userQuantity <= res[i].stock_quantity) {

						// get new stock quantity
						var newStock = res[i].stock_quantity - userQuantity;

						// tally total = quantity * price
						var total = userQuantity * res[i-1].price;

						var productName = res[i-1].product_name;

						// if there's enough in stock, update the database
						connection.query("UPDATE products SET ? WHERE ?", [{
							stock_quantity: newStock
							},{
							item_id: userID
						}], function(err, res){
							if(err) throw err;

							// print receipt
							console.log("\n\nThank you for your purchase!");
							console.log("============================");
							console.log("Total of " + productName + ": $" + total);

						});

					}
				}
			} // for loop end

		}); // product prompt end

	}); // connection query end
};


