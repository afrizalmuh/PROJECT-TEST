import axios from "axios";
import React, { useState } from "react";
const PopupCreate = ({ show, onClose }) => {

  if (!show) return null;

  const [productCategory, setProductCategory] = useState({
    name: '',
    sku: '',
    image: '',
    price: '',
    description: ''
  })
  

  const handleChangeInputProduct = (e) => {
    const products = { ...productCategory }
    products[e.target.name] = e.target.value
    setProductCategory(products)
  }
  
  const handleCreate = (e) => {
    e.preventDefault()
    let priceFloat = parseFloat(productCategory.price)
    let createProducts = {...productCategory, price: priceFloat}
    fetchUpdateProduct(createProducts);
  }

  const fetchUpdateProduct = async (createProductCategory) => {
    console.log("updateProductCayegory => ", createProductCategory)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, createProductCategory)
      console.log(response.data.code)
      onClose()
    } catch(err) {
      console.log(err)
    }
  }
  return (
    <div className='fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'>
      <div className='absolute w-full h-full bg-white opacity-90' onClick={onClose} />
        <div className='w-full md:w-[25%] 2xl:w-[30%] flex items-center bg-white border rounded-2xl p-12 z-50'>
          <div className="flex flex-col gap-6">
            <form action="" onSubmit={handleCreate} className="flex flex-col gap-5">
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
                <label className="pr-[75px]">Sku:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72" 
                  name="sku"
                  label="sku"
                  value={productCategory.sku}
                  onChange={handleChangeInputProduct}
                  />
              </div>
              <div className="flex gap-2 items-center">
                <label className="pr-[67px]">Price:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72" 
                  name="price"
                  label="price"
                  value={productCategory.price}
                  onChange={handleChangeInputProduct}
                  />
              </div>
              <div className="flex gap-2 items-center">
                <label className="pr-[20px]">Description:</label>
                <input type="text"
                  className="outline outline-2 p-1 rounded-md w-72" 
                  name="description"
                  label="description"
                  value={productCategory.description}
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
              <button className="p-2 bg-blue-500 font-semibold text-white rounded-md" onClick={handleCreate}>Create</button>
              <button className="p-2 bg-red-500 font-semibold text-white rounded-md" onClick={onClose}>Cancel</button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default PopupCreate