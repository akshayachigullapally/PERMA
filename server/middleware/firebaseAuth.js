import admin from "firebase-admin";

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect: Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default verifyFirebaseToken;
