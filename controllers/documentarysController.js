const Documentary = require('../models/documentary');

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
  const { title, docdate, documentary, image } = req.body;
  try {
    const rowsAffected = await Documentary.updateDocByID(id, title, docdate, documentary, image);
    if (rowsAffected > 0) {
      res.send("Documentary updated successfully");
    } else {
      res.status(404).send("Documentary not found");
    }
  } catch (error) {
    console.error('Error updating documentary:', error);
    res.status(500).send("Error updating documentary");
  }
};

module.exports = {  
    getDocbyID,
    updateDocByID
};