const express = require('express');
const router = express.Router({ mergeParams: true });
const categories = require('../controllers/categories');
const { isLoggedIn } = require('../middleware');
const { validateNewCategory, validateEditedCategory } = require('../validation');

router.use(isLoggedIn);

router.route('/:categoryId') 
    .get(categories.getOne)
    .delete(categories.deleteOne)
    .put(validateEditedCategory, categories.updateOne);

router.route('/')
    .get(categories.getAll)
    .post(validateNewCategory, categories.create);

module.exports = router;