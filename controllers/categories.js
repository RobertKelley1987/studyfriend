const Category = require('../models/Category');
const User = require('../models/User');
const ExpressError = require('../util/express-error');
const catchAsync = require('../util/catch-async');
const { findUser, findCategory } = require('./helpers');

module.exports.getOne = catchAsync(async(req, res) => {
    const{ categoryId } = req.params;
    const category = await findCategory(categoryId);
    res.status(200).send({ category });
});

module.exports.getAll = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const foundUser = await findUser(userId);
    res.status(200).send({ categories: foundUser.categories });
});

module.exports.create = catchAsync(async (req, res) => {
    const { name } = req.body, { userId } = req.params;

    // Create category
    const newCategory = await Category.create({ name: name });
    if(!newCategory) {
        throw new ExpressError(500, 'NEW_CATEGORY_ERR', 'Failed to create new card category.');
    }

    // Add to user's array of categories
    const foundUser = await User.findById(userId).populate('categories');
    foundUser.categories.push(newCategory);
    await foundUser.save();

    // Return updated categories
    res.status(200).send({ categories: foundUser.categories });
});

module.exports.updateOne = catchAsync(async (req, res) => {
    const { userId, categoryId } = req.params; 
    const { name } = req.body;

    // Find category and update
    const foundCategory = await Category.findById(categoryId);
    if(!foundCategory) {
        throw new ExpressError(400, 'GET_CATEGORY_ERR', 'Failed to locate category with that id.');
    }
    foundCategory.name = name;
    await foundCategory.save();

    // Return updated categories
    const foundUser = await findUser(userId);
    res.status(200).send({ categories: foundUser.categories });
});

module.exports.deleteOne = catchAsync(async (req, res) => {
    const { userId, categoryId } = req.params;

    // Delete category from db
    const { deletedCount } = await Category.deleteOne({_id: categoryId });
    if(deletedCount < 1) {
        throw new ExpressError(500, 'DELETE_CATEGORY_ERR', 'Failed to delete this item from the database.');
    }

    // Return updated categories
    const foundUser = await findUser(userId);
    res.status(200).send({ categories: foundUser.categories });
});