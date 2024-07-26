const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class Review {
  constructor(reviewid, docid, review, stars, date, userid) {
    this.reviewid = reviewid;
    this.docid = docid;
    this.review = review;
    this.stars = stars;
    this.date = date;
    this.userid = userid;
  }


  static async getReviewbyID(reviewid) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    SELECT * from review where reviewid = @id
    `;
    const request = connection.request();
    request.input('id', reviewid);
    const result = await request.query(query);
    return result.recordset[0]
    ? new Review(
        result.recordset[0].reviewid,
        result.recordset[0].docid,
        result.recordset[0].review,
        result.recordset[0].stars,
        result.recordset[0].date,
        result.recordset[0].userid
    )
    :null;
    } catch (error) {
    console.error('Error getting review:', error);
    throw error;
    } finally {
    await connection.close();
    }
  }

  static async getReviewsbyDoc(docid) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    SELECT r.reviewid, r.docid, r.review, r.stars, r.date, u.username 
    from Review r inner join Users u on r.userid = u.userid
    where docid = @id
    `;
    const request = connection.request();
    request.input('id', docid);
    const result = await request.query(query);
    return result.recordset.map(row => ({
        reviewid: row.reviewid,
        docid: row.docid,
        review: row.review,
        stars: row.stars,
        date: row.date,
        username: row.username
    }));
    } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
    } finally {
    await connection.close();
    }
  }

  static async createReview(docid, review, stars, date, userid) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    INSERT into Review(docid, review, stars, date, userid) values (@docid, @review, @stars, @date, @userid) select scope_identity() AS reviewid`;
    ;
    const request = connection.request();
    request.input('docid', sql.Int, docid);
    request.input('review', sql.NVarChar, review);
    request.input('stars', sql.Int, stars);
    request.input('date', sql.Date, date);
    request.input('userid', sql.Int, userid)
    const result = await request.query(query);
    const reviewid = result.recordset[0].reviewid;
    return this.getReviewbyID(reviewid);
    } catch (error) {
    console.error('Error creating review:', error);
    throw error;
    }
  }

  static async createdReview(docid, userid){
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    select * from Review where docid = @docid and userid = @userid`;
    ;
    const request = connection.request();
    request.input('docid', sql.Int, docid);
    request.input('userid', sql.Int, userid)
    const result = await request.query(query);
    return result.recordset.length > 0;
    } catch (error) {
    console.error('Error creating review:', error);
    throw error;
    }

  }
  
  static async getAverageStar(docid) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    SELECT AVG(stars) as avgStars from review where docid = @id
    `;
    const request = connection.request();
    request.input('id', docid);
    const result = await request.query(query);
    
    return result.recordset[0].avgStars !== null ? result.recordset[0].avgStars : null;

    
    } catch (error) {
    console.error('Error getting review:', error);
    throw error;
    } finally {
    await connection.close();
    }
  }

  static async getNumberofReviews(docid) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    SELECT count(*) as total from review where docid = @id
    `;
    const request = connection.request();
    request.input('id', docid);
    const result = await request.query(query);
    
    return result.recordset[0].total !== null ? result.recordset[0].total : null;

    
    } catch (error) {
    console.error('Error getting review:', error);
    throw error;
    } finally {
    await connection.close();
    }
  }


}

module.exports = Review;