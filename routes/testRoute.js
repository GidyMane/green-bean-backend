const express = require("express");
const router = express.Router();
const { doc, setDoc, addDoc, collection, getDocs, getDoc, deleteDoc, query, where } = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// retrieves page and displays the list of data
router.get('/', async (req, res) => {
  try{
    const getData =  collection(fireStoredb, 'test2');
    const dataSnap = await getDocs(getData);
    const documents = dataSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(documents);

    res.render('testing/index', { title: 'Setup', data: documents });
    
  } catch (err){
    console.log("data not showing")
  }
});
 // filters the data by setting a value for key1
router.get('/search', async(req, res) =>{
 const { searchVal } = req.query;
 try {
   const itemsRef = collection(fireStoredb, "test2");
    const q = query(itemsRef, where("key1", "==", searchVal));
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(results);
    // Render the search page and pass in the results to display
    res.render("testing/results", { title: "Search Results", results });
  }catch(error){
  console.error("Error fetching documents:", error);
  res.status(500).send("Error retrieving data");
 }
});

// add an item to the test2 collection for firestore
router.post("/post", async (req, res) => {
  const data = {
    key1: req.body.key1,
    key2: req.body.key2,
  };
  try {
    const docRef = await addDoc(collection(fireStoredb, "test2"), data);
    res.redirect('/api/testing')
  } catch (error) {
    console.error("Error uploading data to Firebase:", error);
    res.status(500).send("Failed to upload data to Firebase.");
  }
});

//gets information of the specific item of the collection
router.get('/edit/:id', async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try{
    const getItem=  doc(fireStoredb, 'test2', id);
    const itemSnap = await getDoc(getItem);
    const itemData = itemSnap.data();
    console.log(itemData);
    res.render('testing/display', { title: 'Setup', data: itemData });
    
  } catch (err){
    console.log("data not showing")
  }
});

//change value of the item
router.post('/edit/:id', async (req, res) => {
  let getId = req.params.id;
  const data = {
    key1: req.body.key1,
    key2: req.body.key2,
  };
  try{
    const document = doc(fireStoredb, "test2", getId);
    await setDoc(document, data);
    console.log(data);
    res.redirect('/api/testing')
    
  } catch (err){
    console.log("data not showing")
  }
});

//delete the item from the collection
router.get('/delete/:id',  async (req, res) => {
  let getId = req.params.id;
  try{
    await deleteDoc(doc(fireStoredb, "test2", getId));
    res.redirect('/api/testing')
  } catch (err){
    console.log("data did not delete")
  }
})



module.exports = router;
