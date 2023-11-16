import axios from "axios";
import React, { useState } from "react";
const Popup = ({ show, onClose, dataProducts }) => {

  if (!show) return null;
  const [productCategory, setProductCategory] = useState({
    name: dataProducts.name,
    sku: dataProducts.sku,
    image: dataProducts.image,
    price: parseFloat(dataProducts.price)
  })
  

  const handleChangeInputProduct = (e) => {
    const products = { ...productCategory }
    products[e.target.name] = e.target.value
    setProductCategory(products)
  }
  
  const handleUpdate = (e) => {
    e.preventDefault()
    fetchUpdateProduct(productCategory);
  }

  const fetchUpdateProduct = async (updateProductCategory) => {
    console.log("updateProductCayegory => ", updateProductCategory)
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/products/${dataProducts.id}`, updateProductCategory)
      console.log(response.data.code)
    } catch(err) {
      console.log(err)
    }
  }
  return (
    <div className='fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'>
      <div className='absolute w-full h-full bg-white opacity-90' onClick={onClose} />
        <div className='w-full md:w-[40%] 2xl:w-[43%] flex items-center gap-16 bg-white border rounded-2xl p-12 z-50'>
          <img src={dataProducts.image} alt="" className='w-40' />
          <div className="flex flex-col gap-6">
            <form action="" onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div className="flex gap-2 items-center">
                <label>Nama product:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72" 
                  name="name"
                  label="name"
                  value={productCategory.name}
                  onChange={handleChangeInputProduct}
                  />
              </div>
              <div className="flex gap-2 items-center">
                <label className="pr-[68px]">Price:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72" 
                  name="price"
                  label="price"
                  value={productCategory.price}
                  onChange={handleChangeInputProduct}
                  />
              </div>
              <div className="flex gap-2 items-center">
                <label className="pr-[58px]">Image:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72"  
                  name="image"
                  label="image"
                  value={productCategory.image}
                  onChange={handleChangeInputProduct}
                  />
              </div>
            </form>
            <div className="flex justify-end gap-3">
              <button className="p-2 bg-blue-500 font-semibold text-white rounded-md" onClick={handleUpdate}>Update</button>
              <button className="p-2 bg-red-500 font-semibold text-white rounded-md" onClick={onClose}>Cancel</button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Popup