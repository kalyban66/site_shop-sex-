// Отримання посилань на HTML-елементи
let listProductHTML = document.querySelector('.listProduct'); // Список товарів
let listCartHTML = document.querySelector('.listCart'); // Список товарів у корзині
let iconCart = document.querySelector('.icon-cart'); // Іконка корзини
let iconCartSpan = document.querySelector('.icon-cart span'); // Лічильник товарів у корзині
let body = document.querySelector('body'); // Тіло сторінки для контролю класів
let closeCart = document.querySelector('.close'); // Кнопка закриття корзини

// Масиви для збереження даних товарів і корзини
let products = [];
let cart = [];

// Додавання події кліку для відкриття/закриття корзини
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Відкриває або закриває корзину
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Закриває корзину при натисканні на кнопку
});

// Функція для додавання товарів до HTML
const addDataToHTML = () => {
    // Видалення поточних даних з HTML перед додаванням нових

    // Перевірка, чи є дані товарів для відображення
    if (products.length > 0) {
        products.forEach(product => {
            // Створення нового елемента товару
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id; // Встановлення ID товару
            newProduct.classList.add('item'); // Додавання класу для стилів

            // Вміст товару: зображення, назва, ціна та кнопка додавання в корзину
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">${product.price}грн</div>
            <button class="addCart">В корзину</button>`;
            
            // Додавання нового товару до списку товарів у HTML
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Подія для обробки натискання на кнопку "В корзину"
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    // Перевірка, чи клікнули на кнопку "В корзину"
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id; // Отримання ID товару
        addToCart(id_product); // Додавання товару до корзини
    }
});
// Додає продукт у кошик або збільшує його кількість, якщо він вже є
const addToCart = (product_id) => {
    // Знаходить позицію продукту у кошику за ідентифікатором
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

    // Якщо кошик порожній, додає перший продукт
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    // Якщо продукт ще не в кошику, додає його
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    // Якщо продукт вже є в кошику, збільшує його кількість
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML(); // Оновлює HTML відображення кошика
    addCartToMemory(); // Зберігає кошик у локальному сховищі
}

// Зберігає кошик у локальному сховищі
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); //об'єкт на рядок
}

// Відображає оновлений кошик у HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = ''; // Очищує поточне відображення кошика
    let totalQuantity = 0; // Ініціалізує загальну кількість продуктів у кошику
    let totalPrice = 0; // Ініціалізує загальну вартість

    // Перевіряє, чи кошик не порожній
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity += item.quantity; // Додає кількість продукту до загальної кількості

            // Знаходить інформацію про продукт
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            // Додає вартість товару до загальної вартості
            totalPrice += info.price * item.quantity;

            // Створює HTML-елемент для кожного продукту в кошику
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            // Додає елемент до кошика у HTML
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">${info.price * item.quantity}грн</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity; // Оновлює індикатор загальної кількості продуктів
    
    // Оновлює загальну вартість у HTML
    document.querySelector('.totalCost').innerText = `${totalPrice}грн`;
}


// Обробляє події на зменшення або збільшення кількості продукту
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    // Перевіряє, чи була натиснута кнопка зменшення або збільшення кількості
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id; // Отримує ідентифікатор продукту
        let type = 'minus';

        // Якщо натиснута кнопка збільшення, змінює тип
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type); // Викликає зміну кількості продукту в кошику
    }
});
// Змінює кількість продукту в кошику або видаляє його, якщо кількість стає 0
const changeQuantityCart = (product_id, type) => {
    // Знаходить позицію продукту в кошику за ідентифікатором
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    // Перевіряє, чи продукт є у кошику
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus': // Збільшує кількість продукту на 1
                cart[positionItemInCart].quantity += 1;
                break;
            default: // Зменшує кількість продукту на 1 або видаляє, якщо кількість стає 0
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1); // Видаляє продукт з кошика
                }
                break;
        }
    }
    addCartToHTML(); // Оновлює відображення кошика у HTML
    addCartToMemory(); // Зберігає оновлений кошик у локальному сховищі
}

// Ініціалізує додаток: завантажує продукти та кошик з пам'яті
const initApp = () => {
    // Завантажує дані продуктів з JSON-файлу
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML(); // Додає продукти на сторінку

        // Завантажує дані кошика з локального сховища, якщо вони є
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML(); // Оновлює HTML з кошиком
        }
    })
}

// Отримуємо посилання на поле пошуку
const searchInput = document.getElementById('searchInput');

// Додаємо подію на введення тексту в поле пошуку для фільтрації продуктів
searchInput.addEventListener('input', function() {
    const searchText = searchInput.value.toLowerCase();
    filterProducts(searchText); // Фільтрує продукти за текстом пошуку
});

// Функція для фільтрації товарів за введеним текстом
function filterProducts(searchText) {
    // Отримуємо всі елементи товарів
    const items = document.querySelectorAll('.listProduct .item');

    // Перевіряємо кожен товар на відповідність пошуковому тексту
    items.forEach(item => {
        const itemName = item.querySelector('h2').textContent.toLowerCase();
        if (itemName.includes(searchText)) {
            item.style.display = 'block'; // Показуємо товар, якщо є збіг
        } else {
            item.style.display = 'none';  // Ховаємо товар, якщо немає збігу
        }
    });
}



initApp();
