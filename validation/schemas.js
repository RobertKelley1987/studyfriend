const Joi = require('joi');
const { 
    emailMessages, 
    passwordMessages, 
    questionMessages,
    answerMessages,
    categoryNameMessages, 
    categoryIdMessages
} = require('./custom-errors');

exports.userSchema = Joi.object({
    email: Joi.string().email().required().error(errs => errs.map(err => emailMessages(err))),
    password: Joi.string().min(8).required().error(errs => errs.map(err => passwordMessages(err)))
}).required().options({ abortEarly: false });

exports.flashcardSchema = Joi.object({
    question: Joi.string().pattern(/\S+$/, 'allWhitespace').required()
              .error(errs => errs.map(err => questionMessages(err))),
    answer: Joi.string().pattern(/\S+$/, 'allWhitespace').required()
            .error(errs => errs.map(err => answerMessages(err))),
    category: Joi.string().pattern(/\S+$/, 'allWhitespace').required()
              .error(errs => errs.map(err => categoryIdMessages(err))),
}).required();

exports.categorySchema = Joi.object({
    name: Joi.string().pattern(/\S+$/, 'allWhitespace').required()
          .error(errs => errs.map(err => categoryNameMessages(err)))
}).required();