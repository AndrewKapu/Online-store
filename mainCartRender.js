class MainCart {
    constructor(source, container = '#main-cart') {
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
    _render(source, container) {
        let $container = $(container);
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
        }).appendTo($productLink);

        let $productText = $('<div/>', {
            class: 'cart-content-text'
        }).appendTo($leftPart);

        let $textLink = $('<a>', {
            href: '#'
        }).appendTo($productText);

        let $productName = $(`<h4>${product.product_name}</h4>`).appendTo($textLink);
        let $description = $(`<p>Color: ${product.color} <br> Size: ${product.size}</p>`).appendTo($productText);

        let $rightPart = $('<div/>', {
            class: 'characteristics align'
        }).appendTo($productWrapper);

        let $priceSpan = $('<span>', {
            class: 'product-characteristics',
            text: `${product.price}`
        }).appendTo($rightPart);

        let $quantitySpan = $('<span>', {
            class: 'product-characteristics',
        }).appendTo($rightPart);

        let $quantityInput = $('<input>', {
            type: 'text',
            text: `${product.quantity}`
        }).appendTo($quantitySpan);

        let $shippingSpan = $('<input>', {
            class: 'product-characteristics',
            text: 'FREE'
        }).appendTo($rightPart);

        let $subtotalSpan = $('<input>', {
            class: 'product-characteristics',
            text: `$${product.quantity*product.price}`
        }).appendTo($rightPart);

        let $removeBtn = $('<span>', {
            class: 'product-characteristics'
        }).appendTo($rightPart);

        let $removeSign = $('<a><i class="fas fa-times"></i></a>', {
            href: '#'
        }).appendTo($removeBtn);
    }
}