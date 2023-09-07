"use strict";

let productsContainer = document.querySelector("#products");
// let prevBtn = document.querySelector("#prevBtn");
// let nextBtn = document.querySelector("#nextBtn");
let paginationDiv = document.querySelector("#paginationDiv");
let searchInput = document.querySelector("#search");
let cartBtn = document.querySelector("#cart");
let cartModal = document.querySelector("#cart-modal");
let closeCartBtn = document.querySelector("#closeCart");
let cartItemsTbody = document.querySelector(".cart-items-tbody");

let currentPage = 1;

cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("block");
});

closeCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("block");
    cartModal.classList.add("hidden");
});

const initApp = () => {
    getProducts();
    searchInput.addEventListener("input", (e) => {
        getProducts("products/search", { q: e.target.value });
        currentPage = 1;
    });
};
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

const baseUrl = "https://dummyjson.com/";

const getProducts = async (path = "products", params) => {
    try {
        const res = await fetch(
            baseUrl +
                path +
                "?" +
                new URLSearchParams({
                    limit: 20,
                    ...params,
                }),
            {
                method: "GET",
            }
        ).then((data) => data.json());
        renderProducts(res.products);
        if (res.total) {
            pagination(res.total);
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
};

const renderProducts = (products) => {
    productsContainer.innerHTML = "";
    products?.map((item) => {
        productsContainer.innerHTML += `
    <div class="group relative single-product">
        <div
            class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
        >
            <img
                loading="lazy"
                src="${item.images[0]}"
                alt="${item.title}"
                class="product-img h-full w-full object-cover object-center lg:h-full lg:w-full"
            />
        </div>
        <div class="mt-4 flex justify-between">
            <div>
                <h3 class="text-sm text-gray-700">
                    <i class="product-title">
                        ${item.title}
                    </i>
                </h3>
                <p class="mt-1 text-sm text-gray-500">${item.category}</p>
            </div>
            <p class="product-price text-sm font-medium text-gray-900">$${item.price}</p>
        </div>
        <span
            class="add-to-cart cursor-pointer mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Add to cart
        </span>
    </div>
        `;
    });
    addToCart();
};

const addToCart = () => {
    let addToCartBtns = document.querySelectorAll(".add-to-cart");
    addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            let button = e.target;
            let product = button.parentElement;
            let title = product.querySelectorAll(".product-title")[0].innerText;
            let price = product.querySelectorAll(".product-price")[0].innerText;
            let img = product.querySelectorAll(".product-img")[0].src;

            cartItemsTbody.innerHTML += `
        <tr>
            <td class="p-2 flex flex-col items-center">
                <img src="${img}" alt="${title}" class="w-[100px] h-[100px] object-cover"/>
                <p>${title}</p>
            </td>
            <td class="p-2">${price}$</td>
            <td class="p-2">
                <button class="z-50 remove-from-cart bg-red-300 p-1 rounded-[4px]">
                    remove
                </button>
            </td>
        </tr>
            `;
        });
    });
    removeFromCart();
};

const removeFromCart = () => {
    // Attach the event listener to a parent element (e.g., cartItemsTbody)

    cartItemsTbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-from-cart")) {
            // Remove the parent row when the "remove" button is clicked
            e.target.parentElement.parentElement.remove();
        }
    });
};

const pagination = (totalProducts) => {
    paginationDiv.innerHTML = "";
    let pageCount = Math.ceil(totalProducts / 20);
    let arr = new Array(pageCount).fill();
    arr.map((item, i) => {
        paginationDiv.innerHTML += `
        <button
            class="${
                i + 1 === currentPage ? "bg-slate-300" : ""
            } page-btn relative block rounded px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
            >
            ${i + 1}
            </button>
            `;
    });
    onPageChange();
};

const onPageChange = () => {
    let pageBtns = document.querySelectorAll(".page-btn");
    pageBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentPage = +btn.textContent;
            getProducts(searchInput.value ? "products/search" : "products", {
                q: searchInput.value || "",
                skip: (currentPage - 1) * 20,
            });
            btn.classList.add("bg-slate-300");
        });
    });
};
