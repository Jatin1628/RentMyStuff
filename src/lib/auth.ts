import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createUserIfNotExists } from "./user";

const provider = new GoogleAuthProvider();

// Force account chooser every time
provider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);

  // Create Firestore user if first login
  await createUserIfNotExists(result.user);

  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};
