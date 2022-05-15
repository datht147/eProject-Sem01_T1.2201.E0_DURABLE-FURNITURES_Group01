
const api_key = `AKfycbzfTc4i5KzR6L-QD5Ns8SIp5g5sH7JjlfOuvZOSxK3mtSYOSTS1aarD5pTbJgF7TDDE`
const api_url = `https://script.google.com/macros/s/${api_key}/exec`;

const getProductItems = async () => {
    try {
        const response = await axios.get(api_url);
        const prodItems = response.data;
        return prodItems;
    } catch (errors) {
        console.error(errors);
    }
};
const convertCurrent = (number) => {
    if (!number || number === '') return 0;
    let str = number.toString();
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev;
    });
}

const convertPaging = (list, pageSize = 25, pageNumber = 1) => {
    return list.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)
}


const handleAddCompare = (proID) => {
    console.log('proID', proID)
    const prodList = JSON.parse(localStorage.getItem('prodList'))
    console.log('prodList', prodList)
    if (prodList) {
        const items = prodList.find(item => item.prod_id === proID);
        console.log('items', items)
        let compareList = localStorage.getItem('compareList') ? JSON.parse(localStorage.getItem('compareList')) : [];
        if (items) {
            if (compareList && compareList.length < 3) {
                let item = compareList.find(item => item.prod_id === items.prod_id)
                if (!item) {
                    compareList.push(items)
                    localStorage.setItem('compareList', JSON.stringify(compareList))
                    alert('Product added to compare list')
                }
                else alert('--Product already in compare list--')

            } else {
                alert('!!!---You can only compare 3 products---!!!');
            }
            return compareList;
        }
    }
    console.log('compare', compareCounter())
}
const renderProducts = (element, productArr, pageSize, pageNumber) => {
    let elementId = document.getElementById(element);
    productArr = convertPaging(productArr, pageSize, pageNumber);
    // console.log('productArr', productArr);
    if (elementId) {
        elementId.innerHTML = productArr.map(item => {
            return `
        <div class="col-6 col-lg-4">
        <article>
            <div class="info">
                <span class="add-favorite">
                    <a href="javascript:void(0);" data-title="Add to favorites" data-title-added="Added to favorites list">
                        <i class="icon icon-heart"></i>
                    </a>
                </span>
                <span>
                    <a href="javascript:void(0)" onClick={handleAddCompare(${item.prod_id})} class="mfp-open" data-title="Compare">
                        <i class="icon icon-compare"></i>
                    </a>
                </span>
            </div>
            <div class="btn btn-add">
                <i class="icon icon-cart"></i>
            </div>
            <div class="figure-grid">
                ${item.discount && item.discount > 0 && ('<span class="badge badge-warning">-' + item.discount + '%</span>')}
                <div class="image">
                    <a href="product.html?Id=${item.prod_id}">
                        <img src="${item.prod_img}" alt="${item.prod_name}" />
                    </a>
                </div>
                <div class="text">
                    <h2 class="title h4">
                        <a href="product.html?Id=${item.prod_id}">${item.prod_name}</a>
                    </h2>
                    <sup>${item.cat_name}</sup>
                    ${item.discount && item.discount > 0 && ('<sub>$' + convertCurrent(item.price_before) + '</sub>')}
                    <sup>$${convertCurrent(item.prod_price)}</sup>
                    <span class="description clearfix">
                        ${item.pro_desc}
                    </span>
                </div>
            </div>
        </article>
    </div>
    `
        }).join('')
    } else {
        return null
    }
}
const renderProductsList = (element, productArr, pageSize, pageNumber) => {
    let elementId = document.getElementById(element);
    productArr = convertPaging(productArr, pageSize, pageNumber);
    // console.log('productArr', productArr);
    if (elementId) {
        elementId.innerHTML = productArr.map(item => {
            return `
            <div class="col-12">
                                <article>
                                    <div class="info">
                                        <span class="add-favorite">
                                            <a href="javascript:void(0);" data-title="Add to favorites" data-title-added="Added to favorites list">
                                                <i class="icon icon-heart"></i>
                                            </a>
                                        </span>
                                        <span>
                                        <a href="javascript:void(0)" onClick={handleAddCompare(${item.prod_id})} class="mfp-open" data-title="Compare">
                                        <i class="icon icon-compare"></i>
                                    </a>
                                        </span>
                                    </div>
                                    <div class="btn btn-add">
                                        <i class="icon icon-cart"></i>
                                    </div> 
                                    <div class="figure-list" id="listProduct">
                                    ${item.discount && item.discount > 0 && ('<span class="badge badge-warning">-' + item.discount + '%</span>')}
                                        <div class="image">
                                                <a href="product.html?Id=${item.prod_id}">
                                                <img src="${item.prod_img}" alt="${item.prod_name}" />
                                            </a>
                                        </div>
                                        <div class="text">
                                            <h2 class="title h4">
                                            <a href="product.html?Id=${item.prod_id}">${item.prod_name}</a>
                                            </h2>
                                            <sup>${item.cat_name}</sup>
                                            ${item.discount && item.discount > 0 && ('<sub>$' + convertCurrent(item.price_before) + '</sub>')}
                                            <sup>$${convertCurrent(item.prod_price)}</sup>
                                            <span class="description clearfix">
                                                ${item.prod_desc}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </div>
    `
        }).join('')
    } else {
        return null
    }
}

