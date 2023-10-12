import { data } from "autoprefixer";
import axios from "axios";
import { useRouter } from "next/router";
import { useDebugValue, useEffect, useState } from "react";
import Spinner from "./Spinner";


export default function ProductForm({
    productId,
  productName: existingProductName,
  description: existingDescription,
  price: existingPrice,
  unitInStock: existingStok,
  imageURL:existingImageURL,
  category:assignedCategory,
}) {
  const [productName, setProductname] = useState(existingProductName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category,setCategory] = useState(assignedCategory||'');
  const [price, setPrice] = useState(existingPrice || "");
  const [imageURL,setImageBase64] = useState(existingImageURL||'');
  const [unitInStock, setUnitInStock] = useState(existingStok || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(()=>{
    axios.get("https://localhost:44374/api/Categories/getall").then(result => {
      setCategories(result.data);
   });
  },[])
  async function saveProduct(e) {
    e.preventDefault();
    const data = {
        productName,
        description,
        price,
        unitInStock: unitInStock,
        categoryId: category,
        imageURL:imageURL,
      };
      
    if(productId){
        //update
        await axios.post("https://localhost:44374/api/Products/update", {...data,productId});    
    } else{
      //create

      await axios.post("https://localhost:44374/api/Products/add", data );
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(e) {
    const file = e.target.files[0];
    setisUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target.result);
    };
    reader.readAsDataURL(file);
    setisUploading(false);    

  }

  return (
    <form onSubmit={saveProduct}>
      <label>Ürün İsmi</label>
      <input
        type="text"
        minLength={2}
        required
        placeholder="Ürün ismi"
        value={productName}
        onChange={(e) => setProductname(e.target.value)}
      />
      <label>Ürün Kategorisi</label>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option >Kategori Seçin</option>
        {categories.length>0 &&categories.map(c =>(
          <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
        ))}
      </select>
      <label>Ürün fotoğrafı</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <img src={imageURL} alt="" className="rounded-lg h-24" />
        {isUploading && (
          <div className="h-24 p-1flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Yükle</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!imageURL?.length && <div>Ürünün fotoğrafı bulunmuyor</div>}
      </div>
      <label>Ürün Hakkında</label>
      <textarea
        placeholder="Ürün Hakkında"
        required
        minLength={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Fiyat</label>
      <input
        type="number"
        required
        placeholder="Fiyat"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <label>Stok</label>
      <input
        type="number"
        required
        placeholder="Stok"
        value={unitInStock}
        onChange={(e) => setUnitInStock(e.target.value)}
      />  
      <button type="submit" className="btn-primary">
        Kaydet
      </button>
    </form>
  );
}