
import { mount } from "enzyme";
import React from "react";
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Input } from 'antd'

import Product from "../components/Product";
import Search from "../components/Search";
import App from "../App";

function renderWithRouter(
    ui,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    } = {}
) {
    return {
        ...render(<Router history={history}>{ui}</Router>),
        history,
    }
}

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

describe("Check if getProducts function", () => {
    test("calls performAPICall function", async () => {
        const performAPICall = jest.spyOn(searchComponent.instance() , "performAPICall");
        await searchComponent.instance().getProducts();
        expect(performAPICall).toHaveBeenCalled();
    })

    test("updates the state variable", async () => {
        expect(searchComponent.state('filteredProducts')).toStrictEqual([exampleProduct]);
    })
})

describe("Check flow for add to cart in Product component (flow)", () => {
    test("should redirect to /login page on clicking Add to Cart button if user is not logged in", async () => {
        const { history, findByText } = renderWithRouter(
                <App />,
                { route: '/products' }
            );
        (await findByText('Add to Cart')).click()
        expect(history.location.pathname).toEqual('/login')
    })
});

describe("Debounce search", () => {
    const debounceTimeout = 300

    afterEach(() => {
        jest.clearAllMocks(); // To reset spy on search
    })

    it("should make only 1 call to search", async () => {
        await searchComponent.instance().getProducts();
        const searchSpy = jest.spyOn(searchComponent.instance(), 'search')
        let event = {
            target: {
                value: 'T'
            }
        }
        searchComponent.instance().debounceSearch(event);

        event = {
            target: {
                value: 'To'
            }
        }
        searchComponent.instance().debounceSearch(event);

        event = {
            target: {
                value: 'Too'
            }
        }
        searchComponent.instance().debounceSearch(event);
        return new Promise( resolve => {
            setTimeout(() => {
                expect(searchSpy).toHaveBeenCalledTimes(1);
                resolve(true)
            }, debounceTimeout * 2)
        })
    })

    it("should make 2 calls to search", async () => {
        await searchComponent.instance().getProducts();
        const searchSpy = jest.spyOn(searchComponent.instance(), 'search')
        let event = {
            target: {
                value: 'T'
            }
        }
        searchComponent.instance().debounceSearch(event);

        event = {
            target: {
                value: 'To'
            }
        }
        setTimeout(() => {
            searchComponent.instance().debounceSearch(event);
        }, debounceTimeout + 1)

        return new Promise( resolve => {
            setTimeout(() => {
                expect(searchSpy).toHaveBeenCalledTimes(2);
                resolve(true)
            }, debounceTimeout * 3)
        })
    })
})
