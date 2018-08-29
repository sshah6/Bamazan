var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  promptToShopInitial();
});

function promptToShopInitial(){
  inquirer
  .prompt({
    name: "promptToShop",
    type: "confirm",
    message: "Welcome to bamazon! Would you like to shop?"
  })
  .then(function(answer) {
    if(answer.promptToShop){
      displayProducts();
    }
    else {
      connection.end();
    }
  });
}

function promptToShopAgain(){
  inquirer
  .prompt({
    name: "promptToShop",
    type: "confirm",
    message: "Sorry, we don't have that quantity. Would you like to keep shopping?"
  })
  .then(function(answer) {
    if(answer.promptToShop){
      displayProducts();
    }
    else {
      connection.end();
    }
  });
}

function finalizePurchase(userItemID, userQuantity, stockQuant, itemPrice, itemName){
  var queryDB = 'UPDATE products SET stock_quantity = ' + [stockQuant-userQuantity] +
  ' WHERE item_id =' + userItemID;
  connection.query(queryDB ,function (error, results) {
    if (error) throw error;
    var totalCost = (userQuantity*itemPrice).toFixed(2);
    if (userQuantity == 1){
    console.log("Thank you for purchasing " + userQuantity + " " + itemName + ".\nYour total cost is: $" +
    totalCost + "\nHave a great day!");
    connection.end();
    }
    else {
    console.log("Thank you for purchasing " + userQuantity + " " + itemName + "s.\nYour total cost is: $" +
    totalCost + "\nHave a great day!");
    connection.end();
    }
 });
}

function displayProducts(){
  connection.query('SELECT * FROM products',function (error, results) {
    if (error) throw error;
    var itemArray=[];
    var itemUserChoice = {};
    for (var i =0; i<results.length; i++){
    var item = (results[i].product_name + ": $" + results[i].price.toFixed(2));
    itemArray.push(item);
    itemUserChoice[item] = results[i].item_id;  //associate the whole string with just the item id 
    }
    inquirer
    .prompt({
      name: "chooseProduct",
      type: "list",
      message: "Which item would you like to purchase?",
      choices: itemArray
    })
    .then(function(answer) {
      if (answer.chooseProduct !==null) {
        var productID = itemUserChoice[answer.chooseProduct];
        quantityChoice(productID);
      }
    });
  });
};

function quantityChoice(productID) {
  inquirer
    .prompt({
      name: "quantityChoice",
      type: "input",
      message: "How many do you want to purchase?"
    })
    .then(function(answer) {
      if(answer.quantityChoice != null){
      checkStock(productID, answer.quantityChoice);
      }
    });
}

function checkStock(userItemID, userQuantity) {
  var dbQuery ='SELECT stock_quantity, price, product_name FROM products WHERE item_id =' + userItemID;
  connection.query(dbQuery ,function (error, results) {
    if (error) throw error;
    var stockQuant=results[0].stock_quantity;
    var itemPrice=results[0].price;
    var itemName=results[0].product_name;
    if (stockQuant >= userQuantity){
      finalizePurchase(userItemID, userQuantity, stockQuant, itemPrice, itemName); 
    }
    else {
      promptToShopAgain();
    }
 });
}
