// Source Citation:
// This vanilla JavaScript implementation is inspired by beginner-friendly patterns 
// from Brad Traversy's Vanilla Web Projects: https://github.com/bradtraversy/vanillawebprojects

var cart = [];

document.addEventListener("DOMContentLoaded", function() {
    var savedCart = localStorage.getItem('celenueCart');
    if (savedCart !== null) {
        cart = JSON.parse(savedCart);
    }

    updateCartUI();
    initAddCartButtons();
    initNavbarSearch();
    initProductsPage();
    initCheckoutPage();
});

function addToCart(productId) {
    var productFound = null;

    for (var i = 0; i < celenueCatalog.length; i++) {
        if (celenueCatalog[i].id === productId) {
            productFound = celenueCatalog[i];
            break;
        }
    }

    if (productFound !== null) {
        cart.push(productFound);
        localStorage.setItem('celenueCart', JSON.stringify(cart));
        updateCartUI();
        alert("Item added to cart!");
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('celenueCart', JSON.stringify(cart));
    updateCartUI(); 
}

function emptyCart() {
    cart = [];
    localStorage.setItem('celenueCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    var containers = document.querySelectorAll('#cartItemsContainer');
    var totals = document.querySelectorAll('#cartSubtotal, .summary-table tr:nth-child(1) td:nth-child(2), .summary-table tr:nth-child(3) td:nth-child(2)');
    var counts = document.querySelectorAll('#cartCount');
    
    var total = 0;
    var htmlString = '';

    if (cart.length === 0) {
        htmlString = '<p style="text-align:center; color:#888; font-size:14px; margin: 30px 0;">Your cart is empty.</p>';
    } else {
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            
            htmlString += '<div class="cartItem" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:15px;">';
            htmlString += '    <div style="display:flex; gap:15px;">';
            htmlString += '        <img src="' + item.imgSrc + '" style="width:65px; height:65px; object-fit:cover; border-radius:4px; background:#e0e0e0;">';
            htmlString += '        <div style="display:flex; flex-direction:column; justify-content:space-between;">';
            htmlString += '            <h4 style="margin:0; font-size:15px; font-family:\'Playfair Display\', serif;">' + item.title + '</h4>';
            htmlString += '            <a href="javascript:void(0)" onclick="removeFromCart(' + i + ')" style="font-size:12px; color:#a83232; text-decoration:none; font-family:\'Inter\', sans-serif;">Remove</a>';
            htmlString += '        </div>';
            htmlString += '    </div>';
            htmlString += '    <div style="font-weight:600; font-size:14px; color:#333; font-family:\'Inter\', sans-serif;">' + item.price + '</div>';
            htmlString += '</div>';
            
            var cleanPrice = parseFloat(item.price.replace(/[₱P,]/g, ''));
            if (!isNaN(cleanPrice)) {
                total = total + cleanPrice;
            }
        }
        
        htmlString += '<a href="javascript:void(0)" onclick="emptyCart()" style="display:block; text-align:center; margin-top:10px; margin-bottom: 20px; font-size:13px; color:#888; text-decoration:underline; font-family:\'Inter\', sans-serif;">Empty Cart</a>';
    }

    for (var c = 0; c < containers.length; c++) {
        containers[c].innerHTML = htmlString;
    }
    
    for (var t = 0; t < totals.length; t++) {
        totals[t].innerText = '₱' + total.toFixed(2);
    }
    
    for (var n = 0; n < counts.length; n++) {
        if (cart.length > 0) {
            counts[n].innerText = '(' + cart.length + ')';
        } else {
            counts[n].innerText = '';
        }
    }
}

function initAddCartButtons() {
    var modals = document.querySelectorAll('.modalOverlay');
    for (var i = 0; i < modals.length; i++) {
        var btn = modals[i].querySelector('.btnAddCart');
        if (btn !== null) {
            (function(index) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault(); 
                    addToCart(index + 1); 
                    window.location.hash = "#!"; 
                });
            })(i);
        }
    }
}

