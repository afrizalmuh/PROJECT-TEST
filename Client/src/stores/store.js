import { action, makeAutoObservable, observable } from "mobx";
import axios from 'axios'
import Swal from "sweetalert2";


export class Store {
  products = [];
  productById = [];
  productRec = [];

  constructor() {
    makeAutoObservable(this, {
      products: observable,
      setProducts: action,
    });
  }

  setProducts(products) {
    this.products = products;
  }

  setProductsById(products) {
    this.productById = products;
  }

  setProductsRec(products) {
    this.productRec = products;
  }

  async fetchProduct() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },

      });

      this.setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(data) {
    try {

      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: data,
      });



      if (response.status === 201) {
        Swal.fire("Good job!", "Data successfully created!", "success");
        this.fetchProduct()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProductById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },

      });


      this.setProductsById(response.data)

    } catch (error) {
      console.log(error);
    }
  }

  async editDetails(payload, id, navigate) {
    try {

      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: payload,
      });

      console.log(response);
      if (response.status === 201) {
        Swal.fire("Good job!", "Data successfully edited!", "success");
        this.fetchProduct()
      }

    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please login first",
        });


      }
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }

  async deleteProduct(id, navigate) {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      if (response.status === 201) {
        Swal.fire("Good job!", "Data successfully deleted!", "success");
      }



      this.fetchProduct()
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please login first",
        });


      }
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }
}
