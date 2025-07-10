// admin-panel/src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return setIsAllowed(false);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      setIsAllowed(data?.role === "admin");
    };

    checkAdmin();
  }, []);

  if (isAllowed === null) return <p>Loading...</p>;
  if (!isAllowed) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
