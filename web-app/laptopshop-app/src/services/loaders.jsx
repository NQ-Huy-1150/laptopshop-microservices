import { fetchAll as fetchAllBrand } from "./BrandService";
import { fetchAllWithPagination as fetchAllProduct } from './ProductService.js';
import { fetchAll as fetchAllCategory } from "./CategoryService";
import { fetchAll as fetchAllInventory } from "./InventoryService.js";
import { fetchAll as fetchAllPermissions } from "./PermissionService.js";
import { fetchAll as fetchAllRoles } from "./RoleService.js";

export const ProductDashBoard = async (page = 1, size = 5) => {
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