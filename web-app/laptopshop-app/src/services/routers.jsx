import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../shared/ui/HomePage.jsx';
import CardLayout from '../features/product/CardLayout.jsx';
import DashBoardApp from '../features/dashboard/Dashboard.jsx';
import Template from '../features/dashboard/Template.jsx';
import ProductMgmtView from '../features/dashboard/product/ProductMgmt.jsx';
import { ProductDashBoard, RolePermissionDashBoard } from './loaders.jsx';
import UserDashBoard from '../features/dashboard/user/UserMgmt.jsx';
import PermissionDashBoard from '../features/dashboard/role_permission/PermissionMgmt.jsx';
import RoleDashBoard from '../features/dashboard/role_permission/RoleMgmt.jsx';
import OrderDashBoard from '../features/dashboard/order/OrderMgmt.jsx';
import { UserDashboardLoader } from './loaders.jsx';
import { HomePageProducts } from './loaders.jsx';
import ProductDetailApp from '../features/product/ProductDetail.jsx';
import { productCache } from './ProductCache.js';
import { getInventoryById } from './InventoryService.js';
import { getProductById } from './ProductService.js';
import Cart from '../features/cart/Cart.jsx';
import { getCurrentCart } from './CartService.js';
const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: [
            {
                index: true,
                loader: async ({ request }) => {
                    const url = new URL(request.url);
                    const page = parseInt(url.searchParams.get('page') || 1, 10);
                    const size = parseInt(url.searchParams.get('size') || 20, 10);
                    const isDesc = url.searchParams.get('isDesc') == 'true';
                    return await HomePageProducts(page, size, isDesc);
                },
                element: <CardLayout />,
            },
            {
                path: '/products/:id',
                loader: async ({ params }) => {
                    const productId = params.id;

                    const cached = productCache.get(productId);
                    console.log(cached);

                    if (cached) {
                        console.log("product existed in cache -> return data");
                        return cached;
                    }
                    console.log('get data from db');

                    const inventory = await getInventoryById(productId);
                    const product = await getProductById(productId);
                    return {
                        product: product,
                        inventory: inventory
                    }
                },
                element: <ProductDetailApp />
            },
            {
                path: '/cart',
                loader: async () => {
                    return await getCurrentCart();
                },
                element: <Cart />
            }
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
                loader: async ({ request }) => {
                    const url = new URL(request.url);
                    const page = parseInt(url.searchParams.get('page') || '1', 10);
                    const size = parseInt(url.searchParams.get('size') || '8', 10);
                    return await UserDashboardLoader(page, size);
                },
                element: <UserDashBoard />
            },
            {
                path: 'roles',
                loader: async () => {
                    return await RolePermissionDashBoard();
                },
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