function initNavbarSearch() {
    var searchInputs = document.querySelectorAll('.searchInputWrapper input');
    
    for (var i = 0; i < searchInputs.length; i++) {
        searchInputs[i].addEventListener('input', function(e) {
            var query = e.target.value.toLowerCase();
            var popup = e.target.closest('.navPopup');
            var grid = popup.querySelector('.searchResultsGrid');
            
            if (grid === null) return;

            var results = [];
            
            for (var j = 0; j < celenueCatalog.length; j++) {
                var product = celenueCatalog[j];
                var matchTitle = product.title.toLowerCase().indexOf(query) !== -1;
                var matchDesc = product.desc.toLowerCase().indexOf(query) !== -1;
                var matchCategory = product.category.toLowerCase().indexOf(query) !== -1;
                
                if (matchTitle || matchDesc || matchCategory) {
                    results.push(product);
                }
                
                if (results.length === 4) break; 
            }

            if (results.length === 0) {
                grid.innerHTML = '<p style="grid-column: span 4; text-align:center; color:#888; margin: 20px 0; font-family:\'Inter\', sans-serif;">No products found.</p>';
                return;
            }

            var htmlString = '';
            for (var r = 0; r < results.length; r++) {
                htmlString += '<a href="#modal' + results[r].id + '" class="searchResultCard" style="text-decoration:none; color:inherit;">';
                htmlString += '    <span class="searchResultCategory" style="font-family:\'Inter\', sans-serif;">' + results[r].category + '</span>';
                htmlString += '    <img src="' + results[r].imgSrc + '" class="searchResultImage" style="background:#e0e0e0;">';
                htmlString += '    <h4 class="searchResultTitle" style="font-family:\'Playfair Display\', serif;">' + results[r].title + '</h4>';
                htmlString += '    <p class="searchResultPrice" style="font-family:\'Inter\', sans-serif;">' + results[r].price + '</p>';
                htmlString += '</a>';
            }
            grid.innerHTML = htmlString;
        });
    }
}

function initProductsPage() {
    var productGrid = document.querySelector('.sort-section ~ .Item-container');
    if (productGrid === null) return; 

    var searchInput = document.querySelector('.search-box input');
    var categorySelect = document.querySelectorAll('.dropdown')[0];
    var sortSelect = document.querySelectorAll('.dropdown')[1];

    var urlParams = new URLSearchParams(window.location.search);
    var urlCategory = urlParams.get('category');
    var urlSort = urlParams.get('sort');

    if (urlCategory) {
        for (var c = 0; c < categorySelect.options.length; c++) {
            if (categorySelect.options[c].value === urlCategory) {
                categorySelect.selectedIndex = c;
                break;
            }
        }
    }

    if (urlSort) {
        for (var s = 0; s < sortSelect.options.length; s++) {
            if (sortSelect.options[s].value === urlSort) {
                sortSelect.value = urlSort;
            }
        }
    }

    function renderProducts() {
        var query = searchInput.value.toLowerCase();
        var cat = categorySelect.value;
        var sortType = sortSelect.value;
        
        var filtered = [];

        for (var i = 0; i < celenueCatalog.length; i++) {
            var p = celenueCatalog[i];
            
            var matchSearch = (query === '') || (p.title.toLowerCase().indexOf(query) !== -1) || (p.desc.toLowerCase().indexOf(query) !== -1) || (p.category.toLowerCase().indexOf(query) !== -1);
            var matchCategory = (cat === 'All categories ' || cat === 'All categories' || p.category === cat);
            
            if (matchSearch && matchCategory) {
                filtered.push(p);
            }
        }

        if (sortType === 'Newest') {
            filtered.reverse(); 
        } else if (sortType === 'Top Rated') {
            filtered.sort(function(a, b) {
                if(a.title < b.title) return -1;
                if(a.title > b.title) return 1;
                return 0;
            }); 
        } 

        if (filtered.length === 0) {
            productGrid.innerHTML = '<h3 style="grid-column: span 4; text-align:center; margin-top:50px;">No essentials found.</h3>';
            return;
        }

        var htmlString = '';
        for (var j = 0; j < filtered.length; j++) {
            var prod = filtered[j];
            htmlString += '<a href="#modal' + prod.id + '" class="card" style="text-decoration:none; color:inherit;">';
            htmlString += '    <img src="' + prod.imgSrc + '" alt="' + prod.title + '" style="background:#e0e0e0;">';
            htmlString += '    <div class="text">';
            htmlString += '        <h4>' + prod.title + '</h4>';
            htmlString += '        <p class="desc">' + prod.desc + '</p>';
            htmlString += '        <p class="price">' + prod.price + '</p>';
            htmlString += '    </div>';
            htmlString += '</a>';
        }
        productGrid.innerHTML = htmlString;
    }

    searchInput.addEventListener('input', renderProducts);
    categorySelect.addEventListener('change', renderProducts);
    sortSelect.addEventListener('change', renderProducts);
    
    renderProducts();
}

function initCheckoutPage() {
    var completeOrderBtn = document.querySelector('.checkout-form .btnCheckout');
    
    if (completeOrderBtn !== null) {
        completeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                alert("Your cart is empty! Please add products before checking out.");
                return;
            }
            alert("Order placed successfully! Thank you for choosing CELENUE.");
            emptyCart();
            window.location.href = "index.html"; 
        });
    }
}