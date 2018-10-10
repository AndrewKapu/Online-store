class MainCart {
    constructor(container = '#main-cart') {
        this.container = container;
        this.source = JSON.parse(localStorage.getItem('mycart'));
        this._render(this.source, this.container);
        this.renderTotalCost();
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
            }).appendTo($rightPart);

            let $removeSign = $('<a>', {
                class: 'button-all',
                href: '#'
            }).appendTo($removeBtn);

            let $x = $('<i class="fas fa-times"></i>').appendTo($removeSign);
        }
    }

    renderTotalCost() {
        let amount = localStorage.getItem('cartAmount');
        $('.total-margin').text(`$${amount}`);
    }
}