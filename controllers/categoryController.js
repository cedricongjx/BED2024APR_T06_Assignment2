const Category = require("../models/category");
const path = require('path');

const getAllCategories = async (req,res) => {
    try{
        const categories = await Category.getAllCategories();
        res.json(categories);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};
const getCategoryById = async (req,res)=>{
    const catid = parseInt(req.params.id);
    try{
        const category = await Category.getCategoryById(catid);
        if(!category){
            return res.status(404).send("Category not found");
        }
        res.json(category)
    }catch(error){
        console.error(error)
        res.status(500).send("Error retreiving category");
    }
}
const addCategory = async (req,res)=>{
    const newCategory = req.body;
    try{
        const createdcategory = await Category.addCategory(newCategory);
        res.status(201).json(createdcategory);
    }catch(error){
        console.error(error)
        res.status(500).send ("Error creating category")
    }
}
const deleteCategory = async (req,res)=>{
    const catId = parseInt(req.params.id);
    try{
        const success = await Category.deleteCategory(catId);
        if(!success){
            return res.status(404).send("Category not found");
        }
        res.status(204).send();
    }catch(error){
        console.error(error)
        res.status(500).send("Error deleting category")
    }
}
module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    deleteCategory,
}