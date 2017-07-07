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

	menuOptions();

});

// list menu options
function menuOptions() {

	console.log("======= Welcome to the Options Menu, Manager! =======");
	inquirer.prompt([

			{
				type:"list",
				name:"option",
				message:"What would you like to do?",
				choices:["View Products For Sale", "View Low Inventory Items", "Add Stock to Items", "Add New Product", "Log Out"],
				validate: function(option){
					if (option.length != 1){
						return "Please pick an option!";
					}
					return true;
				}
			}
		]).then(function(user){

			// cycle through possible options and call appropriate functions

			if (user.option === "View Products For Sale") {

				viewProducts();

			}
			else if (user.option === "View Low Inventory Items") {

				lowInventory();

			}
			else if (user.option === "Add Stock to Items") {

				addStock();

			}
			else if (user.option === "Add New Product") {

				addProduct();

			}

			else if (user.option === "Log Out") {
				console.log("Logging Out...");
			}

		});

}

function viewProducts() {
	/* view products for sale
	 - the app should list every available item:
	 item IDs, product names, prices, and stock quantity
	*/	

	connection.query("SELECT * FROM products", function(err, res) {

		if (err) throw err;

		console.log("===== PRODUCTS FOR SALE =====");

		// read and log out all products

		for (var i = 0; i <res.length; i++) {
			console.log("\nProduct ID: " + res[i].item_id + 
				" | Product Name: " + res[i].product_name + 
				"\nDepartment Name: " + res[i].department_name + 
				"\nStock Quantity: " + res[i].stock_quantity +
				"\nPrice: $" + res[i].price + "\n\n");
		}

		// go back to options
		menuOptions();
	});
}

function lowInventory() {
	/* view low inventory
	- the app should list all the items with an inventory count
	lower than five
	*/

	connection.query("SELECT * FROM products", function(err,res){

		if (err) throw err;

		console.log("===== LOW INVENTORY =====");

		// read then log only the products that have a stock quantity lower than 5

		for (var i = 0; i < res.length; i++) {

			if (res[i].stock_quantity < 5) {
				console.log("\nProduct ID: " + res[i].item_id + 
					" | Product Name: " + res[i].product_name + 
					"\nDepartment Name: " + res[i].department_name + 
					"\nStock Quantity: " + res[i].stock_quantity +
					"\nPrice: $" + res[i].price + "\n\n");
			}
		}

		// go back to options
		menuOptions();
	});

}

function addStock() {
	/* add to inventory
	- the app should display a prompt that will let the manager
	"add more" of any item currently in the store
	*/

	connection.query("SELECT * FROM products", function(err,res){

		if (err) throw err;

		console.log("===== ADD STOCK TO ITEM =====");

		inquirer.prompt([
			// get the id of the product you want to update

			{
				name:"id",
				message:"Enter the ID of the item you'd like to add stock to.",
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
			{
				name:"quantity",
				message:"What's the quantity you will be adding to this product?",
				validate: function(quantity) {
					// validate so that manager doesn't accidentally subtract from stock
					if (parseInt(quantity) <= 0) {
						console.log("Please choose another amount.");
					}
					return true;
				}	
			}
		]).then(function(user){

			var itemID = parseInt(user.id);
			var quantity = parseInt(user.quantity);

			for (var k = 0; k < res.length; k++) {

				if (res[k].item_id === itemID) {
				// if the id exists, update the stock

					var newStock = res[(itemID-1)].stock_quantity + quantity;

					connection.query("UPDATE products SET ? WHERE ?",
						// update products table and set stock quantity to new stock
						// where the item id is the same id as the user entered
					[
						{
							stock_quantity: newStock
						},
						{
							item_id: itemID
						}
					], function(err, res){

							console.log("===== ADDED STOCK TO ITEMS SUCCESSFULLY =====");

							// go back to options
							menuOptions();
						}
					); // end connection
				} // end if statement

			} // end for loop

		});

	});
}

function addProduct(){
	/* add new product
	- the app should allow the manager to add a completely new
	product to the stor
	*/

	connection.query("SELECT * FROM products", function(err,res){

		if (err) throw err;

		console.log("===== ADD NEW PRODUCT =====");
	
		inquirer.prompt([

			// add new product (id will auto increment)
			{	
				type:"input",
				name: "product",
				message: "What is your new product's name?",
				validate: function(product){
					// check if the product already exists
					for (var i = 0; i < res.length; i++){
						if (res[i].product_name == product) {
							console.log("Sorry, this product already exists.");
						}						
					}

					return true;
				}
			},
			{
				type:"list",
				name:"department",
				message: "What department does your product belong in?",
				choices: ["Rare Artifacts", "Spell Books", "Magic Charms"]
			},
			{
				type:"input",
				name:"price",
				message:"How much does this product cost? (Omit dollar sign.)",
				validate: function(price){
					// validate if price is a number
					if (isNaN(price) === false){
						return true;
					}
					return false;
				}
			},
			{
				type:"input",
				name:"amount",
				message:"How much of this product is in stock?",
				validate:function(amount) {
					if (isNaN(amount) === false){
						return true;
					}
					return false;
				}
			}

			]).then(function(user){

				var productName = user.product;
				var deptName = user.department;
				var productPrice = parseFloat(user.price);
				var stockAmt = parseInt(user.amount);

				// add new product to the products table w/ insert

				connection.query(
					"INSERT INTO products SET ?",
					{
						product_name: productName,
						department_name: deptName,
						price: productPrice,
						stock_quantity: stockAmt
					}, function(err,res) {

					// log receipt of new product
					console.log("===== UPDATED PRODUCT DATABASE SUCCESSFULLY =====");

					console.log( 
						"\nProduct Name: " + productName + 
						"\nDepartment Name: " + deptName + 
						"\nStock Quantity: " + stockAmt +
						"\nPrice: $" + productPrice + "\n\n");

					// go back to options
					menuOptions();

				});

			});

	});
}
