import Layout from "@/components/Layout";
import { useEffect,useState } from "react";
import axios from "axios";

export default function OrdersPage(){

    const [products,setProducts] = useState([]);
    const [orders,setOrders] = useState([]);
    const [orderDetails,setOrderDetails] = useState([]);
    const [address,setAddress] = useState([]);
    useEffect(()=>{
        axios.get("https://localhost:44374/api/Products/getAll").then(response =>{
        setProducts(response.data);
    });
    },[]);
    useEffect(()=>{
        axios.get('https://localhost:44374/api/AddressControler/getall').then(response =>{
        setAddress(response.data);
    });
    },[]);
    useEffect(()=>{
        axios.get("https://localhost:44374/api/Order/getAll").then(response =>{
        setOrders(response.data);
    });
    },[]);
    useEffect(()=>{
        axios.get("https://localhost:44374/api/OrderDetails/getAll").then(response =>{
        setOrderDetails(response.data);
    });
    },[]);

    let productName = [];
    for(const orderDetail of orderDetails){
        const currentProd = products.find(p=> p.productId === orderDetail.productId)?.productName;
        productName.push(currentProd);
    }

    let orderQuantity = [];
    for(const product of products){
        const currentProd = orderDetails.find(x=>x.productId === product.productId)?.quantity;
        orderQuantity.push(currentProd);
    }

    let productQuantities = [];
    for (let i = 0; i < productName.length; i++) {
        productQuantities.push(`${productName[i]} x ${orderQuantity[i]} Adet  ||  `);
    }


    return(
        <Layout>
            <h1>Siparişler</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Alıcı</th>
                        <th>Ürünler</th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
          <tr key={order._id}>
            <td>{(new Date(order.orderDate)).toLocaleString()}
            </td>
            <td>
            {address.find(x=> x.addressId === order.addressId)?.fullName} &nbsp;
            {address.find(x=> x.addressId === order.addressId)?.email}<br />
            {address.find(x=> x.addressId === order.addressId)?.country} &nbsp;
            {address.find(x=> x.addressId === order.addressId)?.city}<br />
            {address.find(x=> x.addressId === order.addressId)?.postalCode} &nbsp;
            {address.find(x=> x.addressId === order.addressId)?.phoneNumber}
            </td>
            <td>
                <td>{productQuantities}</td>
            </td>
          </tr>
        ))}
                </tbody>
            </table>
        </Layout>
    )
}