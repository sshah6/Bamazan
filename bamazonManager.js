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
  initialPrompt();
});



function initialPrompt() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Hello Manager! Select option from menu",
        choices: [
          "View Products",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products":
          viewProducts();
          break;
  
        case "View Low Inventory":
          viewLowInventory();
          break;
  
        case "Add to Inventory":
          addInventory();
          break;
  
        case "Add New Product":
          addProduct();
          break;
        
        case "Exit":
          connection.end();
          break;
        }
      });
  }

function returnToMenu(){
  inquirer
  .prompt({
    name: "returnMenu",
    type: "confirm",
    message: "Return to main menu?"
  })
  .then(function(answer) {
    if(answer.returnMenu){
      initialPrompt();
    }
    else {
      connection.end();
    }
  });
}

function viewProducts(){
    connection.query('SELECT * FROM products',function (error, results) {
      if (error) throw error;
      var itemArray=[];
      for (var i =0; i<results.length; i++){
      var item = ("Item ID: " + results[i].item_id + ", Product Name: " + results[i].product_name + ", Department: " + results[i].department_name + ", Price: $" + results[i].price.toFixed(2) + ", Stock Quantity: " + results[i].stock_quantity);
      itemArray.push(item);
      console.log(itemArray[i] + "\n---------------------------------------------------------------------------------------------------------");
      }
      returnToMenu();
    });
  };

function viewLowInventory(){
connection.query('SELECT * FROM products',function (error, results) {
    if (error) throw error;   
    var itemArray=[];
    for (var i =0; i<results.length; i++){
    var item = ("Item ID: " + results[i].item_id + ", Product Name: " + results[i].product_name + ", Department: " + results[i].department_name + ", Price: $" + results[i].price.toFixed(2) + ", Stock Quantity: " + results[i].stock_quantity);
    itemArray.push(item);
    if (results[i].stock_quantity < 5){
    console.log(itemArray[i] + "\n---------------------------------------------------------------------------------------------------------");
        }
    }
    console.log("All of your inventory has at least 5 items in stock");
    returnToMenu();
    });
};

function addInventory(){
    connection.query('SELECT * FROM products',function (error, results) {
      if (error) throw error;
      var itemArray=[];
      var itemUserChoice = {};
      for (var i =0; i<results.length; i++){
      var item = (results[i].product_name +"-------Current Stock Quantity: " + results[i].stock_quantity);
      itemArray.push(item);
      itemUserChoice[item] = results[i].item_id;  
      }
      inquirer
      .prompt({
        name: "chooseProduct",
        type: "list",
        message: "Which product would you like to add inventory to?",
        choices: itemArray
      })
      .then(function(answer) {
        if (answer.chooseProduct !==null) {
          var productID = itemUserChoice[answer.chooseProduct];
          quantToAdd(productID);
        }
      });
    });
  };

function quantToAdd(productID) {
  inquirer
    .prompt({
      name: "addQuantity",
      type: "input",
      message: "How many units do you want to add?"
    })
    .then(function(answer) {
      if(answer.addQuantity != null){
      var addQuant = answer.addQuantity;
        checkStockQuant(productID, addQuant);
      }
    });
}

function checkStockQuant(productID, addQuant) {
    var checkDB ='SELECT stock_quantity FROM products WHERE item_id =' + productID;
    connection.query(checkDB ,function (error, results) {
    if (error) throw error;
    var currentStock = results[0].stock_quantity;
    updateStockQuant(currentStock, addQuant, productID)
    }); 
}

function updateStockQuant(currentStock, addQuant, productID){
var newAmount = parseInt(currentStock) + parseInt(addQuant);
var updateDB ='UPDATE products SET stock_quantity = ' + newAmount +
' WHERE item_id =' + productID;
connection.query(updateDB ,function (error, results) {
    if (error) throw error;
    console.log("You have successfuly added " + addQuant + " units to your inventory. You now have " + newAmount + " units of the selected product.");
    returnToMenu();
    });
}

function addProduct(){
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Input Product Name"
      },
      {
        name: "department",
        type: "input",
        message: "Input Department Name"
      },
      {
        name: "price",
        type: "input",
        message: "Input price per unit",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "Input # of units to add",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          var name = answer.name;
          var depName = answer.department;
          var price = answer.price;
          var quant = answer.quantity;
          console.log("You have successfully added " + quant + " units of " + name + " to your inventory!");
          returnToMenu();
        }
      );
    });
}
    
    
    
    
    
    
    
    
    
    
    
    
    
