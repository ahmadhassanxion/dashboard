import ProductDataTable from "./Components/ProductDataTable";
import AddProduct from "./Pages/AddProduct";
import hasPermission from "../../helper/PermissionCheck"
const Product = () => {
  const canAddProduct = hasPermission("products", "create");
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Products</h1>
   {canAddProduct &&     <AddProduct />}
      </div>
      <ProductDataTable />
    </div>
  );
};

export default Product;
