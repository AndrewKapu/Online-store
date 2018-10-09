class Product {
    constructor(source, container = '.featured-items'){
        this.container = container;
        this.source = source;
        this._render(this.source, this.container);
    }

    /**
     * Рендер вёрстки с информацией полученоой из JSON файла с продуктами
     * @param {JSON} source файл с продуктами
     * @param {selector} container селектор блока с продуктами
     * @private
     */
    _render(source, container){
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let product of data) {
                    let $container = $(container);
                    let $wrapper = $('<div/>', {
                        class: 'parent-product'
                    });
                    let $mainLink = $('<a>', {href: '#', class: 'featured-item',}).appendTo($wrapper);
                    let $img = $(`<img src="${product.imageSrc}" alt="photo">`).appendTo($mainLink);
                    let $textDiv = $(`<div/>`, {class: 'featured-description'}).appendTo($mainLink);
                    let $text1 = $(`<p></p>`, {text: `${product.product_name}`}).appendTo($textDiv);
                    let $text2 = $('<span/>', {text:`${product.price}`}).appendTo($textDiv);
                    let $addCart = $('<div/>', {class: 'pos-add-to-cart'}).appendTo($wrapper);
                    let $buyBtn = $('<a>', {href: '#', class: 'add-to-cart', 'data-id': product.id_product,
                    'data-price': product.price, 'data-name': product.product_name, 'data-img': product.imageSrc,
                    'data-rating': product.rating}).appendTo($addCart);
                    let $addCartSpan = $('<span>').appendTo($buyBtn);
                    let $busketImg = $('<img src="img/hover-buy.svg" alt="add to your shopping list">').appendTo($addCartSpan);
                    let $textSpan = $('<span></span>', {text: 'Add to Cart', class: 'add-to-cart-button'}).appendTo($addCartSpan);
                    $wrapper.appendTo($container);
                    $('.browse-button').before($wrapper);
                }
            });


    }
}