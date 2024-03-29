import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './Navbar';
import './Billing.css';
import { Link } from 'react-router-dom';
const Counter = () => {
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState();
  const [mrp, setMRP] = useState();
  const [fetchedItems, setFetchedItems] = useState([]);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleMRPChange = (e) => {
    setMRP(e.target.value);
  };

  const handleAddItem = () => {
    const newItem = {
      productName,
      quantity: parseInt(quantity),
      mrp: parseFloat(mrp),
      total: parseInt(quantity) * parseFloat(mrp),
    };

    axios.post('http://127.0.0.1:8080/api/billing', newItem)
      .then((response) => {
        setItems([...items, response.data]);
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });

    setProductName('');
    setQuantity('');
    setMRP('');
  };

  const handleDeleteItem = (index, id) => {
    if (index >= items.length) {
      axios.delete(`http://127.0.0.1:8080/api/billing/${id}`)
        .then(() => {
          setFetchedItems((prevItems) => prevItems.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    }

    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // const handleUpdateItem = (index, id) => {
  //   const updatedItem = items[index];
  //   axios.put(`http://127.0.0.1:8080/api/billing/${id}`, updatedItem)
  //     .then(() => {
  //       setFetchedItems((prevItems) => {
  //         const updatedItems = [...prevItems];
  //         updatedItems[index] = updatedItem;
  //         return updatedItems;
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error updating item:', error);
  //     });
  // };

  useEffect(() => {
    axios.get('http://127.0.0.1:8080/api/billings')
      .then((response) => {
        const itemsWithTotal = response.data.map((item) => ({
          ...item,
          total: item.quantity * item.mrp,
        }));
        setFetchedItems(itemsWithTotal);
      })
      .catch((error) => {
        console.error('Error fetching billing items:', error);
      });
  }, []);

  const calculateTotal = () => {
    let totalAmount = 0;

    items.forEach((item) => {
      totalAmount += item.total;
    });

    fetchedItems.forEach((item) => {
      totalAmount += item.total;
    });

    return totalAmount.toFixed(2);
  };

  return (
    <div>
      <Nav />
      <div className='Billing'>
        <h1 style={{ padding: '50px', color: 'white' }}>Billing</h1>
        <div className='billingform'>
          <input
            type='text'
            placeholder='Product Name'
            value={productName}
            onChange={handleProductNameChange}
          />
          <input
            type='number'
            placeholder='Quantity'
            value={quantity}
            onChange={handleQuantityChange}
          />

          <input
            type='number'
            step='0.01'
            placeholder='MRP'
            value={mrp}
            onChange={handleMRPChange}
          />

          <button
            style={{ backgroundColor: 'red', borderRadius: '5px', marginLeft: '10px' }}
            onClick={handleAddItem}
          >
            Add Item
          </button>
          <div style={{ marginLeft: '850px', fontSize: '20px', color: 'white', marginTop: '-45px' }}>
            Total: Rs {calculateTotal()}
          </div>
        </div>
        <div className='billing2'>
          <table>
            <thead>
              <tr className='billing3'>
                <th>Product Name</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='billing4'>
              {items.map((item, index) => (
                <tr key={index} className='billing3'>
                  <td style={{ color: 'white', background: 'black' }}>{item.productName}</td>
                  <td style={{ color: 'white', background: 'black' }}>Rs {item.mrp}</td>
                  <td style={{ color: 'white', background: 'black' }}>{item.quantity}</td>
                  <td style={{ color: 'white', background: 'black' }}>Rs {item.total}</td>
                  <td style={{ color: 'white', background: 'black' }}>
                    <button
                      style={{ background: 'red', borderRadius: '5px' }}
                      onClick={() => handleDeleteItem(index, item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {fetchedItems.map((item, index) => (
                <tr key={index + items.length} className='billing3'>
                  <td style={{ color: 'white', background: 'black' }}>{item.productName}</td>
                  <td style={{ color: 'white', background: 'black' }}>Rs {item.mrp}</td>
                  <td style={{ color: 'white', background: 'black' }}>{item.quantity}</td>
                  <td style={{ color: 'white', background: 'black' }}>Rs {item.total}</td>

                  <td style={{ color: 'white', background: 'black' }}>
                    <button
                      style={{ background: 'red', borderRadius: '5px' }}
                      onClick={() => handleDeleteItem(index + items.length, item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to={"/Invoice"}>
        <button className='popupClose'>Generated invoice</button>
        </Link>
      </div>
    </div>
  );
};

export default Counter;

// import React, { useState } from "react";
// import "./Billing.css";
// import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Billing = () => {
//   const [productName, setProductName] = useState("");
//   const [productQuantity, setProductQuantity] = useState("");
//   const [productPrice, setProductPrice] = useState("");

//   const dispatch = useDispatch(); // Use useDispatch to dispatch actions
//   const items = useSelector((state) => state.items); // Use useSelector to access the items array from the Redux store
//   const productItems = useSelector((state) => state.productItems); // Use useSelector to access the items array from the Redux store

//   const handleProductNameChange = (e) => {
//     setProductName(e.target.value);
//   };

//   const handleProductQuantityChange = (e) => {
//     setProductQuantity(e.target.value);
//   };

//   const handleProductPriceChange = (e) => {
//     setProductPrice(e.target.value);
//   };

//   const calculateTotal = () => {
//     let totalAmount = 0;
//     items.forEach((item) => {
//       totalAmount += item.total;
//     });
//     localStorage.setItem("totalAmount", totalAmount);
//     return totalAmount.toFixed(2);
//   };

//   const handleAddItem = () => {
//     const newItem = {
//       productName,
//       productQuantity: parseInt(productQuantity),
//       productPrice: parseInt(productPrice),
//       total: parseInt(productQuantity) * parseInt(productPrice),
//     };  
//     const inventoryUpdate = {
//       productName,
//       productQuantity: parseInt(productQuantity),
//     }
//     dispatch({ type: "ADD_ITEM", payload: newItem });
//     dispatch({ type: "ADD_PRODUCT_ITEMS", payload: inventoryUpdate });
//   };

//   const handleDeleteItem = (index) => {
//     dispatch({ type: "DELETE_ITEM", payload: index });
//   };

//   const handleSubmit = () => {
//     axios.post("http://127.0.0.1:8080/postPay", items);
//   };
  
//   return (
//     <div className="billing-container-amount">
//       <div className="billing-container">
//         <div className="billing-container-heading">
//           <h3>Product bill</h3>
//         </div>
//         <div className="billing-container-heading-body">
//           <input
//             type="text"
//             name="productName"
//             placeholder="Enter productName"
//             value={productName}
//             onChange={handleProductNameChange}
//           />
//           <input
//             type="text"
//             name="productQuantity"
//             placeholder="Enter productQuantity"
//             value={productQuantity}
//             onChange={handleProductQuantityChange}
//           />
//           <input
//             type="text"
//             name="productPrice"
//             placeholder="Enter productPrice"
//             value={productPrice}
//             onChange={handleProductPriceChange}
//           />
//           <button type="submit" onClick={handleAddItem}>
//             Add Items
//           </button>
//         </div>
//         <div className="billing-container-table">
//           <table style={{ padding: "30px" }}>
//             <thead>
//               <tr>
//                 <th style={{ padding: "30px" }}>Product Name</th>
//                 <th style={{ padding: "30px" }}>MRP</th>
//                 <th style={{ padding: "30px" }}>Quantity</th>
//                 <th style={{ padding: "30px" }}>Total</th>
//                 <th style={{ padding: "30px" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.productName}</td>
//                   <td>Rs {item.productPrice}</td>
//                   <td>{item.productQuantity}</td>
//                   <td>Rs {item.total}</td>
//                   <td>
//                     <button onClick={() => handleDeleteItem(index)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="billing_totals">
//           Total: Rs {calculateTotal()}
//           <button onClick={handleSubmit} className="billing_btn">
//             <Link to="/invoice" >
//               Generate Invoice
//             </Link>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Billing;