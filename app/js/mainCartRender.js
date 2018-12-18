class MainCart {
    constructor(container = '#main-cart') {
        this.container = container;
        this.cartItems = JSON.parse(localStorage.getItem('mycart'));// массив с объектами продуктов
        this.amount = JSON.parse(localStorage.getItem('cartAmount'));
        this._render(this.cartItems, this.container);
        this._renderTotalCost();
    }

    /**
     * Рендер вёрстки с информацией полученоой из JSON файла с продуктами
     * @param {JSON} source файл с продуктами
     * @param {selector} container селектор блока с продуктами
     * @private
     */
    _render(source, container) {
        let $container = $(container);
        for (let product of source) {
            let $productWrapper = $('<div/>', {
                class: 'cart-content-container'
            }).appendTo($container);
            $('.product-headings').after($productWrapper);
            $('.cart-buttons').before($productWrapper);
            let $leftPart = $('<div/>', {
                class: 'cart-content'
            }).appendTo($productWrapper);

            let $productLink = $('<a>', {
                href: '#'
            }).appendTo($leftPart);

            let $productImg = $('<img>', {
                src: `${product.imageSrc}`
            }).css({height: '115px', width: '100px'}).appendTo($productLink);


            let $productText = $('<div/>', {
                class: 'cart-content-text'
            }).appendTo($leftPart);

            let $textLink = $('<a>', {
                href: '#'
            }).appendTo($productText);

            let $productName = $(`<h4>${product.product_name}</h4>`).appendTo($textLink);
            let $description = $(`<p>Color:${product.color} <br> Size:${product.size}</p>`).appendTo($productText);

            let $rightPart = $('<div/>', {
                class: 'characteristics align'
            }).appendTo($productWrapper);

            let $priceSpan = $('<span>', {
                class: 'product-characteristics',
                text: `$${product.price}`
            }).appendTo($rightPart);

            let $quantitySpan = $('<span>', {
                class: 'product-characteristics',
            }).appendTo($rightPart);

            let $quantityInput = $('<input>', {
                id: 'productQuantity',
                type: 'text',
                placeholder: `${product.quantity}`
            }).appendTo($quantitySpan);

            let $shippingSpan = $('<span>', {
                class: 'product-characteristics',
                text: 'FREE'
            }).appendTo($rightPart);

            let $subtotalSpan = $('<span>', {
                class: 'product-characteristics',
                text: `$${product.quantity * product.price}`
            }).appendTo($rightPart);

            let $removeBtn = $('<span>', {
                class: 'product-characteristics'
            }).on('click', 'a', (event) => {
                event.preventDefault();
                this._removeProduct(event);
                //console.log(event.target.getAttribute('data-id'));
            })
                .appendTo($rightPart);

            let $removeSign = $('<a>', {
                'data-id': product.id_product,
                class: 'button-all',
                href: '#'
            }).appendTo($removeBtn);

            let $x = $('<i class="fas fa-times"></i>')
                .css('pointer-events', 'none')
                .appendTo($removeSign);
        }
    }

    _renderTotalCost() {
        let amount = this.amount;
        $('.total-margin').text(`$${amount}`);
    }

    _updateQuantity(quantity, productWrapper) {
        productWrapper.querySelector('#productQuantity').setAttribute('placeholder', `${quantity}`);
    }

    _removeProduct(event) {
        for (let i = 0; i < this.cartItems.length; i++) {
            //находим в cartItems[] соответствующий товар и работаем с ним в цикле
            if (this.cartItems[i].id_product == event.target.getAttribute('data-id')) {
                this.cartItems[i].quantity--;
                this.amount = this.amount - this.cartItems[i].price;
                this.countGoods = this.countGoods - 1;
                this._renderTotalCost(this.amount);
                this._updateQuantity(this.cartItems[i].quantity, event.target.closest('.cart-content-container'));

                if (this.cartItems[i].quantity < 1) {
                    this.cartItems.splice(i, 1);
                    //удление DOM элемента с товаром
                    event.target.closest('.cart-content-container').remove();
                } else {
                    this._renderTotalCost(this.amount);
                }
                localStorage.setItem('mycart', JSON.stringify(this.cartItems));
                localStorage.setItem('cartAmount', JSON.stringify(this.amount));
            }
        }

    }
}