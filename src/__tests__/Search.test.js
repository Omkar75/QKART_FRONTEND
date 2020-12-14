
import { mount } from "enzyme";
import React from "react";

import Product from "../components/Product";
import Search from "../components/Search";


window.scrollTo = jest.fn()
let searchComponent = {};

let exampleProduct = {
    name: "OnePlus 6",
    category: "Phones",
    cost: 100,
    rating: 5,
    image: "https://i.imgur.com/lulqWzW.jpg",
    _id: "BW0jAAeDJmlZCF8i",
};

beforeAll(() => {
    window.matchMedia =
        window.matchMedia ||
        function () {
            return {
                matches: false,
                addListener: function () { },
                removeListener: function () { },
            };
        };

    window.fetch = async (url, options) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    json: async () => {
                        return new Promise((resolveNested) => {
                            if (url.split("/")[url.split("/").length - 1] === "products") {
                                resolveNested([exampleProduct]);
                            }
                        });
                    },
                });
            }, 500);
        });
    };

    searchComponent = mount(<Search.WrappedComponent />);
});


describe("Check UI for Search page component (UI)", () => {
    test("Search bar field exists in Search page", () => {
        expect(searchComponent.find('input[type="text"]').exists()).toBe(true);
    });
});

describe("Check flow for Search page component (flow)", () => {
    test("Search api call changes filteredProducts state", async () => {
        await searchComponent.instance().getProducts();
        expect(searchComponent.state("filteredProducts")[0].name).toBe(
            exampleProduct.name
        );
    });

    test("Search failure flow", () => {
        searchComponent
            .instance()
            .search("thisFilterTextShouldNeverMatchAnActualProduct");
        expect(searchComponent.find(Product).exists()).toBe(false);
    });

    test("Search success flow", () => {
        searchComponent.instance().search("");
        searchComponent.setProps({}); // We do this to trigger a re-render
        expect(searchComponent.find(Product).exists()).toBe(true);
    });

    test("Search api call changes loading state", () => {
        expect(searchComponent.state("loading")).toBe(false);
        searchComponent.instance().performAPICall();
        expect(searchComponent.state("loading")).toBe(true);
    });
});