getProductItems()
    .then(async res => {
        await localStorage.setItem('prodList', JSON.stringify(res));

        // POPULAR PRODUCTS - Get 6 products in array 
        await renderProducts('popularProducts', res, 6, 1)
        // PRODUCTS - Get all products in array

        // PAGINATION
        let page = document.getPageNumber = window.location.search.split('page=')[1]
        const totalPages = Math.ceil(res.length / 6)

        // FOR PRODUCTS GRID
        let nextBtn = document.getElementById('next-btn')
        nextBtn ? nextBtn.onclick = () => {

            if (Number(page) < totalPages) {
                window.location.href = `./products.html?page=${Number(page) + 1}`
            } else {
                window.location.href = `./products.html?page=${totalPages}`
            }
        } : null
        let prevBtn = document.getElementById('prev-btn')
        prevBtn ? prevBtn.onclick = () => {

            if (Number(page) > 1) {
                window.location.href = `./products.html?page=${Number(page) - 1}`
            } else {
                window.location.href = `./products.html?page=1`
            }
        } : null


        let filter = window.location.search.split('cat_id=')[1]
        // let res = JSON.parse(localStorage.getItem('prodList'))
        // console.log('filter', filter);
        if (filter) {
             renderProducts('allProducts', res.filter(item => item.cat_id === Number(filter)), 6, Number(page) || 1)
            renderProductsList('products-list', res.filter(item => item.cat_id === Number(filter)), 6, Number(page) || 1)
    
        }
        else {
             renderProducts('allProducts', res, 6, Number(page) || 1)
            renderProductsList('products-list', res, 6, Number(page) || 1)
        }
    

        //pageging product grid

        let pagingElement = document.getElementById('pagination')
        if (pagingElement) {
            for (let i = 1; i <= totalPages; i++) {
                pagingElement.innerHTML += `<li class="page-item"><a class="page-link" href="./products.html?page=${i}">${i}</a></li>`
            }
        }

        //pageging product list

        let pagingList = document.getElementById('pagination-list')
        if (pagingList) {
            for (let i = 1; i <= totalPages; i++) {
                pagingList.innerHTML += `<li class="page-item"><a class="page-link" href="./list-products.html?page=${i}">${i}</a></li>`
            }
        }

        // GET RANDOM PRODUCTS 
        // let randomArr = res
        let randomArr = [...res]

        randomArr = randomArr.sort(() => Math.random() - 0.5)

        console.log('lastedVisited', randomArr)
        await renderProducts('last-visit', randomArr, 3, 1)

        let popularFilter = [...res]
        popularFilter = popularFilter.sort(() => Math.random() - 0.5)
        // localStorage.removeItem('popularFilter')
        await localStorage.setItem('popularFilter', JSON.stringify(popularFilter))

        let lowestFilter = [...res]
        lowestFilter = lowestFilter.sort((a, b) => a.prod_price - b.prod_price)
        await localStorage.setItem('lowestFilter', JSON.stringify(lowestFilter))

        let highestFilter = [...res]
        highestFilter.sort((a, b) => b.prod_price - a.prod_price)
        await localStorage.setItem('highestFilter', JSON.stringify(highestFilter))

        // SET CATEGORY LIST
        let categoryList = [...res]
        // get unique category 
        categoryList = _.uniqBy(categoryList, 'cat_id').map(item => {
            cat_id = item.cat_id
            cat_name = item.cat_name
            return catlist = {
                cat_id,
                cat_name
            }
        })
        localStorage.setItem('categoryList', JSON.stringify(categoryList))


    })
    .catch(err => {
        console.log('err get products ===> ', err)
    })

/// FILTER BY CATEGORY
const filterByCategory = (catId) => {
    let filter = JSON.parse(localStorage.getItem('prodList'))
    let filterByCat = filter.filter(item => item.cat_id === Number(catId))
    renderProducts('allProducts', filterByCat, 6, 1)
    renderProductsList('products-list', filterByCat, 6, 1)

}
const getCatName = () => {
    let filter = window.location.search.split('cat_id=')[1]
    let catList = JSON.parse(localStorage.getItem('categoryList'))
    let catName = catList.filter(item => item.cat_id === Number(filter))
    return catName[0].cat_name
}



