const express = require("express");
const router = express.Router();
const {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// Fetch all the bookings
router.get("/", async (req, res) => {
  try {
    const bookingsRef = collection(fireStoredb, "bookings");
    const snapshot = await getDocs(bookingsRef);
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
});

// Fetch booking by first and last name
router.get("/user", async (req, res) => {
  const { firstName, lastName } = req.query;

  try {
    const bookingsRef = collection(fireStoredb, "bookings");
    const q = query(
      bookingsRef,
      where("firstName", "==", firstName),
      where("lastName", "==", lastName)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking by name",
      error: error.message,
    });
  }
});

// Add a new booking
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      date,
      time,
      isRepeat,
      paymentInfo,
      arenaId,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !date ||
      !time ||
      !arenaId
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Fetch the specified arena to check availability
    const arenaRef = doc(fireStoredb, "arenas", arenaId);
    const arenaSnap = await getDoc(arenaRef);

    // Check if the arena exists and is available
    if (
      !arenaSnap.exists() ||
      (arenaSnap.data().isBooked &&
        Object.keys(arenaSnap.data().isBooked).length > 0)
    ) {
      return res
        .status(400)
        .json({ message: "The specified arena is not available right now" });
    }

    // Create a new booking in Firestore
    const newBookingRef = doc(collection(fireStoredb, "bookings"));
    await setDoc(newBookingRef, {
      firstName,
      lastName,
      phoneNumber,
      email,
      date,
      time,
      isRepeat: isRepeat || null,
      paymentInfo: paymentInfo || {},
      arenaId: arenaId,
    });

    // Update the arena with user booking information
    await setDoc(
      arenaRef,
      {
        isBooked: {
          firstName,
          lastName,
          bookingId: newBookingRef.id,
        },
      },
      { merge: true }
    ); // Use merge to keep existing arena data

    res
      .status(201)
      .json({ message: "Booking created successfully", id: newBookingRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
});

module.exports = router;
