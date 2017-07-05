# Bamazon

> 1) After creation of the Bamazon database and products table, this is what the products table looks like.
> ![initial products table](images/screenshot_start.png)

> 2) When the user commands to run "node BamazonCustomer.js", this is the view of the products they will be seeing.
> ![node products view part 1](images/screenshot_nodeproducts1.png)

> ![node products view part2](images/screenshot_nodeproducts2.png)

> 3) When the user enters a quantity to purchase that is over the available stock quantity, they get this message, and the products table is not altered at all.
> ![user quantity over stock quantity](images/screenshot_unsuccessful.png)

> 4) The table still looks the same after this.
> ![user quantity over stock quantity 2](images/screenshot_unsuccessfultable.png)

> 5) When the user enters a product whose quantity is also available in the stock quantity, the transaction will go through. The stock quantity is updated in the products table, and the user will receive a receipt of the item they purchased.
> ![user purchase success](images/screenshot_successful)

> 6) The table will be updated at the ID of the user's chosen product. The stock number will go down by how much quantity the user purchased.
> ![user purchase success](images/screenshot_successfultable)
