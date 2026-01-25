// Add these imports in your actual file where you have your Firebase Config
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js";

// Utility function for better Alerts
const notify = (msg) => alert(msg); 

// ===== CREATOR AUTH =====
window.registerCreator = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        notify("Account Created Successfully! You can now login.");
    } catch (error) {
        notify("Error: " + error.message);
    }
}

window.loginCreator = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        window.location.href = "creator-dashboard.html";
    } catch (error) {
        notify("Invalid credentials. Please try again.");
    }
}

// ===== BRAND AUTH =====
window.loginBrand = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "brand-dashboard.html";
    } catch (error) {
        notify("Brand account not found.");
    }
}
