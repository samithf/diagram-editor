import { db } from "@/firebaseConfig";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import type { User } from "@/types";

export class UserService {
  static async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
}
