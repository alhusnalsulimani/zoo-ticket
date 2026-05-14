import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, allowedRoles }) {
 const { role } = useSelector((state) => state.auth);
 // Not logged in → go to login
 if (!role) {
 return <Navigate to="/" />;
 }
 // Logged in but wrong role
 if (allowedRoles && allowedRoles !== role) {
 return <Navigate to="/" />;
 }
 // Authorized
 return children;
}
export default ProtectedRoute;