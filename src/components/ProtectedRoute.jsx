import { Navigate } from "react-router-dom";
import { hasValidSession } from "../utils/api.js";

const ProtectedRoute = ({ children }) => {
  if (!hasValidSession()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
