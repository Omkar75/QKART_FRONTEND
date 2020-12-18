import { Button, message, Radio, Row, Col } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Cart from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

/**
 * @typedef {Object} Product
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} Address
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @class Checkout component handles the Checkout page UI and functionality
 * Contains the following fields
 * @property {React.RefObject} cartRef Reference to Cart component (to trigger certain methods within the cart component)
 * @property {Product[]} state.products List of products fetched from backend
 * @property {Address[]} state.addresses List of user's addresses fetched from backend
 * @property {number} state.selectedAddressIndex Index for which of the user's addresses is currently selected
 * @property {string} state.newAddress Data binding for the input field to enter a new address
 * @property {number} state.balance Balance amount in the current user's wallet
 * @property {boolean} state.loading Indicates background action pending completion. When true, further UI actions might be blocked
 */
class Checkout extends React.Component {
  constructor() {
    super();
    this.cartRef = React.createRef();
    this.state = {
      products: [],
      addresses: [],
      selectedAddressIndex: 0,
      newAddress: "",
      balance: 0,
      loading: false,
    };
  }

  /**
   * Check the response of the getProducts() API call to be valid and handle any failures along the way
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   * @param {boolean} errored Represents whether an error occurred in the process of making the API call itself
   * @param {Product[]|{ success: boolean, message: string }} response The response JSON object which may contain further success or error messages
   * @returns {boolean} Whether validation has passed or not
   */
  validateGetProductsResponse = (errored, response) => {
    if (errored || (!response.length && !response.message)) {
      message.error(
        "Could not fetch products. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }
    if (!response.length) {
      message.error(response.message || "No products found in database");
      return false;
    }
    return true;
  };

  /**
   * Perform the API call to fetch all products from backend
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateGetProductsResponse(errored, response) function defined previously
   * -    If response passes validation, and the response exists,
   *      -   Update products state variable with the response
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  getProducts = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (await fetch(`${config.endpoint}/products`)).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });
    if (this.validateGetProductsResponse(errored, response)) {
      if (response) {
        this.setState({
          products: response,
        });
      }
    }
  };

  /**
   * Check the response of other API calls to be valid and handle any failures along the way
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   * @param {boolean} errored Represents whether an error occurred in the process of making the API call itself
   * @param {Address[]|{ success: boolean, message?: string }} response The response JSON object which may contain further success or error messages
   * @param {string} couldNot String indicating what could not be loaded
   * @returns {boolean} Whether validation has passed or not
   */
  validateResponse = (errored, response, couldNot) => {
    if (errored) {
      message.error(
        `Could not ${couldNot}. Check that the backend is running, reachable and returns valid JSON.`
      );
      return false;
    }
    if (response.message) {
      message.error(response.message);
      return false;
    }
    return true;
  };

  /**
   * Perform the API call to fetch the user's addresses from backend
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response, couldNot) function defined previously
   * -    If response passes validation, update the addresses state variable
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "m_rg_eW5kLALNcn70kpyR",
   *          "address": "No. 341, Banashankari, Bangalore, India"
   *      },
   *      {
   *          "_id": "9sW_60WkwrT7gDPmgUdoP",
   *          "address": "123 Main Street, New York, NY 10030"
   *      },
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  getAddresses = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (
        await fetch(`${config.endpoint}/user/addresses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response, "fetch addresses")) {
      if (response) {
        this.setState({
          addresses: response,
        });
      }
    }
  };

  /**
   * Perform the API call to add an address for the user
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response, couldNot) function defined previously
   * -    If response passes validation, and response exists,
   *      -   Show an appropriate success message
   *      -   Clear the new address input field
   *      -   Call getAddresses() to refresh list of addresses
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Address should be greater than 20 characters"
   * }
   */
  addAddress = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (
        await fetch(`${config.endpoint}/user/addresses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: this.state.newAddress,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response, "add a new address")) {
      if (response) {
        message.success("Address added");
        this.setState({
          newAddress: "",
        });
        await this.getAddresses();
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Implement deleteAddresses() to make DELETE API request to the backend API path "/user/addresses/:userid"
  /**
   * Perform the API call to delete an address for the user
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response, couldNot) function defined previously
   * -    If response passes validation, and response exists,
   *      -   Show an appropriate success message
   *      -   Call getAddresses() to refresh list of addresses
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 404
   * {
   *      "success": false,
   *      "message": "Address to delete was not found"
   * }
   * @param {string} addressId ID of the address record to delete
   */
  deleteAddress = async (addressId) => {
  };

  /**
   * Perform the API call to place an order
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response, couldNot) function defined previously
   * -    If response passes validation, and response exists,
   *      -   Show an appropriate success message
   *      -   Update the localStorage field for `balance` to reflect the new balance
   *      -   Redirect the user to the thanks page
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Wallet balance not sufficient to place order"
   * }
   * @param {string} addressId ID of the address record to delete
   */
  checkout = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (
        await fetch(`${config.endpoint}/cart/checkout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: this.state.addresses[this.state.selectedAddressIndex]._id,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response, "checkout")) {
      if (response) {
        // TODO: CRIO_TASK_MODULE_CHECKOUT - Display a order successful message, update user's balance in localStorage and redirect to "/thanks" page
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Implement the order() method
  /**
   * Function that is called when the user clicks on the place order button
   * -    If the user's wallet balance is less than the total cost of the user's cart, then display an appropriate error message
   * -    Else if the user does not have any addresses, or has not selected an available address, then display an appropriate error message
   * -    Else call the checkout() method to proceed with placing and order
   */
  order = () => {
    if (this.state.balance < this.cartRef.current.calculateTotal()) {
      message.error(
        "You do not have enough balance in your wallet for this purchase"
      );
    } else if (
      !this.state.addresses.length ||
      !this.state.addresses[this.state.selectedAddressIndex]
    ) {
      message.error("Please select an address or add a new address to proceed");
    } else {
      this.checkout();
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Implement the componentDidMount() lifecycle method
  /**
   * Function that runs when component has loaded
   * This is the function that is called when the user lands on the Checkout page
   * If the user is logged in (i.e. the localStorage fields for `username` and `token` exist), fetch products and addresses from backend (asynchronously) to component state
   * Update the balance state variable with the value stored in localStorage
   * Else, show an error message indicating that the user must be logged in first and redirect the user to the home page
   */
  async componentDidMount() {
  }

  /**
   * JSX and HTML goes here
   * We display the cart component as the main review for the user on this page (Cart component must know that it should be non-editable)
   * We display the payment method and wallet balance
   * We display the list of addresses for the user to select from
   * If the user has no addresses, appropriate text is displayed instead
   * A text field (and button) is required so the user may add a new address
   * We display a link to the products page if the user wants to shop more or update cart
   * A button to place the order is displayed
   */
  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    return (
      <>
        <Header history={this.props.history} />
        <div className="checkout-container">
          <Row>
            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Cart should be shown on top of  Shipping and Pricing blocks in "xs" devices */}
            {/* <Col xs={{ span: 24 }} md={{ span: 18 }}> */}
              <div className="checkout-shipping">
                <h1 style={{ marginBottom: "-10px" }}>Shipping</h1>
                <hr></hr>
                <br></br>
                <p>
                  Manage all the shipping addresses you want (work place, home
                  address)<br></br>This way you won't have to enter the shipping
                  address manually with each order.
                </p>
                <div className="address-section">
                  {this.state.addresses.length ? (
                    <Radio.Group
                      className="addresses"
                      defaultValue={this.state.selectedAddressIndex}
                      onChange={(e) => {
                        this.setState({
                          selectedAddressIndex: e.target.value,
                        });
                      }}
                    >
                      
                      <Row>
                        {this.state.addresses.map((address, index) => (
                          <Col xs={24} lg={12} key={address._id}>
                            <div className="address">
                              <Radio.Button value={index}>
                                <div className="address-box">
                                  <div className="address-text">
                                    {address.address}
                                  </div>
                                  <Button
                                    type="primary"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Radio.Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  ) : (
                      <div className="red-text checkout-row">
                        No addresses found. Please add one to proceed.
                      </div>
                    )}
                  <div className="checkout-row">
                    <div>
                      <TextArea
                        className="new-address"
                        placeholder="Add new address"
                        rows={4}
                        value={this.state.newAddress}
                        onChange={(e) => {
                          this.setState({
                            newAddress: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Button type="primary" onClick={this.addAddress}>
                        Add New Address
                      </Button>
                    </div>
                  </div>
                </div>
                <br></br>
                <div>
                  <h1 style={{ marginBottom: "-10px" }}>Pricing</h1>
                  <hr></hr>
                  <h2>Payment Method</h2>
                  <Radio.Group value={1}>
                    <Radio style={radioStyle} value={1}>
                      Wallet
                      <strong> (₹{this.state.balance} available)</strong>
                    </Radio>
                  </Radio.Group>
                </div>
                <br></br>
                <Button
                  className="ant-btn-success"
                  loading={this.state.loading}
                  type="primary"
                  onClick={this.order}
                >
                  <strong>Place Order</strong>
                </Button>
              </div>
            </Col>
            {/* <Col xs={{ span: 24 }} md={6} className="checkout-cart"> */}
              <div>
                {this.state.products.length && (
                  <Cart
                    ref={this.cartRef}
                    products={this.state.products}
                    history={this.props.history}
                    token={localStorage.getItem("token")}
                    checkout={true}
                  />
                )}
              </div>
            </Col>
          </Row>
          <Footer></Footer>
        </div>
      </>
    );
  }
}

export default withRouter(Checkout);
