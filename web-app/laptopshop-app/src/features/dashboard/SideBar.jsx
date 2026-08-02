import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function SideNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        {
            label: "Tổng quan",
            path: "/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
            )
        },
        {
            label: "Sản phẩm",
            path: "/dashboard/products",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1z"/>
                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                </svg>
            )
        },
        {
            label: "Đơn hàng",
            path: "/dashboard/orders",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5"/>
                </svg>
            )
        },
        {
            label: "Người dùng",
            path: "/dashboard/users",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A4.001 4.001 0 0 1 11 11c2.65 0 4.135 1.52 4.97 3h-10.97ZM11 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
                </svg>
            )
        },
        {
            label: "Vai trò (Roles)",
            path: "/dashboard/roles",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.072 1.199a.75.75 0 0 1 .744.068l4.47 3.353a.75.75 0 0 1 .286.593v6.574a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V5.213a.75.75 0 0 1 .286-.593l4.47-3.353a.75.75 0 0 1 .474-.068Z"/>
                </svg>
            )
        },
        {
            label: "Quyền hạn",
            path: "/dashboard/permissions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10H7.465A4 4 0 0 1 0 8zm4-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                </svg>
            )
        }
    ];

    return (
        <aside className="dashboard-sidebar d-flex flex-column p-3">
            <div className="dashboard-brand mb-4">
                <span className="p-2 bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
                    </svg>
                </span>
                <div>
                    <div className="fw-bold fs-5 text-dark" style={{ lineHeight: 1.2 }}>LaptopShop</div>
                    <small className="text-muted fs-7">Admin Management</small>
                </div>
            </div>

            <Nav className="flex-column gap-1 w-100">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </Nav>

            <div className="mt-auto pt-4 border-top">
                <Link to="/" className="sidebar-link text-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                    <span>Quay lại cửa hàng</span>
                </Link>
            </div>
        </aside>
    );
}