import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "./firebaseConfig";

const db = getFirestore();

export const saveDataToFirestore = async (fruitName, description) => {
  const docRef = await addDoc(collection(db, "myCollection"), {
    fruitName: fruitName,
    description: description,
  });
  return docRef.id; // Return the ID of the added document if needed
};

export const fetchDataFromFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, "myCollection"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocumentFromFirestore = async (docId) => {
  await deleteDoc(doc(db, "myCollection", docId));
};

export const updateDocumentInFirestore = async (docId, newData) => {
  await updateDoc(doc(db, "myCollection", docId), newData);
};
