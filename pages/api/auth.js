import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
  const { email, password, type } = req.body;

  try {
    let userCredential;

    if (type === "register") {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } else if (type === "login") {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      return res.status(400).json({ error: "Invalid request type" });
    }

    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}