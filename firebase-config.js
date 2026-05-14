/**
 * إعدادات تطبيق الويب — من Firebase Console.
 * احصرِ المفتاح بنطاقاتك من Google Cloud (HTTP referrers) لأمان أفضل.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyD5_gkAcElxVVVs9mHoAW0obcwctxpr_Zc",
  authDomain: "grag-6d32d.firebaseapp.com",
  projectId: "grag-6d32d",
  storageBucket: "grag-6d32d.firebasestorage.app",
  messagingSenderId: "543434444747",
  appId: "1:543434444747:web:d96f44523197621640f04e",
  measurementId: "G-V7YFMMH84H",
};

export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}
