src/
│
├── config/
│   ├── db.js
│   ├── env.js
│   ├── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── ticket.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── ticket.service.js
│   ├── token.service.js
│
├── repositories/
│   ├── user.repository.js
│   ├── ticket.repository.js
│   ├── role.repository.js
│   ├── refreshToken.repository.js
│
├── models/
│   ├── user.model.js
│   ├── role.model.js
│   ├── refreshToken.model.js
│   ├── ticket.model.js
│
├── validators/
│   ├── auth.validator.js
│   ├── user.validator.js
│   ├── ticket.validator.js
│
├── middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   ├── validate.js
│   ├── errorHandler.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── ticket.routes.js
│
├── utils/
│   ├── bcrypt.js
│   ├── jwt.js
│   ├── response.js
│   ├── logger.js
│   ├── constants.js
│
├── database/
│   ├── collections.js
│   ├── indexes.js
│
├── app.js
└── server.js