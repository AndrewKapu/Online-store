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

    }
}