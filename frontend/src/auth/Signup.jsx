import { motion } from "framer-motion";
import styles from "./Signup.module.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;
    const displayName = e.target.name?.value || "";

    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update auth profile (optional)
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // 3. Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        displayName: displayName,
        photoURL: "",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        projects: [] // Initialize empty projects array
      });

      navigate("/"); // Redirect after successful signup

    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message.replace("Firebase: ", ""));
    }
  };

  return (
    <motion.div 
      className={styles.signupContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.formWrapper}>
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.title}
        >
          Create New Account
        </motion.h1>
        
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name (Optional)</label>
            <input 
              type="text" 
              id="name" 
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email*</label>
            <input 
              type="email" 
              id="email" 
              required 
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password* (min 6 characters)</label>
            <input 
              type="password" 
              id="password" 
              required 
              minLength="6"
              className={styles.inputField}
            />
          </div>
          
          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}