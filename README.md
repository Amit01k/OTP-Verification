## Project - Appointment_booking

## Technologies applied 
- Node.js
- Express.js
- MongoDB (Database)
- Twilio (send OTP on mobile number)
- Moongoose

## Setup

### Clone repo
```sh
$ git clone https://github.com/Amit01k/OTP-Verification.git
```

### Open Appointment_booking Folder
```sh
$ cd OTP-Verification
```
### Install All Dependencies
```sh
$ npm install
```

### Add Mongo DB String 
```yaml
- Note Add Mongo DB string to connect with database
- Open appointment_booing folder>index.js file>enter mongoDB connection String
{
    mongoose.connect(process.env.DATABASE||'enter your mongo DB connection string', {
    useNewUrlParser: true,})
}
```
### Run the Application
```sh
$ npm start
```
### input for create user
- user input
- name: user name
- mobile_number: mobile number of user and this is unique beacause every user have own mobile number
- date_of_birth: please enter valid formate => date_of_birth in DD-MM-YYYY format.
- referral_code: predefined refrrel_code=> ['ABCD', 'EFGH', 'IJKL','MNOP','QRST']
- email: email of the user and this is unique beacause every user have email Id.
- password: password should be 8 to 15 character

```yaml
{
    "name":"amit",
    "mobile_number":"7979848429",
    "date_of_birth":"12-12-2013",
    "referral_code":"ABCD",
    "email":"amnknkewfghferg31wt@gmail.com",
    "password":"234567890"
}
```


### userModel
- User Model
```yaml
{ 
  "name": {string, mandatory},
  "mobile_number": {string, mandatory, unique},
  "date_of_birth":{string,mandatory},
  "referral_code":{string,Default:""},
  "email": {string, mandatory, valid email, unique}, 
  "password": {string, mandatory, minLen 8, maxLen 15},
  "createdAt": {timestamp},
  "updatedAt": {timestamp}
}
```
## User APIs 

### POST /register
- Create a user document from request body.
- Returning HTTP status 201 on a succesful user creationed. Also return the user document. The response should be a JSON object like [this](#successfully-user-created-response-structure)
- Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)

## Response

### Successful Response structure
```yaml
{
  status: true,
  message: 'Success',
  data: {

  }
}
```

### Successfully User Created Response structure
```yaml
{
    "msg": "data successfully created",
    "data": {
        "name": "amit",
        "date_of_birth": "12-12-2013",
        "mobile_number": "7979848429",
        "email": "amnknkewfghferg31wt@gmail.com",
        "password": "1234456789",
        "referral_code": "ABCD",
        "isDeleted": false,
        "_id": "64bd5da6d4a7657446f507cc",
        "createdAt": "2023-07-23T17:04:38.768Z",
        "updatedAt": "2023-07-23T17:04:38.768Z",
        "__v": 0
    }
}
```
### Error Response structure
```yaml
{
  "status": false,
  "message": ""
}
```

### POST /login
- Allow an user to login with their mobile number.
- please use 7979848429, 9565361447, 7409150572,7383444636 these mobile num to login 
- i have no upgrated version of twilio, so we need to varify number manually
- if our not registered so it will throw an error like [this](#user-not-registered) 

### Successful Response structure For Login
```yaml
{
    "msg": "token generated successfully",
    "token": "token will show here when user successfully created"
}
```

### GET /user
- Returns all users in the collection that aren't deleted. Return all the fiels. Response example [here](#get-user-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 

### Get user response
```yaml
{
    "status": true,
    "message": "users list",
    "data": [
        
    ]
}
```

### GET /user/:id
- for this api we retrive user data by user id
- Returns a user with complete details. Response example [here](#user-details-response)
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 

### User Details Response
```yaml
{
    "status": true,
    "message": "user data",
    "data": {
        "_id": "64bd5da6d4a7657446f507cc",
        "name": "amit",
        "date_of_birth": "12-12-2013",
        "mobile_number": "7979848429",
        "email": "amnknkewfghferg31wt@gmail.com",
        "password": "1234456789",
        "referral_code": "ABCD",
        "isDeleted": false,
        "createdAt": "2023-07-23T17:04:38.768Z",
        "updatedAt": "2023-07-23T17:04:38.768Z",
        "__v": 0
    }
}
```

### User Not Registered
```yaml
{
    "status": false,
    "message": "mobile number not registerd, please regirster yourself"
}
```

### PUT /user/:id
- Update a user by changing new input enter by user.
- Checking if the user exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
- Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
- response return the updated user document. 

### DELETE /user/:id
- Check if the userid exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
- Delete will soft deleted, means we can't perform any operation on data ,but data will be presend in database for future uses.
- If the book document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 
