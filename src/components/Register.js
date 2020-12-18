import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

/**
 * @class Register component handles the Register page UI and functionality
 * Contains the following fields
 * @property {boolean} state.loading Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {string} state.username User given field for username
 * @property {string} state.password User given field for password
 * @property {string} state.confirmPassword User given field for retyping and confirming password
 */
class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }
  // TODO: CRIO_TASK_MODULE_LOGIN - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   * 
   * @returns {boolean} Whether validation has passed or not
   * 
   * Return false if any validation condition fails, otherwise return true.
   * -    Check that username field is not an empty value
   * -    Check that username field is not less than 6 characters in length
   * -    Check that username field is not more than 32 characters in length
   * -    Check that password field is not an empty value
   * -    Check that password field is not less than 6 characters in length
   * -    Check that password field is not more than 32 characters in length
   * -    Check that confirmPassword field has the same value as password field
   */
  validateInput = () => {
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Check API response
  /**
   * Check the response of the API call to be valid and handle any failures along the way
   * @param    {boolean}                                  errored     Represents whether an error occurred in the process of making the API call itself
   * @param    {{ success: boolean, message?: string }}   response    The response JSON object which may contain further success or error messages
   * 
   * @returns  {boolean}    Whether validation has passed or not
   * 
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   */
  validateResponse = (errored, response) => {
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
  * Perform the API call over the network and return the response
  * -    Set the loading state variable to true
  * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  * -    The call must be made asynchronously using Promises or async/await
  * -    The call must handle any errors thrown from the fetch call
  * -    Parse the result as JSON
  * -    Set the loading state variable to false once the call has completed
  * -    Call the validateResponse(errored, response) function defined previously
  * -    If response passes validation, return the response object
  *
  * Example for successful response from backend:
  * HTTP 200
  * {
  *      "success": true,
  * }
  *
  * Example for failed response from backend:
  * HTTP 400
  * {
  *      "success": false,
  *      "message": "Username is already taken"
  * }
  * @returns {{ success: boolean }|undefined} The response JSON object
  */
  performAPICall = async () => {
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Implement the register function
  /**
   * Definition for register handler
   * This is the function that is called when the user clicks on the register button or submits the register form
   * -    Call the previously defined validateInput() function and check that is returns true, i.e. the input values pass validation
   * -    Call the previously defined performAPICall() function asynchronously and capture the returned value in a variable
   * -    If the returned value exists,
   *      -   Clear the input fields
   *      -   Display a success message
   *      -   Redirect the user to the "/login" page
   */
  register = async () => {
     this.validateInput();
  };

  /**
   * JSX and HTML goes here
   * We require a text field, a password field, and a confirm password field (each with data binding to state), and a submit button that calls register()
   */
  render() {
    // Ant design library supports dynamic data binding and validation as in-built features in their components.
    // We're not using those features here intentionally to allow better learning of React constructs
    return (
      <>
        <Header history={this.props.history} />
        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />
            <Input.Password
              className="input-field"
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />
            <Button
              loading={this.state.loading}
              type="primary"
            >
              Register
            </Button>
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }
}

