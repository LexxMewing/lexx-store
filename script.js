// Data utama produk
const products = [
    { id: 1,
    name: 'Racoon',
    price: 'Rp 85.000', 
    img: 'https://files.catbox.moe/633ynj.png' },
    
    { id: 2, 
    name: 'Dragon Fly', 
    price: 'Rp 60.000', 
    img: 'https://files.catbox.moe/rrcz5f.png' },
    
    { id: 3, 
    name: 'Queen Bee', 
    price: 'Rp 40.000', 
    img: 'https://files.catbox.moe/2cnd05.png' },
    
    { id: 4, 
    name: 'Red fox', 
    price: 'Rp 15.000', 
    img: 'https://files.catbox.moe/e6xyq0.png' },
    
    { id: 5, 
    name: 'Blood Owl', 
    price: 'Rp 10.000', 
    img: 'https://files.catbox.moe/b3ujx7.png' },
    
    { id: 6, 
    name: 'Dilophosaurus', 
    price: 'Rp 10.000', 
    img: 'https://files.catbox.moe/i7fdku.png' },
    
    { id: 7,
    name: 'Pet Titan', 
    price: 'Rp 10.000 - Rp 100.000', 
    img: 'https://files.catbox.moe/a5khvi.png' },
    
    { id: 8, 
    name: 'Pet Age 50',
    price: 'Rp 3.000', 
    img: 'https://files.catbox.moe/m9kxuj.png' },
    
    { id: 9, 
    name: 'Pet Age 60', 
    price: 'Rp 4.000', 
    img: 'https://files.catbox.moe/3tewvn.png' },
    
    { id: 10, 
    name: 'Pet Age 70',
    price: 'Rp 5.000', 
    img: 'https://files.catbox.moe/kdsotv.png' }
];




// Data stok produk
const productStocks = {
    1: 0, //racoon 
    2: 0, // dragon fly 
    3: 0, // Queen be
    4: 0, //red fox
    5: 0, //blood owl 
    6: 0, //Dilophosaurus
    7: 0, //titan
    8: 0,  // pet age 50
    9: 0,  // pet agw 60
    10: 0 // pet age 70
}







// Elemen-elemen DOM
const preloader = document.getElementById('preloader');
const productList = document.getElementById('product-list');
const mainPage = document.getElementById('main-page');
const orderPage = document.getElementById('order-page');
const selectedProductImg = document.getElementById('selected-product-img');
const productNameInput = document.getElementById('product-name');
const usernameInput = document.getElementById('username');
const hargaInput = document.getElementById('harga');
const paymentInput = document.getElementById('payment');
const whatsappInput = document.getElementById('whatsapp');
const orderForm = document.getElementById('order-form');
const paymentModal = document.getElementById('payment-modal');
const titanOptionsGroup = document.getElementById('titan-options-group');

let selectedProduct = null;
let selectedPaymentMethod = null;
let selectedTitanOption = null;

// Intersection Observer untuk lazy loading
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
});

// Fungsi untuk merender daftar produk
function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const stock = productStocks[product.id] || 0;
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        let stockText = `Sisa ${stock}`;
        if (product.id === 7) {
            stockText = `Sisa 0 (Huge) & 0 (Mega)`;
        }

        productItem.innerHTML = `
            <div class="bg-yellow">
                <img data-src="${product.img}" alt="${product.name}">
            </div>
            <div class="info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <p class="stock">${stockText}</p>
            </div>
        `;
        productItem.addEventListener('click', () => {
            selectedProduct = product;
            goToOrderPage();
        });
        
        productList.appendChild(productItem);
        observer.observe(productItem);
    });
}

// Fungsi untuk beralih halaman dengan efek transisi
function switchPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    setTimeout(() => {
        toPage.classList.add('active');
    }, 500);
}

// Fungsi untuk kembali ke halaman utama
function goToMainPage() {
    switchPage(orderPage, mainPage);
    orderForm.reset();
    selectedPaymentMethod = null;
    paymentInput.value = '';
    selectedTitanOption = null;
    titanOptionsGroup.style.display = 'none';
}

// Fungsi untuk pindah ke halaman pesanan
function goToOrderPage() {
    if (selectedProduct) {
        selectedProductImg.src = selectedProduct.img;
        productNameInput.value = selectedProduct.name;
        hargaInput.value = selectedProduct.price;

        if (selectedProduct.id === 7) {
            titanOptionsGroup.style.display = 'block';
        } else {
            titanOptionsGroup.style.display = 'none';
        }
        
        selectedTitanOption = null;
        const titanOptions = document.querySelectorAll('#titan-options-group .btn-option');
        titanOptions.forEach(option => option.classList.remove('selected'));

        switchPage(mainPage, orderPage);
    }
}

// Fungsi untuk memilih metode pembayaran
function showPaymentModal() {
    paymentModal.classList.add('active');
}

function hidePaymentModal() {
    paymentModal.classList.remove('active');
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    paymentInput.value = method;

    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.method === method) {
            option.classList.add('selected');
        }
    });
}

// Fungsi baru untuk memilih opsi Titan
function selectTitanOption(option) {
    selectedTitanOption = option;
    const titanOptions = document.querySelectorAll('#titan-options-group .btn-option');
    titanOptions.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.option === option) {
            btn.classList.add('selected');
        }
    });
}

// Menangani pengiriman formulir pesanan
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    let productName = productNameInput.value.trim();
    const harga = hargaInput.value.trim();
    const paymentMethod  = paymentInput.value.trim();
    const whatsappNumber = whatsappInput.value.trim();

    if (selectedProduct.id === 7 && !selectedTitanOption) {
        alert('Mohon pilih jenis Titan (Huge atau Mega)!');
        return;
    }

    if (!username || !productName || !paymentMethod) {
        alert('Username, Nama Produk, dan Metode Pembayaran wajib diisi!');
        return;
    }

    if (selectedProduct.id === 7 && selectedTitanOption) {
        productName += ` (${selectedTitanOption})`;
    }

    let message = `Haii Admin Lexx Nak Order nihh 😋
Username : ${username}
Items : ${productName}
Price : ${harga}
Pembayaran : ${paymentMethod}`;

    if (paymentMethod === 'QRIS') {
        message += `\n\n(Infoo Qrisss Minn)`;
    } else if (paymentMethod === 'Dana') {
        message += `\n\n(Infoo Nomor Danaa minn)`;
    }

    if (whatsappNumber) {
        message += `\nWa : ${whatsappNumber}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const waNumber = '628129120098690';
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
});

// Inisialisasi: Panggil renderProducts saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// Event listener untuk menyembunyikan preloader setelah seluruh halaman selesai dimuat
window.addEventListener('load', () => {
    preloader.classList.add('hidden');
});
