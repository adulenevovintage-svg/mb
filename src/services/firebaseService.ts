import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Reservation } from "../types";

export const firebaseService = {
  async createBooking(data: Reservation) {
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        ...data,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        clientTimestamp: Date.now()
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, "bookings");
      throw e;
    }
  },

  listenToBookings(callback: (data: any[]) => void, errorCallback: (err: any) => void) {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    }, (err) => {
      try {
        handleFirestoreError(err, OperationType.GET, "bookings");
      } catch (e) {
        // Error is already logged by handleFirestoreError
      }
      errorCallback(err);
    });
  },

  async cancelBooking(bookingId: string) {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled'
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `bookings/${bookingId}`);
      throw e;
    }
  }
};
