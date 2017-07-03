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

var displayProducts = function() {
	// display all the items available for sale

	// ids, names, department, prices

	connection.query("SELECT * FROM products", function(err, res) {

		if (err) throw err;

		console.log("\n WELCOME TO BAMAZON ====================================");

		for (var i = 0; i <res.length; i++) {
			console.log("\nProduct ID: " + res[i].item_id + "  |  Product Name: " 
				+ res[i].product_name + "  |  Department Name: " 
				+ res[i].department_name + "  |  Price: $" + res[i].price);
		}
	});
};

var askCustomer = function() {

	// display products for sale
	displayProducts();

	inquirer.prompt([

			// ask user for the id of the product they would like to purchase
			{
				type:"input",
				name:"id",
				message:"Please enter the id of the product you would like to purchase."
			},

			// ask how many units of the product they would like to buy?
			{
				type:"input",
				name:"quantity",
				message:"How many units of the product would you like to purchase?"
			}
			]).then(function(user){

				// check if the store has enough of the product

				if (user.quantity > res[i].stock_quantity) {
					console.log ("Sorry, insufficient quantity available. Directing you back to options ...");

					askCustomer();
				}

				else if (user.quantity <= res[i].stock_quantity) {

					// get new stock quantity
					var newStock = res.stock_quantity - user.quantity;

					// if there's enough in stock, update the database
					connection.query("UPDATE products SET ? WHERE ?", [{
						stock_quantity: newStock
					},{
						item_id: user.id
					}], function(err, res){
						if(err) throw err;
					});
				}

			});

};