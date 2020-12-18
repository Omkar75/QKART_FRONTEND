import React from "react";
import Login from '../components/Login'
import { render, unmountComponentAtNode } from "react-dom";
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
const fs = require('fs')

let container = null;
let loginComponent = {};


beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

beforeAll(() => {
    window.matchMedia =
        window.matchMedia ||
        function () {
            return {
                matches: false,
                addListener: function () { },
                removeListener: function () { }
            };
        };

    window.fetch = async (url, options) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    json: async () => {
                        return new Promise((resolveNested) => {
                            if (url.split("/")[url.split("/").length - 1] === "login") {
                                resolveNested({
                                    success: true,
                                    token: "testtoken",
                                    username: "test123",
                                });
                            }
                        })
                    }
                })
            }, 500);
        });
    }

    loginComponent = mount(
        <BrowserRouter>
            <Login.WrappedComponent
                history={{
                    push: (value) => {
                        expect(value).toBe('/products');
                    }
                }}
            />
        </ BrowserRouter>
    ).find("Login");
})

describe('Check UI for Login page component (UI)', () => {
    test('Username field exists in Login page', () => {
        expect(loginComponent.find('input[type="text"]').exists()).toBe(true);
    });

    test('Password field exists in Login page', () => {
        expect(loginComponent.find('input[type="password"]').exists()).toBe(
            true
        );
    });

    test('Submit button exists in Login page', () => {
        expect(loginComponent.find('button').exists()).toBe(true);
    });
});


