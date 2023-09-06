"use strict";

let productsContainer = document.querySelector("#products");
// let prevBtn = document.querySelector("#prevBtn");
// let nextBtn = document.querySelector("#nextBtn");
let paginationDiv = document.querySelector("#paginationDiv");
let searchInput = document.querySelector("#search");

searchInput.addEventListener("input", (e) => {
    getProducts("products/search", { q: e.target.value });
});

const initApp = () => {
    getProducts();
};
document.addEventListener("DOMContentLoaded", initApp);

const baseUrl = "https://dummyjson.com/";

const getProducts = async function (path = "products", params) {
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
                alt="Front of men&#039;s Basic Tee in black."
                class="h-full w-full object-cover object-center lg:h-full lg:w-full"
            />
        </div>
        <div class="mt-4 flex justify-between">
            <div>
                <h3 class="text-sm text-gray-700">
                    <a href="#">
                        <span
                            aria-hidden="true"
                            class="absolute inset-0"
                        ></span>
                        ${item.title}
                    </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">${item.category}</p>
            </div>
            <p class="text-sm font-medium text-gray-900">$${item.price}</p>
        </div>
        <button
            type="submit"
            class="mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Add to cart
        </button>
    </div>
        `;
    });
};

let currentPage = 1;
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
    let pageBtns = document.querySelectorAll(".page-btn");
    pageBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            currentPage = +btn.textContent;
            getProducts({ skip: (currentPage - 1) * 10 });
            btn.classList.add("bg-slate-300");
        });
    });
};
