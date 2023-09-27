import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo,setProductInfo] = useState();
    const {productId} = router.query;
    useEffect(() => {
        if(!productId){
          return;
        }
          axios
            .get(
              "https://localhost:44374/api/Products/getById?productId=" +
                productId
            )
            .then((response) => {
              setProductInfo(response.data);
            });
      }, [productId]);
    function goBack(){
        router.push('/products');
    }
    async function deleteProduct(){
        await axios.post("https://localhost:44374/api/Products/delete",{...productInfo});
        goBack();
    }
   return (
     <Layout>
       <h1 className="text-center"> 
         Ürünü silmek istediğinizden emin misiniz &nbsp;
         {productInfo?.productName}?
       </h1>
       <div className="flex gap-3 justify-center">
         <button className="btn-red" onClick={deleteProduct}>Sil</button>
         <button className="btn-default" onClick={goBack}>
           Vazgeç
         </button>
       </div>
     </Layout>
   );
}