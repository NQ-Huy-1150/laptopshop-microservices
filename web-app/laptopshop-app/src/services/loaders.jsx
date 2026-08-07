import { fetchAll as fetchAllBrand } from "./BrandService";
import { fetchAllWithPagination as fetchAllProduct } from './ProductService.js';
import { fetchAll as fetchAllCategory } from "./CategoryService";
import { fetchAll as fetchAllInventory } from "./InventoryService.js";
import { fetchAll as fetchAllPermissions } from "./PermissionService.js";
import { fetchAll as fetchAllRoles } from "./RoleService.js";
import { fetchAll as fetchAllUsers } from "./UserDashboardService.js";
export const ProductDashBoard = async (page = 1, size = 8) => {
    try {
        const productData = await fetchAllProduct(page, size, null);
        const brandList = await fetchAllBrand();
        const categoryList = await fetchAllCategory();
        const inventoryList = await fetchAllInventory();

        return {
            products: productData,
            brands: brandList,
            categories: categoryList,
            inventories: inventoryList
        };
    } catch (error) {
        console.error(`Fail to retrieve data for Dashboard-Product: ${error?.response?.data}`);
        throw error;
    }
};
export const RolePermissionDashBoard = async () => {
    try {
        const roles = await fetchAllRoles();
        const permissions = await fetchAllPermissions();
        return {
            roles: roles,
            permissions: permissions
        };
    } catch (error) {
        console.error(`Fail to retrieve data for Roles-Permissions: ${error?.response?.data}`);
        throw error;
    }
}
export const UserDashboardLoader = async (page = 1, size = 5) => {
    try {
        const roles = await fetchAllRoles();
        const users = await fetchAllUsers(page, size);
        return {
            roles: roles,
            users: users
        };
    } catch (error) {
        console.error(`Fail to retrieve data for Roles-Permissions: ${error?.response?.data}`);
        throw error;
    }
}
export const HomePageProducts = async (page = 1, size = 20, isDesc = false) => {
    try {
        const productData = await fetchAllProduct(page, size, isDesc);
        const inventoryData = await fetchAllInventory();
        console.log(productData);
        console.log(inventoryData);
        return {
            products: productData,
            inventories: inventoryData
        }
    } catch (error) {
        console.error(error?.response?.data);
        throw error;
    }
}