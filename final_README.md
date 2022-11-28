## Besides the api from hw5, theses are other api we need

-------------------------------------------
## Starting page, buttoms for customers and operators to login
**Request Format:** /

**Request Type:** GET

**Description:** This page should show two options for customer/operator to login.

-------------------------------------------
## Get all customer names for login, check if the customer name has been created in the db
**Request Format:** /api/login/

**Request Type:** GET

**Response:** "Successfully login"

**Description:** This should check whether the input customer name is in the database. If not, the login request should return an error msg. If the user's name is already in the database, then call the order list up for the customer to do actions.

**Redirect** /api/customer/:customerId

-------------------------------------------
## Add new user in the database if "create new user" buttom clicked
**Request Format:** /api/add_newuser/

**Request Type:** PUT

**Response:** json 
{ 
  "user_name": "Mike",
  "use_password": "123",
}

**Description:**  This should check whether the input customer name is in the database. If yes, the add_newuser request should return an error msg that the user name is already in the database. Otherwise, add a new user into the database and redirect into the customer page.

**Redirect** /api/customer/:customerId

-------------------------------------------
## An Operator can create a new item with item name, item prize, and item Id

**Request Format:** /api/operator/:operator/add_item

**Request Type:** PUT

**Response:** json 
{ 
  "item_name": "steak",
  "item_price": "100",
  "item_Id": "i1",
}

**Description:** This should first check that whether an item is in the database or not. If yes, return an error msg. If not, add a new item into the database with its corresponding information.

