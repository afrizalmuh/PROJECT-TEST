import Sidebar from "../components/sidebar";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { Store } from "../stores/store";
import Swal from "sweetalert2";

import InfiniteScroll from "react-infinite-scroll-component";
const Home = observer(() => {
  const store = useMemo(() => new Store(), []);
  
  const [product_name, setProduct_name] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
   fetchProduct()

  }, []);

  function submitHandler(e) {
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

  const cardImageStyle = {
    maxWidth: "50%", // Set the maximum width of the image to the card's width
    height: "30vh", // Set the height to 30% of the viewport height
    display: "block", // Set the image as a block element
    margin: "auto", // Auto margin horizontally centers the image
  };
  function removePTags(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const paragraphs = div.querySelectorAll("p");

    for (const p of paragraphs) {
      const text = document.createTextNode(p.textContent);
      p.parentNode.replaceChild(text, p);
    }

    return div.innerHTML;
  }
  async function fetchProductById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      if (response.status === 200) {
        setDetails((prevDetails) => ({
          ...prevDetails,

          product_name: response.data[0].product_name,
          image: response.data[0].image,
          sku: response.data[0].sku,
          price: response.data[0].price,
          description: removePTags(response.data[0].description),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  function showEdit(id) {
    fetchProductById(id);
    setId(id);
  }

  const [details, setDetails] = useState({
    price: "",
    product_name: "",
    image: "",
    description: "",
    sku: "",
  });

  function editHandler(e) {
    e.preventDefault();
    const payload = {
      product_name: details.product_name,
      image: details.image,
      price: details.price,
      description: details.description,
      sku: details.sku,
    };

    store.editDetails(payload, id);
  }

  function deleteHandler(id) {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, delete this data",
      denyButtonText: `No, don't delete this`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        store.deleteProduct(id);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  async function fetchProduct() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
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
  // Function to load more data
  // Function to load more data
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

  return (
    <>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Dashboard</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}

          <div className="d-flex flex-row justify-content-between m-2 mt-5">
            <div>
              <div
                data-toggle="modal"
                data-target="#modal-add"
                type="button"
                className="btn btn-outline-primary "
              >
                Add new Product
              </div>
            </div>
          </div>
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  {/* /.card-header */}
                  <div className="card-body">
                    <InfiniteScroll
                      dataLength={store.products.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={<h4>Loading...</h4>}
                      endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>Yay! You have seen it all</b>
                        </p>
                      }
                    >
                      <div className="row">
                        {store.products.map((product, index) => (
                          <div key={index} className="col-md-3">
                            <div className="card">
                              <div className="card">
                                <img
                                  className="card-img-top"
                                  src={product.image}
                                  alt="cap"
                                  style={cardImageStyle} // Apply the custom image style here
                                />
                                <div className="card-body">
                                  <p className="card-text text-center text-lg text-bold">
                                    {removePTags(product.product_name)}
                                  </p>

                                  <p className="card-text text-center">
                                    {"$" + product.price}
                                  </p>
                                  <p className="card-text">
                                    {removePTags(product.description)}
                                  </p>
                                  <div className="row">
                                    <div className="col-md-6 mt-2">
                                      <button
                                        data-toggle="modal"
                                        data-target="#modal-edit"
                                        type="button"
                                        className="btn btn-outline-primary custom-button-width"
                                        onClick={() => showEdit(product.id)}
                                      >
                                        Edit
                                      </button>
                                    </div>

                                    <div className="col-md-6 mt-2">
                                      <button
                                        className="btn btn-outline-danger custom-button-width"
                                        onClick={() =>
                                          deleteHandler(product.id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfiniteScroll>

                    {/* Add more cards here as needed */}
                  </div>
                  {/* <div className="text-center ml-3">
                    <ul className="pagination">
                      {Array.from(
                        {
                          length: Math.ceil(
                            store.products.length / itemsPerPage
                          ),
                        },
                        (_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div> */}
                  {/* /.card-body */}
                </div>
                {/* /.card */}

                {/* /.card */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>

      <div>
        <div
          className="modal fade show"
          id="modal-add"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modal-addTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Add Product
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* left column */}
                  <div className="col-md-12">
                    {/* jquery validation */}
                    <div className="">
                      {/* /.card-header */}
                      {/* form start */}
                      <form id="quickForm">
                        <div className="card-body">
                          <div className="form-group">
                            <label>Product Name</label>
                            <input
                              type="text"
                              name="full_name"
                              className="form-control"
                              placeholder="Enter product name"
                              value={product_name}
                              onChange={(e) => setProduct_name(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>SKU</label>
                            <input
                              type="text"
                              name="sku"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Enter SKU"
                              value={sku}
                              onChange={(e) => setSku(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Image Link</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Enter Image Link"
                              value={image}
                              onChange={(e) => setImage(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Price</label>
                            <input
                              type="text"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Enter Product Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              rows="4" // You can adjust the number of rows as needed
                              className="form-control"
                              placeholder="Enter Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                          </div>

                          <div className="form-group mb-0"></div>
                        </div>
                        {/* /.card-body */}
                      </form>
                    </div>
                    {/* /.card */}
                  </div>
                  {/*/.col (left) */}
                  {/* right column */}
                  <div className="col-md-6"></div>
                  {/*/.col (right) */}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitHandler}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className="modal fade show"
          id="modal-edit"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modal-addTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Add Product
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* left column */}
                  <div className="col-md-12">
                    {/* jquery validation */}
                    <div className="">
                      {/* /.card-header */}
                      {/* form start */}
                      <form id="quickForm">
                        <div className="card-body">
                          <div className="form-group">
                            <label>Product Name</label>
                            <input
                              type="text"
                              name="product_name"
                              className="form-control"
                              placeholder="Enter product name"
                              value={details.product_name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>SKU</label>
                            <input
                              type="text"
                              name="sku"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Enter SKU"
                              value={details.sku}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Image Link</label>
                            <input
                              type="text"
                              name="image"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Enter Image Link"
                              value={details.image}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Price</label>
                            <input
                              type="text"
                              autoComplete="off"
                              name="price"
                              className="form-control"
                              placeholder="Enter Product Price"
                              value={details.price}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              rows="4" // You can adjust the number of rows as needed
                              className="form-control"
                              name="description"
                              placeholder="Enter Description"
                              value={details.description}
                              onChange={handleChange}
                            ></textarea>
                          </div>

                          <div className="form-group mb-0"></div>
                        </div>
                        {/* /.card-body */}
                      </form>
                    </div>
                    {/* /.card */}
                  </div>
                  {/*/.col (left) */}
                  {/* right column */}
                  <div className="col-md-6"></div>
                  {/*/.col (right) */}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editHandler}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Home;
 