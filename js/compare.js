const convertCurrent = (number) => {
    if (!number || number === '') return 0;
    let str = number.toString();
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev;
    });
}

const renderCompareList = () => {
const listCompare = JSON.parse(localStorage.getItem('compareList'))
console.log(listCompare)
if (listCompare.length > 0) {
    document.getElementById('compare-list').innerHTML = listCompare.map(
        (item, index) => {
            return `
      <div class="col-lg-4 product-flex-info" key=${'item-' + (index + 1)}>
                    <div class="clearfix">

                        <div class="clearfix">

                            <!--price wrapper-->
    <h3 class="title">${item.prod_name}</h3>
                            <div class=" product-flex-gallery">

                <div class="owl-product-gallery owl-carousel owl-theme open-popup-gallery">
                    <a href="${item.prod_img}"><img src="${item.prod_img}" alt="" /></a>
                    <a href="${item.prod_gallery}"><img src="${item.prod_gallery}" alt="" /></a>
                </div>
                </div>
                            <div class="price">
                                <span class="h3">
                                   $${convertCurrent(item.prod_price)}
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
                                <div class="product-colors clearfix"> ${item.prod_colors}</div>
                            </div>

                            <hr />

                            <!--info-box-->

                            <div class="info-box">
                                <span><strong>Choose size</strong></span>
                                <div class="product-colors clearfix">
                                   ${item.prod_size}
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
                                <span>
                                    <small>${item.prod_desc}</small>
                                </span>
                            </div>

                            <hr />

                            <div class="info-box info-box-addto added">
                                <span onclick={handleRemoveCompare(${item.prod_id})}>
                                    <i class=""><i class="fa fa-heart-o"></i> Remove compare</i>
                                   
                                </span>
                            </div>

                            <div class="info-box info-box-addto">
                                <span>
                                    <i class="add"><i class="fa fa-eye-slash"></i> Add to Watch list</i>
                                    <i class="added"><i class="fa fa-eye"></i> Remove from Watch list</i>
                                </span>
                            </div>

                            <div class="info-box info-box-addto">
                                <span>
                                    <i class="add"><i class="fa fa-star-o"></i> Add to Collection</i>
                                    <i class="added"><i class="fa fa-star"></i> Remove from Collection</i>
                                </span>
                            </div>

                        </div> <!--/clearfix-->
                    </div> <!--/product-info-wrapper-->
                </div> <!--/col-lg-4-->
      `
        }
    ).join('')
} else {

    document.getElementById('compare-list').innerHTML = `<div class="col-lg-12">
    <div class="alert alert-danger">
        <strong>No product to compare</strong>
    </div>
    </div>`
}
}
renderCompareList();

const handleRemoveCompare = (id) => {
    console.log('remove compare', id);
    let cpList = JSON.parse(localStorage.getItem('compareList'))
    // REMOVE ITEM
    let itemRemove = cpList.findIndex(item => item.prod_id === id)
    console.log(itemRemove)
    // UPDATE COMPARE LIST
    cpList.splice(itemRemove, 1)
    localStorage.setItem('compareList', JSON.stringify(cpList))
    /// rerender list item

    renderCompareList();
}