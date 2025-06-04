import { motion } from "framer-motion";
import styles from "./Login.module.scss";
import { signInWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login timestamp
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginAt: serverTimestamp()
      });

      navigate("/"); // Redirect to dashboard

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message.replace("Firebase: ", ""));
    }
  };

  return (
    <motion.div 
      className={styles.loginContainer}
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
          Welcome Back
        </motion.h1>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              required 
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              required 
              className={styles.inputField}
            />
          </div>
          
          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}