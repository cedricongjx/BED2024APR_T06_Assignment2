const Documentary = require('../models/documentary');

const getAllDocs = async (req, res) =>{
  try{
    const docs = await Documentary.getAllDocs();
    res.json(docs);
  }catch(error){
    console.log(error);
    res.status(500).send("error retreiving documentarises");
  }
};
const getDocbyID = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const Doc = await Documentary.getDocbyID(id);
      res.json(Doc);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving book");
    }
};

const updateDocByID = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, documentary, docdate, doccategory } = req.body;
  let image = req.file ? `/images/documentary/${req.file.filename}` : null;

  if (!image && req.body.image) {
    image = req.body.image; // Use the existing image URL if no new file is uploaded
  }
  try {
    const doc = await Documentary.updateDocByID(id, title, documentary, docdate, image, doccategory);
    res.json(doc);
  } catch (error) {
    console.error('Error updating documentary:', error);
    res.status(500).send("Error updating documentary");
  }
};

const createDoc = async (req, res) => {
  const { title, docdate, documentary, doccategory } = req.body;
  const image = req.file ? `/public/images/documentary/${req.file.filename}` : null; // Adjust path as needed

  try {
    const newDoc = await Documentary.createDoc(title, documentary, docdate, image, doccategory);
    res.status(201).json({ message: 'Documentary created successfully', documentary: newDoc });
  } catch (error) {
    console.error('Error creating documentary:', error);
    res.status(500).send('Error creating documentary');
  }
};

const deleteDocByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const rowsAffected = await Documentary.deleteDocByID(id);
    if (rowsAffected > 0) {
      res.send("Documentary updated successfully");
    } else {
      res.status(404).send("Documentary not found");
    }
  } catch (error) {
    console.error('Error deleting documentary:', error);
    res.status(500).send("Error deleting documentary");
  }
};

const getDocsbyCat = async (req, res) => {
  const doccategory = req.params.doccategory;
  try {
    const Docs = await Documentary.getDocsbyCat(doccategory);
    res.json(Docs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving book");
  }
};

module.exports = {  
    getDocbyID,
    updateDocByID,
    getAllDocs,
    createDoc,
    deleteDocByID,
    getDocsbyCat
};