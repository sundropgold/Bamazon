/*



PSEUDOCODE



*/

// get inquirer

var inquirer = require("inquirer");

// get mysql
var mysql = require("mysql");

// get cli-table
var Table = require("cli-table");

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

function menuOptions(){
	// function that brings up menu options for supervisor

	console.log("======= Welcome to the Options Menu, Supervisor! =======");

	inquirer.prompt([
		{
			type:"list",
			name:"options",
			message:"Pick an option.",
			choices:["View Product Sales By Department", "Create New Department", "Log Out"]
		}
		]).then(function(user){

			// if the user picks view product sales
			if (user.options === "View Product Sales By Department"){

				// display summarized table in terminal
				// department id, department name, over head costs, product sales, total profit

				viewSales();
			}

			// else if the user picks create new department
			else if (user.options === "Create New Department") {

				createDept();

			}

			// else if the user picks to log out
			else if (user.options === "Log Out") {

				console.log("Logging out...");

			}

		});
}

function viewSales(){

	// do an inner join to get dept & product info on one table
	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ";
	query += "FROM products INNER JOIN departments ON (departments.department_name = products.department_name)";
	query += "ORDER BY departments.department_id";

	connection.query(query, function(err, res){

		// log out the resulting table

		// instantiate 
		var table = new Table({
		    head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
		  	colWidths: [18, 18, 20, 15, 15]
		});
		 
		// table is an Array, so you can `push`, `unshift`, `splice` and friends 
		for (var n=0; n < res.length; n++){
			// loop through the inner join to get the data to push on

			var totalProf = (parseInt(res[n].over_head_costs) - parseInt(res[n].product_sales));

			if (res[n].product_sales > 0 && totalProf > 0){
				// only display results if product sales are greater than 0

				table.push(
			    	[res[n].department_id, res[n].department_name, parseInt(res[n].over_head_costs), parseInt(res[n].product_sales), totalProf]
				);				
			}

		}
		 
		console.log(table.toString());

		// go back to menu options
		menuOptions();

	})
}

function createDept(){

	// ask for information about the new department
	// dept name and overhead costs
	// id will auto increment

	connection.query("SELECT * FROM departments", function (err, res){

		inquirer.prompt([
		{
			type:"input",
			name:"dept",
			message:"What is the new department's name?",
			validate:function(dept){
				for (var i = 0; i < res.length;i++){
					if (res[i].department_name === dept){
						console.log("This department already exists.");
					}
				}
				return true;
			}
		},
		{
			type:"input",
			name:"ovhcost",
			message:"What is this department's over head cost?",
			validate: function(ovhcost){
				if (isNaN(ovhcost) === false){
						return true;
					}
					return false;
			}
		}

		]).then(function(user){

			var deptName = user.dept;
			var overheadcost = parseInt(user.ovhcost);

			connection.query(
					"INSERT INTO departments SET ?",
					{
						department_name: deptName,
						over_head_costs: overheadcost
					}, function(err,res) {

					// log receipt of new product
					console.log("===== UPDATED DEPARTMENTS DATABASE SUCCESSFULLY =====");

					console.log( 
						"\nDepartment Name: " + deptName + 
						"\nOver Head Costs: " + overheadcost + "\n\n");

					// go back to options
					menuOptions();

				});

		});

	});

}