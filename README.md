MoneyMVC
========

서버와 프론트엔드를 조합하여 사용함 


Server

- express
- hapi 
- slim


Client

- angular
- react
- jquery
- javascript


## Structure

### Database modeling by Sequelize and MySQL

#### Users

- id
- email
- password
- name
- createdAt
- updatedAT


#### Expenses

- id
- date
- memo
- amount
- createdAt
- updatedAT
- UserId

### REST API

#### Authentication

- post /auth 
- delete /auth


#### User 

- post /api/users
- get /api/users/me


#### Expense 

- post /api/expense  
- get /api/expenses?date 
- get /api/expenses?search 
- get /api/expense/:id 
- put /api/expense/:id  
- delete /api/expense/:id 
- get /api/expenses/meta 


### Front Routes

- /expenses?date=YYYY-MM
- /expenses/new
- /expenses/:id
