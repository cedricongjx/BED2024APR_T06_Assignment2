const Joi = require('joi');

// Middleware to validate signup request
const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// Middleware to validate login request
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// Middleware to validate user update request
const validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30),
    password: Joi.string().min(6)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// Middleware to validate user ID in request parameters
const validateUserIdParam = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateUserUpdate,
  validateUserIdParam,
};
