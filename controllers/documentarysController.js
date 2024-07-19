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
  const { title, documentary, docdate, image } = req.body;
  try {
    const rowAffected = await Documentary.updateDocByID(id, title, documentary, docdate, image);
    res.json(rowAffected);
  } catch (error) {
    console.error('Error updating documentary:', error);
    res.status(500).send("Error updating documentary");
  }
};

const createDoc = async (req, res) => {
  const { title, docdate, documentary } = req.body;
  const image = req.file ? `/public/images/documentary/${req.file.filename}` : null; // Adjust path as needed

  try {
    const newDoc = await Documentary.createDoc(title, documentary, docdate, image);
    res.status(201).json({ message: 'Documentary created successfully', documentary: newDoc });
  } catch (error) {
    console.error('Error creating documentary:', error);
    res.status(500).send('Error creating documentary');
  }
};

module.exports = {  
    getDocbyID,
    updateDocByID,
    getAllDocs,
    createDoc
};