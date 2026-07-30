import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../shared/ui/HomePage.jsx';
import CardLayout from '../features/product/CardLayout.jsx';

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
]);

export default router;
