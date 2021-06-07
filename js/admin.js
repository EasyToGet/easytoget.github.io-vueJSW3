import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'easytoget',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {
    // 取得  BS model 實體
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });


    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取得 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if(token === ''){
      alert('您尚未登入請重新登入。');
      window.location = 'index.html';
    }

    // 存入 token 到 cookie 裡面
    axios.defaults.headers.common['Authorization'] = token;

    this.getProducts();
  },
  methods: {
    // 取得產品資料
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 新增產品或編輯產品
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';
      
      if(!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }

      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            productModal.hide();
            this.getProducts();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    // 判斷開啟新增編輯刪除 openModal
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: []
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    // 刪除圖片
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            delProductModal.hide();
            this.getProducts();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 新增多個圖片 
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
});

app.mount('#app');




// const url = 'https://vue3-course-api.hexschool.io';
// const path = 'easytoget';

// const app = {
//   data: {
//     products: [],
//   },
//   getData() {
//     axios.get(`${url}/api/${path}/admin/products`)
//       .then((res) => {
//         console.log(res);
//         if (res.data.success) {
//           this.data.products = res.data.products;
//           this.render();
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   },
//   render() {
//     const productListDom = document.querySelector('#productList');
//     const productCountDom = document.querySelector('#productCount');
//     // let template = '';
//     // this.data.products.forEach((item) => {
//     //   template = template + `
//     //     <tr>
//     //       <td>${item.title}</td>
//     //       <td width="120">
//     //         ${item.origin_price}
//     //       </td>
//     //       <td width="120">
//     //         ${item.price}
//     //       </td>
//     //       <td width="100">
//     //         <span class="">${item.is_enabled}</span>
//     //       </td>
//     //       <td width="120">
//     //         <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove"
//     //           data-id=""> 刪除 </button>
//     //       </td>
//     //     </tr>`;
//     // })
//     const template = this.data.products.map(item => `
//       <tr>
//         <td>${item.title}</td>
//         <td width="120">
//           ${item.origin_price}
//         </td>
//         <td width="120">
//           ${item.price}
//         </td>
//         <td width="100">
//           <span class="">${item.is_enabled}</span>
//         </td>
//         <td width="120">
//           <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove"
//             data-id="${item.id}"> 刪除 </button>
//         </td>
//       </tr>
//     `).join('');
//     productListDom.innerHTML = template;
//     productCountDom.textContent = this.data.products.length;

//     const deleteBtns = document.querySelectorAll('.deleteBtn');
//     deleteBtns.forEach(btn => {
//       // btn.addEventListener('click', this.deleteProduct);
//       btn.addEventListener('click', this.deleteProduct.bind(this));
//     })
//   },
//   deleteProduct(evt) {
//     const id = evt.target.dataset.id;
//     axios.delete(`${url}/api/${path}/admin/product/${id}`)
//       .then((res) => {
//         console.log(res);
//         // app.getData();
//         this.getData();
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   },
//   init() {
//     // Cookie 取出
//     const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
//     axios.defaults.headers.common['Authorization'] = token;
//     // axios.post(`${url}/api/user/check`) 
//     //   .then((res) => {
//     //     console.log(res);
//     //   })
//     this.getData();
//   }
// }
// app.init();
