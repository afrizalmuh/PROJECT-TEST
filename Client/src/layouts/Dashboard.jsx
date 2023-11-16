import React, { useEffect, useState, useMemo } from 'react'
import jubelioLogo from '../assets/jubelio.png'
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { observer } from 'mobx-react'
import { Store } from '../stores/store'
import defaultProduct from '../assets/default-product.jpg'
import Swal from "sweetalert2";
import Product from '../components/Product';
import Popup from '../components/Popup';
import PopupCreate from '../components/PopupCreate';

const Dashboard = observer(() => {
  
  const store = useMemo(() => new Store(), []);

  const [product_name, setProduct_name] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [id, setId] = useState("");

  const [dataProduct, setDataProduct] = useState()

  
  const submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      product_name,
      image,
      price,
      description,
      sku,
    };

    store.addProduct(payload);
    setProduct_name("");
    setImage("");
    setSku("");
    setPrice("");
    setDescription("");
    fetchProduct()
  }

  const fetchProduct = async() => {
    try {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/products`
      });
      setItems(response.data);
      store.setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const itemsPerPage = 8; // Number of items to display per page
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [items])

  const fetchMoreData = () => {

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Fetch additional data for the current page only if there are more items
  
      const newData = store.products.slice(startIndex, endIndex);

      // Append the new data to the 'items' state
      setItems([...items, ...newData]);
      store.setProducts([...items, ...newData]);
      // Increment the page number
      setPage(page + 1);

      
      // Check if there are more pages to load
      if (endIndex >= store.products.length) {
        setHasMore(false);
      }
  };
  //pop up
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = (item) => {
    setDataProduct(item)
    setShowPopup(true)
  };
  const closePopup = () => setShowPopup(false);

  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const openPopupCreate = () => {
    setShowPopupCreate(true)
  };
  const closePopupCreate = () => setShowPopupCreate(false);
  // console.log(items)

  const handleDelete = async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`)
    console.log(response)
  }
  return (
    
    <div className='h-screen '>
      <div className='bg-[#eee] justify-center flex'>
        <div className='w-[1080px] py-3 flex justify-between items-center'>
          <LazyLoadImage src={jubelioLogo } alt={items.name} width='150px' />
          <div className='cursor-pointer p-3 text-sm bg-primary hover:bg-blckprimary rounded-md text-white'
                onClick={openPopupCreate}>
            Add new Product
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='w-[1080px] py-8 grid grid-cols-2 gap-4'>
          {Array.isArray(items.data) ? items.data.map((item, key) =>
            <div key={key}>
              <div className='flex flex-col items-center' >
                <LazyLoadImage src={item.image || defaultProduct} width='50%' />
                <div className='flex flex-col items-center pt-5 gap-2'>
                  <h1 className='font-semibold text-2xl'>{item.name}</h1>
                  <h4>Price: ${item.price || 2.00}</h4>
                  <div className='flex gap-6'>
                    <button className='p-2 bg-blue-500 font-semibold text-white rounded-md' onClick={()=> openPopup(item)}>Update</button>
                    <button className='p-2 bg-red-500 font-semibold text-white rounded-md' onClick={()=> handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
                </div>
            </div>
          ) :<p>Data not found</p> }
        </div>
      </div>
      <Popup show={showPopup} onClose={closePopup} dataProducts={dataProduct}>
      </Popup>
      <PopupCreate show={showPopupCreate} onClose={closePopupCreate}></PopupCreate>
    </div>
  )
})

export default Dashboard