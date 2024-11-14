const express = require("express");
const router = express.Router();
const {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
} = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// Fetch a list of arenas
router.get("/", async (req, res) => {
  try {
    const arenasRef = collection(fireStoredb, "arenas");
    const snapshot = await getDocs(arenasRef);
    const arenas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(arenas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch arenas", error: error.message });
  }
});

// Fetch an arena based on its document ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const arenaRef = doc(fireStoredb, "arenas", id); // Reference to the arena document by its document ID
    const arenaSnap = await getDoc(arenaRef);

    if (!arenaSnap.exists()) {
      return res.status(404).json({ message: "No arenas found for this id" });
    }

    // If the arena exists, return its data
    const arena = { id: arenaSnap.id, ...arenaSnap.data() };
    res.status(200).json(arena);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch arena by id",
      error: error.message,
    });
  }
});

// Fetch a arena based of location
router.get("/location/:location", async (req, res) => {
  try {
    const { location } = req.params;
    const arenasRef = collection(fireStoredb, "arenas");
    const q = query(arenasRef, where("location", "==", location));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No arenas found for this location" });
    }

    const arenas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(arenas);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch arena by location",
      error: error.message,
    });
  }
});

// Fetch arenas booked by a specific user based on first and last name
router.get("/booked/:firstName/:lastName", async (req, res) => {
  const { firstName, lastName } = req.params; // Get first and last name from request parameters

  try {
    const arenasRef = collection(fireStoredb, "arenas");
    const q = query(
      arenasRef,
      where("isBooked.firstName", "==", firstName),
      where("isBooked.lastName", "==", lastName)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No arenas booked by this user" });
    }

    const arenas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Get matching arenas
    res.status(200).json(arenas);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch arenas booked by user",
      error: error.message,
    });
  }
});

// Fetch arena ID based on arena name
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const arenasRef = collection(fireStoredb, "arenas");
    const q = query(arenasRef, where("name", "==", name));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No arena found with this name" });
    }

    const arena = snapshot.docs[0];
    const arenaId = arena.id;

    res.status(200).json({ arenaId });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch arena ID by name",
      error: error.message,
    });
  }
});

// Fetch all available arenas
router.get("/available", async (req, res) => {
  try {
    const arenasRef = collection(fireStoredb, "arenas");

    // Query for arenas where isBooked is an empty object or null
    const q = query(arenasRef, where("isBooked", "==", {})); // Adjust if you use a different condition for unbooked arenas
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No unbooked arenas found" });
    }

    const unbookedArenas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(unbookedArenas);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch unbooked arenas",
      error: error.message,
    });
  }
});

// Post a new arena
router.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      isPublic,
      description,
      capacity,
      sport,
      image,
      rate,
      rating,
      isBooked = {},
    } = req.body;

    if (!name || !location || !address || isPublic === undefined) {
      return res.status(400).json({
        message: "Name, location, address, and isPublic are required",
      });
    }

    const newArenaRef = doc(collection(fireStoredb, "arenas"));
    await setDoc(newArenaRef, {
      name,
      location,
      address,
      isPublic,
      description,
      sport,
      capacity: capacity || 0,
      image: image || "",
      rate: rate || 0,
      rating: rating || 0,
      isBooked,
    });

    res
      .status(201)
      .json({ message: "Arena added successfully", id: newArenaRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add arena", error: error.message });
  }
});

module.exports = router;
