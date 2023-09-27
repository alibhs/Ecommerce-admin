import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage(){
    const [productInfo,setProductInfo] = useState(null);
    const router = useRouter();
    const {productId} = router.query;
    useEffect(() => {
      if(!productId){
        return;
      }
        axios
        .get(
          "https://localhost:44374/api/Products/getById?productId=" + productId
        )
        .then((response) => {
         setProductInfo(response.data);
        });
    }, [productId]);
    return (
        <Layout>
          <h1>Ürün Düzenle</h1>
          {productInfo && (
           <ProductForm {...productInfo}/>
          )}
        </Layout>
    )
}