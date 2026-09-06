import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export default function ProtectedRoute({ children, requiredRole, redirectTo = '/' }) {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
            </div>
        );
    }

    if (!keycloak?.authenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (requiredRole) {
        const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
        const hasRole = Array.isArray(requiredRole)
            ? requiredRole.some(role => roles.includes(role))
            : roles.includes(requiredRole);

        if (!hasRole) {
            return <Navigate to={redirectTo} replace />;
        }
    }

    return children ? children : <Outlet />;
}