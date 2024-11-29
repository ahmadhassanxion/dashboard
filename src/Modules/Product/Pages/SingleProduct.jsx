import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axios";
import { useDispatch } from "react-redux";
import { updateProduct } from "../SingleProductSlice";
import SingleProductTopeSection from "../Components/SingleProductTopeSection";
import SingleProductGridSection from "../Components/SingleProductGridSection";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/products/singleProduct/${id}`
        );
        dispatch(updateProduct(response.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchSingleProduct();
  }, [id, dispatch]);

  return (
    <div className="p-4  min-h-screen">
      {/* Top Section */}
    <SingleProductTopeSection/>

      <SingleProductGridSection/>
      
    </div>
  );
};

export default SingleProduct;
