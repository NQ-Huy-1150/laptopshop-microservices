import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../shared/ui/HomePage.jsx';
import CardLayout from '../features/product/CardLayout.jsx';
import DashBoardApp from '../features/dashboard/Dashboard.jsx';
import Template from '../features/dashboard/Template.jsx';
import ProductMgmtView from '../features/dashboard/product/ProductMgmt.jsx';
import { ProductDashBoard } from './loaders.jsx';
import UserDashBoard from '../features/dashboard/user/UserMgmt.jsx';
import PermissionDashBoard from '../features/dashboard/permission/PermissionMgmt.jsx';
import RoleDashBoard from '../features/dashboard/role/RoleMgmt.jsx';
import OrderDashBoard from '../features/dashboard/order/OderMgmt.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: [
            {
                index: true,
                element: <CardLayout />,
            },
        ],
    },
    {
        path: '/dashboard',
        element: <DashBoardApp />,
        children: [
            {
                index: true,
                element: <Template />
            },
            {
                path: 'products',
                loader: async ({ request }) => {
                    const url = new URL(request.url);
                    const page = parseInt(url.searchParams.get("page") || "1", 10);
                    const size = parseInt(url.searchParams.get("size") || "5", 10);
                    return await ProductDashBoard(page, size);
                },
                element: <ProductMgmtView />
            },
            {
                path: 'users',
                element: <UserDashBoard />
            },
            {
                path: 'permissions',
                element: <PermissionDashBoard />
            },
            {
                path: 'roles',
                element: <RoleDashBoard />
            },
            {
                path: 'orders',
                element: <OrderDashBoard />
            }
        ]
    }
]);

export default router;
