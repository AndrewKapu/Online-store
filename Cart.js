class Cart {
    constructor(source, container = '.cart-drop-down'){
        this.source = source;
        this.container = container; //Селектор HTML-элемента самой корзины в моей вёрстке
        this.countGoods = 0; //Общее кол-во товаров в корзине
        this.amount = 0; // Общая сумма
        this.cartItems = []; //Все товары в корзине
        this._init(this.source);
    }
    /**
     * Рендер HTML элементов самой корзины
     * @private
     */
    _render(){
        //Блок с товарами корзины
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items-wrap'
        });
        //Блок с отображением суммы корзины
        let $totalAmount = $('<div/>', {
            class: 'total'
        });
        let $span1 = $('<span>TOTAL</span>');//Для отображения суммы
        let $span2 = $('<span/>');//Для отображения суммы
        $totalAmount.append($span1);
        $totalAmount.append($span2);
        //Блок с кнопками
        let $buttons = $('<div/>', {
            class: 'buttons'
        });
        let $btn1 = $('<a href="checkout.html">Checkout</a>');
        let $btn2 = $('<a href="shopping%20cart.html">Go to cart</a>');
        $buttons.append($btn1);
        $buttons.append($btn2);

        $cartItemsDiv.appendTo($(this.container));
        $totalAmount.appendTo($(this.container));
        $buttons.appendTo($(this.container));
    }
    /**
     * Метод рендерит продукт на основании данных о нём из объекта продукта
     * @param {Object} product Объект со всеми свойствами продукта
     * @private
     */
    _renderItem(product){
        // Контейнер продукта
        let $container = $('<div/>', {
            class: 'cart-product',
            'data-product': product.id_product
        }).on('click', '.remove-btn', event => {
            event.preventDefault();
            this._removeProduct(event);
        });
        let $text = $('<div/>', {
            class: 'cart-product-text'
        });
        let $productLink = $('<a>', {href: '#'}).appendTo($container);
        let $productImg = $('<img>', {src: `${product.imageSrc}`, alt: 'photo'}).css({
            width: '70px',
            height: '85px'
        }).appendTo($productLink);
        $container.append($text);
        $text.append($(`<h4>${product.product_name}</h4>`));
        let $starsSpan = $('<span/>', {
            class: 'stars'
        });
        $text.append($starsSpan);
        for (let i = 0; i < product.rating; i++) {
            $starsSpan.append('<i class="fas fa-star"></i>');
        }
        //$text.append($(`<p>${product.quantity}<span>x</span>${product.price}</p>`));
        let $paragraph = $('<p>').appendTo($text);
        let $productQuantity = ($('<span>', {class: 'quantity', text: `${product.quantity}`})).appendTo($paragraph);
        let $multiplier = $('<span>x</span>').appendTo($paragraph);
        let $productPrice = $('<span></span>', {text: `$${product.price}`}).appendTo($paragraph);
        //$container.append($(`</a><a href="#" class="button-all action remove-btn"><i class="fas fa-times"></i></a>`));
        let $removeBtn = $('<a href="#" class="button-all action remove-btn"><i class="fas fa-times"></i>',
            {href: "#", class: "button-all action remove-btn"}).appendTo($container);
        $('.cart-items-wrap').append($container);
    }
    _renderSum(amount){
        $('.total span:last-child').text(`$${amount}`);

    }

    /**
     * Функция инициализирует JSON-файл с сервера и отображает информацию в корзине на основании JSON файла с сервера
     * @param {JSON-file} source Файл JSON, который мы получаем сервера
     * @private
     */
    _init(source){
        this._dragDrop();
        if (!localStorage.getItem('mycart')) {
            this._render();
            fetch(source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.contents) {
                        this.cartItems.push(product);
                        this._renderItem(product);
                    }
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
                    localStorage.setItem('mycart', JSON.stringify(this.cartItems));
                    console.log('Items added');
                    this._renderSum(data.amount);
                    if (!localStorage.getItem('cartAmount')) {
                        localStorage.setItem('cartAmount', JSON.stringify(this.amount));
                    }
                })
        } else {
            this._render();
            console.log('Loading from LocalStorage');
            this.cartItems = JSON.parse(localStorage.getItem('mycart'));
            this.amount = JSON.parse(localStorage.getItem('cartAmount'));
            this._renderSum(this.amount);
            for (let product of this.cartItems) {
                this._renderItem(product);
            }
        }
    }
    _updateCart(product){
        let $currentProduct = $(`[data-product="${product.id_product}"]`);
        $currentProduct.find('.quantity').text(`${product.quantity}`);
    }

    /**
     * Метод добавления товара в корзину
     * @param {HTMLElement} element конопка "купить" со всеми data-аттрибутами для формирования объекта товара
     * @private
     */
    _addProduct(element){
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                price: +$(element).data('price'),
                product_name: $(element).data('name'),
                quantity: 1,
                imageSrc: $(element).data('img'),
                rating: $(element).data('rating'),
                color: $(element).data('color'),
                size: $(element).data('size'),
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItem(product);
        }
        localStorage.setItem('mycart', JSON.stringify(this.cartItems));
        localStorage.setItem('cartAmount', JSON.stringify(this.amount));
        this._renderSum(this.amount);
    }

    /**
     * Функция удаления продукта ПО ОДНОМУ из корзины
     * @param {event} event Событие клика по элементу
     * @private
     */
    _removeProduct(event){
        for (let i = 0; i < this.cartItems.length; i++) {
            //находим в cartItems[] соответствующий товар и работаем с ним в цикле
            if (this.cartItems[i].id_product == event.target.parentNode.getAttribute('data-product')) {
                this.cartItems[i].quantity--;
                this.amount = this.amount - this.cartItems[i].price;
                this.countGoods = this.countGoods - 1;
                this._renderSum(this.amount);

                if (this.cartItems[i].quantity < 1) {
                    this.cartItems.splice(i, 1);
                    //удление DOM элемента с товаром
                    event.target.parentNode.remove();
                } else {
                    this._updateCart(this.cartItems[i]);
                }
                localStorage.setItem('mycart', JSON.stringify(this.cartItems));
                localStorage.setItem('cartAmount', JSON.stringify(this.amount));
            }
        }

    }
    _dragDrop() {
        $('.product').draggable({
            revert: true,
            tolerance: "touch",
        });
        $('#cart')
            .droppable({
                tolerance: "touch",
                drop: (event, ui) => {
                    this._addProduct(ui.draggable.find('.buyBtn'));
                }

            })

    }
}