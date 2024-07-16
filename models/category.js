const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");

class category{
    constructor(catId,categoryName)
    {
        this.catId = catId;
        this.categoryName = categoryName;
    }
    static async getAllCategories(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `select * from categories`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        console.log(result.recordset);

        connection.close();
        return result.recordset.map(
            (row) => new category(row.catId,row.categoryName)
        );
    }
    static async getCategoryById(catId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `select * from categories where catId = @id`; 
        const request = connection.request();
        request.input("id", catId)
        const result = await request.query(sqlQuery);
        console.log(result.recordset);
        connection.close();
        return result.recordset[0]
            ?new category(
                result.recordset[0].catId,
                result.recordset[0].categoryName,
            )
            :null;
    }
    static async addCategory(newCategoryData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `Insert into categories(CategoryName) values (@categoryName)
                            select scope_identity() AS catId`;
        const request = connection.request();
        request.input("categoryName",newCategoryData.categoryName);
        const result = await request.query(sqlQuery);
        connection.close();
        const categoryID = result.recordset[0].catId;
        if(!categoryID) {
            console.log("Category creation failed, no id returned");
        }
        return this.getCategoryById(categoryID);
    }
    static async deleteCategory(catId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Categories where catid = @id`
        const request = connection.request();
        request.input("id",catId);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected > 0;
    }
}
module.exports = category;