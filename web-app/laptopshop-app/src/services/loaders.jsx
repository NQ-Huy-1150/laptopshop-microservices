import { fetchAll as fetchAllBrand } from "./BrandService";
import { fetchAll as fetchAllProduct } from './ProductService.js';
import { fetchAll as fetchAllCategory } from "./CategoryService";
import { fetchAll as fetchAllInventory } from "./InventoryService.js";
export const ProductDashBoard = async () => {
    try {
        const productList = await fetchAllProduct();
        const brandList = await fetchAllBrand();
        const categoryList = await fetchAllCategory();
        const inventoryList = await fetchAllInventory();
        const payload = {
            products: productList,
            brands: brandList,
            categories: categoryList,
            inventories: inventoryList
        }
        console.info('payload : ');
        console.info(payload);
        return payload ? payload : null;
    } catch (error) {
        console.error(`Fail to retrieve data for Dashboard-Product : ${error}`)
        return null;
    }
}