import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Rate } from "antd";
import React from "react";
import "./Product.css";

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
 * The goal is to display an individual product as a card displaying relevant product properties
 * Product image and product title are primary information
 * Secondary information to be displayed includes cost, rating and category
 * We also need a button to add the product to cart from the product listing
 * @param {Product} product The product object to be displayed
 * @param {function} addToCart Function to call when user clicks on a Product card's 'Add to cart' button
 * @returns {JSX} HTML and JSX to be rendered
 */
export default function Product(props) {
  return (
    <Card className="product" hoverable>
      <img className="product-image" alt="product" src={props.product.image} />
      <div className="product-info">
        <div className="product-info-text">
          <div className="product-title">{props.product.name}</div>
          <div className="product-category">{`Category: ${props.product.category}`}</div>
        </div>
        <div className="product-info-utility">
          <div className="product-cost">{`₹${props.product.cost}`}</div>
          <div>

          </div>
          <Button
            shape="round"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={props.addToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