const renderProductDetail = async (prodParam) => {
    const products = JSON.parse(localStorage.getItem('prodList'))
         if(prodParam && products && products.length > 0 ) {
            let item = products.find(prod => prod.prod_id === prodParam)
            
            if(!item) {
                document.getElementById('product-detail').innerHTML = 
                `
                <div class="col-md-12">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Oops!</h4>
                        <p>Product not found!</p>
                    </div>
                </div>
                `
                   
                document.getElementById('check-render').innerHTML = ''
            } else {
               document.getElementById('product-detail').innerHTML = 
               `
               <header>
                <div class="container">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="./index.html">Home</a></li>
                        <li class="breadcrumb-item"><a href="./category.html?cat_id=${item.cat_id}">${item.cat_name}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${item.prod_name}</li>
                    </ol>
                    <h2 class="title">
                        ${item.prod_name}
                    </h2>
                </div>
            </header>

            <div class="main">
                <div class="container">
                    <div class="row product-flex">

                        <div class="col-lg-4 product-flex-info">
                            <div class="clearfix">

                                <div class="clearfix">

                                    <div class="price">
                                        <span class="h3 price-sale">$
                                             ${convertCurrent(item.prod_price)}
                                            ${(item.price_before > item.prod_price) ? ('<small class="price-origin">$' +
                                                convertCurrent(item.price_before) +
                                            '</small>') : ''}
                                        </span> 
                                    </div>

                                    <hr />

                                    <!--info-box-->

                                    <div class="info-box">
                                        <span><strong>Maifacturer</strong></span>
                                        <span>${item.prod_maifacturer}</span>
                                    </div>

                                    <!--info-box-->

                                    <div class="info-box">
                                        <span><strong>Materials</strong></span>
                                        <span>${item.prod_materials}</span>
                                    </div>

                                    <hr />


                                    <!--info-box-->

                                    <div class="info-box">
                                        <span><strong>Available Colors</strong></span>
                                        ${item.prod_color}
                                    </div>

                                    <hr />

                                    <!--info-box-->

                                    <div class="info-box">
                                        <span><strong>Choose size</strong></span>
                                        <div class="product-colors clearfix">
                                            <span class="color-btn color-btn-biege">
                                                <span class="product-size" data-text="">S</span>
                                            </span>
                                            <span class="color-btn color-btn-biege checked">M</span>
                                            <span class="color-btn color-btn-biege">XL</span>
                                            <span class="color-btn color-btn-biege">XXL</span>
                                        </div>
                                    </div>

                                    <hr />

                                    <div class="info-box">
                                        <span>
                                            Quantity
                                        </span>
                                        <span>
                                            <span class="row">
                                                <span class="col-6">
                                                    <input type="number" value="1" class="form-control">
                                                </span>
                                                <span class="col-6">
                                                    <a href="#" class="btn btn-danger">Buy now</a>
                                                </span>
                                            </span>
                                        </span>
                                    </div>

                                    <hr />

                                    <div class="info-box">
                                        ${item.prod_desc}
                                    </div>

                                    <hr />

                                    <div class="info-box info-box-addto added">
                                        <span>
                                            <i class="add"><i class="fa fa-heart-o"></i> Add to favorites</i>
                                            <i class="added"><i class="fa fa-heart"></i> Remove from favorites</i>
                                        </span>
                                    </div>

                                    <div class="info-box info-box-addto">
                                        <span>
                                            <i class="add"><i class="fa fa-eye-slash"></i> Add to compare</i>
                                            <i class="added"><i class="fa fa-eye"></i> Remove from Watch list</i>
                                        </span>
                                    </div>

                                    <div class="info-box info-box-addto">
                                        <span>
                                            <i class="add"><i class="fa fa-star-o"></i> Add to Collection</i>
                                            <i class="added"><i class="fa fa-star"></i> Remove from Collection</i>
                                        </span>
                                    </div>

                                </div>
                                <!--/clearfix-->
                            </div>
                            <!--/product-info-wrapper-->
                        </div>
                        <!--/col-lg-4-->
                        <!--product item gallery-->

                        <div class="col-lg-8 product-flex-gallery">

                            <!--product gallery-->

                            <div class="owl-product-gallery owl-carousel owl-theme open-popup-gallery">
                                <a href="${item.prod_img}"><img src="${item.prod_img}"
                                        alt="${item.prod_name}" /></a>
                                <a href="${item.prod_gallery}"><img src="${item.prod_gallery}"
                                        alt="${item.prod_name}" /></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
               `
               document.getElementById('check-render').innerHTML = `<section id="comments-rating" class="product-details">

               </section>`
         }
         
        }
         
}
renderProductDetail()