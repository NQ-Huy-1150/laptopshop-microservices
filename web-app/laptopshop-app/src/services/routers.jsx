import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../shared/ui/HomePage.jsx';
import CardLayout from '../features/product/CardLayout.jsx';
import DashBoardApp from '../features/dashboard/Dashboard.jsx';
import Template from '../features/dashboard/Template.jsx';
import ProductMgmtView from '../features/dashboard/product/ProductMgmt.jsx';
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
                element: <ProductMgmtView />
            }
        ]
    }
]);

export default router;
