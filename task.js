class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }

    setAvailable(status) {
        this.available = status;
    }
}

class GoodsList {
    #goods;

    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        const forSale = this.#goods.filter(good => this.filter.test(good.name));

        if (!this.sortPrice) {
            return forSale;
        }

        if (this.sortDir) {
            return forSale.sort((a, b) => (a.price - b.price))
        } else {
            return forSale.sort((a, b) => (b.price - a.price));
        }

    }

    add(newGood) {
        this.#goods.push(newGood);
    }

    remove(id) {
        this.#goods.splice(id - 1, 1)
    }
}

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

class Basket {
    constructor(goods) {
        this.goods = [];
    }

    get totalAmount() {
        return this.goods.map(good => good.amount).reduce((a, b) => a + b, 0)
    }

    get totalSum() {
        return this.goods.reduce((a, b) => a + b.amount * b.price, 0)
    }

    add(good, amount) {
        let idx = this.goods.findIndex(value => value.id === good.id);
        if (idx >= 0) {
            this.goods[idx].amount += amount;
        } else {
            let newGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(newGood);
        }
    }

    remove(good, amount) {
        let idx = this.goods.findIndex(value => value.id === good.id);
        if (idx >= 0) {
            if (this.goods[idx].amount - amount <= 0 || amount === 0) {
                this.goods.splice(idx, 1);
            } else {
                this.goods[idx].amount -= amount;
            }
        }

    }

    clear() {
        this.goods = [];
    }

    removeUnavailable() {
        this.goods = this.goods.filter(good => good.available === true)
        return this.goods;
    }
}

const goodOne = new Good(1, "Футболка", "Описание...", ["S", "M", "XL"], 100, true);
const goodTwo = new Good(2, "Рубашка", "Описание...", ["S", "M", "L"], 200, true);
const goodThree = new Good(3, "Пиджак", "Описание...", ["XS", "M", "XXL"], 300, true);
const goodFour = new Good(4, "Джинсы", "Описание...", ["S", "M", "L", "XL"], 400, true);
const goodFive = new Good(5, "Кроссовки", "Описание...", ["L", "XL"], 500, true);


const catalog = new GoodsList(/^/, false, false);

goodOne.setAvailable(false);
console.log(goodOne);

catalog.add(goodOne);
catalog.add(goodTwo);
catalog.add(goodThree);
catalog.add(goodFour);
catalog.add(goodFive);

catalog.sortPrice = true;
console.log(`Товары из каталога: `, catalog.list);
catalog.remove(1);
console.log(`Товары из каталога: `, catalog.list);

const basket = new Basket();

basket.add(goodOne, 3);
basket.add(goodTwo, 5);

console.log("Товаров в корзине: ", basket.totalAmount);
console.log("Общая сумма товаров: ", basket.totalSum);

basket.add(goodOne, 4);
basket.add(goodThree, 4);
basket.add(goodFour, 4);
basket.remove(goodOne, 2);
basket.remove(goodTwo, 5);

console.log(basket.goods);
console.log("Товаров в корзине: ", basket.totalAmount);
console.log("Общая сумма товаров: ", basket.totalSum);

basket.removeUnavailable();
console.log(basket.goods);

basket.clear();
console.log(basket.goods);
