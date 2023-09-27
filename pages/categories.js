import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal,showCancelButton } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory,setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categoryId,setCategoryId] = useState("");
    const [categories,setCategories] =useState([]);
    useEffect(()=>{
        fetchCategories();
    },[]);
    function fetchCategories(){
        axios.get("https://localhost:44374/api/Categories/getall").then(result => {
            setCategories(result.data);
         });
    }
    async function saveCategory(e){
      e.preventDefault();
      if(editedCategory){
        await axios.post("https://localhost:44374/api/Categories/update", {
          categoryName: name, categoryId:categoryId
        });
      } else{
        await axios.post("https://localhost:44374/api/Categories/add", {
        categoryName: name
      });}
      debugger
      setName("");
      fetchCategories();
    }
    function editCategory(category){
    setEditedCategory(category);
    setName(category.categoryName);
    setCategoryId(category.categoryId);
    }
   async function deleteCategory(category){
        swal
          .fire({
            title: "Emin misiniz ?",
            text: category.categoryName + "  silmek üzeresiniz ",
            showCancelButton: true,
            cancelButtonTitle: "Vazgeç",
            confirmButtonText: "Sil",
            reverseButton: true,
            confirmButtonColor: "#d55",
          })
          .then((result) => {
            axios.post("https://localhost:44374/api/Categories/delete", {
              categoryName: category.categoryName,
              categoryId: category.categoryId,
            });
            fetchCategories();
          });
        
    }
    return (
        
      <Layout>
        <h1>Kategoriler</h1>
        <label>
          {editedCategory ? 'Kategoriyi düzenle: '+editedCategory.categoryName : "Yeni Kategori Adı"}
        </label>
        <form onSubmit={saveCategory} className="flex gap-1">
          <input
            type="text"
            className="mb-0"
            placeholder={"Kategori Adı"}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {/* <select
            className="mb-0"
            onChange={(e) => setParentCategory(e.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
          </select> */}
          <button type="submit" className="btn-primary py-1">
            Kaydet
          </button>
        </form>
        <table className="basic mt-4">
          <thead>
            <td>Kategori Adı</td>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category.categoryId}>
                  <td>{category.categoryName}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                    >
                      Düzenle
                    </button>
                    <button
                    onClick={()=>deleteCategory(category)}
                     className="btn-primary">Sil</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    );
}

export default withSwal(({swal},ref)=> (
    <Categories swal={swal} />
));