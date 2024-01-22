const Category=require('../models/Category')
const fs = require('fs');
const path = require('path');

module.exports = {
    renderEditCat: async (req, res, next) => {
        try {

            // if (!req.session.ID) {
            //     res.redirect("/");
            // }                   

            let url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
            let urlObj = new URL(url);

            let deleteID = urlObj.searchParams.get("delete");
            let editID = urlObj.searchParams.get("edit");
            let CatName = urlObj.searchParams.get("catName");
            let add = urlObj.searchParams.get("add");
            
            if (deleteID) {
                await Category.deleteByID(parseInt(deleteID));
            }
            if (editID) {
                await Category.updateCategory(parseInt(editID), CatName);
            }
            if (add) {
                await Category.addCategory(add);
            }
            let addCatID = urlObj.searchParams.get("addtoID");
            let addItemID = urlObj.searchParams.get("itemID");
            let addItemName = urlObj.searchParams.get("itemName");

            let deleteItemID = urlObj.searchParams.get("deleteItem");

            let editItem =  urlObj.searchParams.get("editItem");
            let itemName =  urlObj.searchParams.get("itemName");
            let itemCategory =  urlObj.searchParams.get("catID");

            if (editItem && itemName && itemCategory){
                await Category.updateItem(editItem, itemName, parseInt(itemCategory));
            }
            
            if (addCatID && addItemID && addItemName){
                await Category.addItem(addItemID, addItemName, parseInt(addCatID));
            }
            if (deleteItemID) {
                await Category.deleteItemByID(deleteItemID);
            }
            
            let categories = await Category.allCategory();       
            let categoryItems = await Category.allCategoryItem();
            let dataForHbs = categories.map((categories) => {
                const items = categoryItems.filter((item) => item.catID === categories.catID);
                return { ...categories, items };
            });
            res.render("admin/category/editCategory", { categories: dataForHbs, title: "Edit" });

        } catch (error) {
            console.log(error);
            let categories = await Category.allCategory();       
            let categoryItems = await Category.allCategoryItem();
            let dataForHbs = categories.map((categories) => {
                const items = categoryItems.filter((item) => item.catID === categories.catID);
                return { ...categories, items };
            });
            res.render("admin/category/editCategory", { categories: dataForHbs, error, title: "Edit" });
        }
    },
    renderCat: async (req, res, next) => {
        try{
            const categories = await Category.allCategory();       
            const categoryItems = await Category.allCategoryItem();
            const dataForHbs = categories.map((categories) => {
                const items = categoryItems.filter((item) => item.catID === categories.catID);
                return { ...categories, items };
            });
            res.render('admin/category/viewCategory',{categories: dataForHbs});
        }
        catch (error) {
            next(error);
        }
    },     
}