// src/components/AuthForm/AuthForm.jsx
import { motion } from "framer-motion";
import styles from "./AuthForm.module.scss";

export default function AuthForm({ onSubmit, title, buttonText }) {
  return (
    <motion.div
      className={styles.authForm}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonText}
        </motion.button>
      </form>
    </motion.div>
  );
}