const url = " http://localhost:3000/product"

fetch(url)
  .then(response => response.json())
  .then(data => {
      const listProduct = document.querySelector('#listProduct')

      data.forEach(item => {
          listProduct.innerHTML = `
                                        <span class="badge badge-warning">-20%</span>
                                        <div class="image">
                                            <a href="product.html">
                                                <img src="${item.img}" alt="" />
                                            </a>
                                        </div>
                                        <div class="text">
                                            <h2 class="title h4">
                                                <a href="product-details/item01.html"><span>Hay</span></a>
                                            </h2>
                                            <sub>$ 319,-</sub>
                                            <sup>$ 219,-</sup>
                                            <span class="description clearfix">
                                                ${item.desc}
                                            </span>
                                        </div>
          `
        
        });
  });
