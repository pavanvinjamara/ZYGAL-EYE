# Node.js + Express + MongoDB (Native Driver) Project Architecture Guide

> **Goal:** Understand **why** each folder exists, **what** it should contain, and **what it should never contain**.

---

# Table of Contents

1. Project Overview
2. Request Flow
3. Folder Structure
4. Folder Explanations
5. Complete Signup Flow
6. Complete Login Flow
7. Why We Don't Need Mongoose Models
8. Layer Responsibilities
9. Common Mistakes
10. Best Practices

---

# 1. Project Overview

Our application uses:

* Node.js
* Express.js
* MongoDB Native Driver (No Mongoose)
* JWT Authentication
* Refresh Tokens
* Repository Pattern

Since we're **not using Mongoose**, we organize our code into layers so every file has **one responsibility**.

---

# 2. Complete Request Flow

```
                   Browser
                      │
                      ▼
                Express Route
                      │
                      ▼
             Validation Middleware
                      │
                      ▼
                 Controller
                      │
                      ▼
                  Service
             ┌────────┴────────┐
             ▼                 ▼
          Model          Repository
             │                 │
             └────────► MongoDB
                      │
                      ▼
                Token Service
                      │
                      ▼
                 Controller
                      │
                      ▼
                  Response
```

Think of every layer as a person doing a different job.

---

# 3. Project Structure

```
src/
│
├── config/
│
├── controllers/
│
├── services/
│
├── repositories/
│
├── models/
│
├── validators/
│
├── middleware/
│
├── routes/
│
├── utils/
│
├── database/
│
├── app.js
│
└── server.js
```

---

# 4. Folder Explanations

---

# config/

```
config/

db.js

env.js

jwt.js
```

## Purpose

Store application configuration.

Configuration means values that the application needs to run.

Examples

* Database URL
* JWT Secret
* Token Expiry
* Environment Variables

## db.js

Responsible for creating ONE MongoDB connection.

```
MongoClient

↓

Connect

↓

Return database instance
```

Nobody else should create another MongoClient.

---

## env.js

Loads

```
process.env
```

Example

```
PORT

MONGO_URI

JWT_SECRET

JWT_REFRESH_SECRET
```

---

## jwt.js

Contains only configuration.

Example

```
ACCESS_SECRET

REFRESH_SECRET

ACCESS_EXPIRY

REFRESH_EXPIRY
```

Notice

No jwt.sign()

No jwt.verify()

Only configuration.

---

# routes/

```
routes/

auth.routes.js

user.routes.js
```

## Purpose

Routes define API endpoints.

Example

```
POST /login

↓

authController.login
```

Routes should NEVER contain business logic.

Bad

```
router.post("/login",async()=>{

compare password

generate token

save user

})
```

Good

```
router.post("/login",authController.login)
```

Routes only decide

"Which controller should execute?"

---

# controllers/

```
controllers/

auth.controller.js

user.controller.js
```

## Purpose

Controllers receive the request and send the response.

Example

```
Request

↓

Controller

↓

Service

↓

Response
```

Controller responsibilities

✔ Read request

```
req.body

req.params

req.query
```

✔ Call service

✔ Return response

Controller should NEVER

❌ Query MongoDB

❌ Hash Password

❌ Generate JWT

❌ Compare Password

---

Example

```
exports.login = async (req,res)=>{

const result =
await authService.login(req.body);

res.json(result);

}
```

Very small.

---

# services/

```
services/

auth.service.js

user.service.js

ticket.service.js

token.service.js
```

## Purpose

Business Logic

Services answer

"What should happen?"

Example

Signup

```
Validate

↓

Email Exists?

↓

Hash Password

↓

Create User

↓

Save

↓

Generate Token

↓

Return Response
```

Everything above belongs here.

---

Example

```
login()

signup()

logout()

refreshToken()

changePassword()
```

---

# repositories/

```
repositories/

user.repository.js

ticket.repository.js

refreshToken.repository.js
```

## Purpose

Repositories ONLY talk to MongoDB.

Think

```
Repository

↓

MongoDB
```

Example

```
findByEmail()

findById()

create()

update()

delete()
```

Repository NEVER

❌ Hash Password

❌ JWT

❌ Business Logic

❌ Validation

Repository ONLY

```
db.collection(...)

findOne()

insertOne()

updateOne()

deleteOne()
```

---

Example

```
async function findByEmail(email){

return db.collection("users")

.findOne({email});

}
```

---

# models/

Many developers think

"No Mongoose"

↓

"No Models"

Wrong.

Models still have value.

Instead of Mongoose Models

```
User.create()

User.save()

User.find()
```

Our model becomes

A JavaScript Factory

Example

```
createUser(data)
```

Example

```
createUser({

first_name,

email,

password

})
```

Returns

```
{

first_name,

email,

status:"ACTIVE",

email_verified:false,

failed_login_attempts:0,

created_at:new Date()

}
```

Why?

Instead of writing

