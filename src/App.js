import React, { useState, useEffect } from 'react';
import { saveDataToFirestore, fetchDataFromFirestore, deleteDocumentFromFirestore, updateDocumentInFirestore } from './crud'; // Import the functions from crud.js

function App() {
  const [fruitName, setFruitName] = useState('');
  const [description, setDescription] = useState('');
  const [storedValues, setStoredValues] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    fetchDataFromFirestore().then(data => setStoredValues(data));
  }, []);

  const handleSaveClick = async () => {
    await saveDataToFirestore(fruitName, description);
    setStoredValues([...storedValues, { fruitName, description }]);
    setFruitName('');
    setDescription('');
  };

  const handleEditClick = (id) => {
    setEditMode(true);
    setEditId(id);
    const itemToEdit = storedValues.find(item => item.id === id);
    setFruitName(itemToEdit.fruitName);
    setDescription(itemToEdit.description);
  };

  const handleUpdateClick = async () => {
    try {
      await updateDocumentInFirestore(editId, { fruitName, description });
      const updatedData = storedValues.map(item => {
        if (item.id === editId) {
          return { ...item, fruitName, description };
        }
        return item;
      });
      setStoredValues(updatedData);
      setEditMode(false);
      setFruitName('');
      setDescription('');
      alert('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    }
  };

  const handleDeleteClick = async (docId) => {
    await deleteDocumentFromFirestore(docId);
    const updatedData = storedValues.filter(item => item.id !== docId);
    setStoredValues(updatedData);
  };

  return (
    <div className="App">
      <h1>Firestore CRUD Demo</h1>
      <label>Fruit Name</label>
      &nbsp;
      <input
        type='text'
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
      />

      <br />

      <label>Description</label>
      &nbsp;
      <input
        type='text'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      {editMode ? (
        <button onClick={handleUpdateClick}>UPDATE</button>
      ) : (
        <button onClick={handleSaveClick}>SAVE</button>
      )}

      <br />

      <div>
        {storedValues.map((item, index) => (
          <div key={index}>
            <p>{item.fruitName}: {item.description}</p>
            <button onClick={() => handleEditClick(item.id)}>EDIT</button>
            &nbsp;
            <button onClick={() => handleDeleteClick(item.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
