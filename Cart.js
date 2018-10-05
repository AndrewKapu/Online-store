class Cart {
    constructor(source, container = '.cart-drop-down'){
        this.source = source;
        this.container = container;
        this.countGoods = 0; //Общее кол-во товаров в корзине
        this.amount = 0; // Общая сумма
        this.cartItems = []; //Все товары в корзине
        this._init(this.source);
    }

    /**
     * Рендер всех HTML элементов самой корзины
     * @private
     */
    _render(){
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items-wrap'
        });
        let $totalAmount = $('<div/>', {
            class: 'cart-summary sum-amount'
        });
        let $totalPrice = $('<div/>', {
            class: 'cart-summary sum-price'
        });
        $(this.container).text('Корзина');
        $cartItemsDiv.appendTo($(this.container));
        $totalAmount.appendTo($(this.container));
        $totalPrice.appendTo($(this.container));
    }
    /**
     * Метод рендерит продукт на основании данных о нём из объекта продукта
     * @param {Object} product Объект со всеми свойствами продукта
     * @private
     */
    _renderItem(product){
        let $container = $('<div/>', {
            class: 'cart-product',
            'data-product': product.id_product
        }).on('click', '.remove-btn', event => {
            this._removeProduct(event);
        });
        let $text = $('<div/>', {
            class: 'cart-product-text'
        });
        $container.append($(`<a href="#"><img src="${product.imageSrc}" alt="photo">`));
        $container.append($text);
        $text.append($(`<h4>${product.product_name}</h4>`));
        $text.append($(`<span class="stars"><i class="fas fa-star"></span>`));
        $text.append($(`<p>${product.quantity}<span>x</span>${product.price}</p>`));
        $container.append($(`</a><a href="#" class="button-all action remove-btn"><i class="fas fa-times"></i></a>`));

        /*$container.append($(`<p class="product-quantity">${product.quantity}</p>`));
        $container.append($(`<p class="product-price">${product.price} руб.</p>`));
        $container.append($(`<button class="remove-btn">Удалить товар</button>`));*/
        $('.cart-items-wrap').append($container);
    }
    _renderSum(amount, countGoods){
        $('.sum-amount').text(`Всего товаров в корзине: ${countGoods}`);
        $('.sum-price').text(`Общая сумма: ${amount} руб.`);

    }
    _init(source){
        this._render();
        this._dragDrop();
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents){
                    this.cartItems.push(product);
                    this._renderItem(product);
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum(data.amount, data.countGoods);
            })
    }
    _updateCart(product){
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.product-quantity').text(product.quantity);
        $container.find('.product-price').text(`${product.quantity*product.price} руб.`);
    }
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
                quantity: 1
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItem(product);
        }
        this._renderSum(this.amount, this.countGoods);

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
                this._renderSum(this.amount, this.countGoods);

                if (this.cartItems[i].quantity < 1) {
                    this.cartItems.splice(i, 1);
                    //удление DOM элемента с товаром
                    event.target.parentNode.remove();
                } else {
                    this._updateCart(this.cartItems[i]);
                }
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