```
status:"ACTIVE"

created_at:new Date()

updated_at:new Date()

failed_login_attempts:0
```

inside every service,

we write it once.

Benefits

✔ Default Values

✔ Consistent Structure

✔ Easier Maintenance

---

# validators/

Purpose

Validate Request Data

Example

Signup

```
First Name

Email

Password

Phone
```

Libraries

* Joi

* Zod

* express-validator

Validation happens BEFORE controller.

Bad Request

↓

Stop Request

↓

Return 400

Controller never runs.

---

# middleware/

```
middleware/

authenticate.js

authorize.js

validate.js

errorHandler.js
```

Middleware runs before controllers.

---

authenticate.js

Purpose

Verify JWT

Flow

```
Token

↓

Verify

↓

User

↓

req.user

↓

next()
```

---

authorize.js

Purpose

Permission Checking

Example

```
ticket.read

ticket.create

ticket.delete
```

If permission missing

↓

403 Forbidden

---

validate.js

Runs Validators

```
Signup Validator

↓

Errors?

↓

Return 400

↓

Else Next()
```

---

errorHandler.js

Handles ALL errors.

Instead of

```
try{

}catch(){

}
```

everywhere,

Express catches it once.

---

# utils/

```
utils/

bcrypt.js

jwt.js

response.js

logger.js

constants.js
```

Purpose

Reusable helper functions.

---

bcrypt.js

Contains

```
hashPassword()

comparePassword()
```

---

jwt.js

Contains

```
generateAccessToken()

generateRefreshToken()

verifyAccessToken()

verifyRefreshToken()
```

Notice

config/jwt.js

↓

Stores Secret

utils/jwt.js

↓

Uses Secret

---

response.js

Creates standard API responses

Example

```
{

success:true,

message:"Login Successful",

data:{}

}
```

Every API returns same format.

---

logger.js

Central logging.

Instead of

```
console.log()
```

everywhere.

---

constants.js

Stores

```
Roles

Permissions

Status

Messages

Error Codes
```

instead of hardcoding strings.

---

# database/

```
database/

collections.js

indexes.js
```

---

collections.js

Instead of

```
db.collection("users")
```

everywhere

Create

```
COLLECTIONS.USERS
```

If collection changes

```
users

↓

app_users
```

Only one file changes.

---

indexes.js

Creates indexes automatically.

Example

Unique Email

```
email

↓

Unique
```

TTL

```
expires_at

↓

Auto Delete
```

---

# app.js

Creates Express Application

```
const app = express();

app.use(...)

module.exports = app;
```

Does NOT start server.

---

# server.js

Starts Application

```
Connect Database

↓

Start Express

↓

Listen Port
```

---

# Complete Signup Flow

```
POST /signup

↓

Route

↓

Validation Middleware

↓

Controller

↓

Auth Service

↓

User Repository

↓

MongoDB

↓

Token Service

↓

Response
```

Detailed

```
Request

↓

Validate Input

↓

Email Exists?

↓

Hash Password

↓

Create User Model

↓

Save User

↓

Generate Access Token

↓

Generate Refresh Token

↓

Return Tokens
```

---

# Complete Login Flow

```
Request

↓

Route

↓

Controller

↓

Find User

↓

Compare Password

↓

Generate JWT

↓

Save Refresh Token

↓

Return Response
```

---

# Why We Still Have Models Without Mongoose

Mongoose Model

```
User.create()

User.find()

User.save()
```

Without Mongoose

```
createUser()

createTicket()

createRole()
```

Models simply prepare objects before inserting them into MongoDB.

They are NOT responsible for database access.

---

# Layer Responsibilities

| Layer      | Responsibility                            |
| ---------- | ----------------------------------------- |
| Route      | Map URL to Controller                     |
| Middleware | Authentication, Authorization, Validation |
| Controller | Receive Request, Return Response          |
| Service    | Business Logic                            |
| Model      | Build Data Object, Default Values         |
| Repository | Database Queries                          |
| MongoDB    | Store Data                                |
| Utils      | Shared Helper Functions                   |
| Config     | Configuration                             |
| Database   | Collections & Indexes                     |

---

# Common Mistakes

❌ Query MongoDB inside Controller

❌ Generate JWT inside Repository

❌ Hash Password inside Controller

❌ Validate Request inside Service

❌ Put Business Logic inside Route

❌ Hardcode Collection Names Everywhere

❌ Duplicate Object Structure in Multiple Files

---

# Golden Rule

Whenever you write code, ask yourself these questions:

### Does this code only fetch or save data?

→ Repository

---

### Does this code decide **what should happen**?

→ Service

---

### Does this code only build an object with default values?

→ Model

---

### Does this code only validate user input?

→ Validator

---

### Does this code verify authentication or permissions?

→ Middleware

---

### Does this code receive an HTTP request and return an HTTP response?

→ Controller

---

### Does this code define an API endpoint?

→ Route

---

If every file has exactly one responsibility, your project becomes easier to understand, easier to test, and much easier to maintain as it grows.
