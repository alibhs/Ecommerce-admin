import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [address, setAddress] = useState([]);
  useEffect(() => {
    axios
      .get("https://localhost:44374/api/Products/getAll")
      .then((response) => {
        setProducts(response.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get("https://localhost:44374/api/AddressControler/getall")
      .then((response) => {
        setAddress(response.data);
      });
  }, []);
  useEffect(() => {
    axios.get("https://localhost:44374/api/Order/getAll").then((response) => {
      setOrders(response.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get("https://localhost:44374/api/OrderDetails/getAll")
      .then((response) => {
        setOrderDetails(response.data);
      });
  }, []);

  let productName = [];
  let orderQuantity = [];
  let orderId = [];
  const orderProductDetails = [];

  for (let i = 0; i < productName.length; i++) {
    const productDetail = {
      orderId: orderId[i],
      productName: productName[i],
      orderQuantity: orderQuantity[i],
    };
    orderProductDetails.push(productDetail);
  }

  const orderProductInfosArray = (orders, orderDetails, products) => {
    const orderProductDetails = [];

    orders.forEach((order) => {
      const orderId = order.orderId;

      const orderDetailsForOrder = orderDetails.filter(
        (detail) => detail.orderId === orderId
      );

      orderDetailsForOrder.forEach((orderDetail) => {
        const productId = orderDetail.productId;

        const product = products.find(
          (product) => product.productId === productId
        );

        if (product) {
          const orderItem = {
            orderId: orderId,
            productName: product.productName,
            orderQuantity: orderDetail.quantity,
          };

          orderProductDetails.push(orderItem);
        }
      });
    });

    return orderProductDetails;
  };

  const orderProductInfos = orderProductInfosArray(
    orders,
    orderDetails,
    products
  );

  return (
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
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  {
                    address.find((x) => x.addressId === order.addressId)
                      ?.fullName
                  }
                  &nbsp;
                  {address.find((x) => x.addressId === order.addressId)?.email}
                  <br />
                  {
                    address.find((x) => x.addressId === order.addressId)
                      ?.country
                  }
                  &nbsp;
                  {address.find((x) => x.addressId === order.addressId)?.city}
                  <br />
                  {
                    address.find((x) => x.addressId === order.addressId)
                      ?.postalCode
                  }
                  &nbsp;
                  {
                    address.find((x) => x.addressId === order.addressId)
                      ?.phoneNumber
                  }
                </td>
                <td>
                  <td>
                    {orderProductInfos
                      .filter((x) => x.orderId === order.orderId)
                      .map((productInfo) => (
                        <div key={productInfo.productId}>
                          {productInfo.productName}&nbsp;
                          x&nbsp;
                          {productInfo.orderQuantity}&nbsp;
                          Adet
                        </div>
                      ))}
                  </td>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
