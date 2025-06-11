// src/api/getFood.js
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getFoodData = async () => {
  try {
    const foodCollection = collection(db, "foods"); 
    const snapshot = await getDocs(foodCollection);

    const foodList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return foodList;
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
};
