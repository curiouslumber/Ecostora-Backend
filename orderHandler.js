// orderHandler.js

function generateUniqueOrderID() {
  // Define your logic to generate a unique order ID here
  // For example, you can use a timestamp, random number, etc.
  return 'ORD0000005'; // Example of a unique order ID
}

function insertOrder(pool, customer_id, address_id, product_id, order_status_code, date_order_placed, date_order_paid, order_price, quantity_ordered, order_payment_method) {
  const order_id = generateUniqueOrderID();

  const insertOrderQuery = `
    INSERT INTO orders (
      order_id,
      customer_id,
      product_id,
      address_id,
      order_status_code,
      date_order_placed,
      date_order_paid,
      order_price,
      quantity_ordered,
      order_payment_method
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;`;

  const params = [
    order_id,
    customer_id,
    product_id,
    address_id,
    order_status_code,
    date_order_placed,
    date_order_paid,
    order_price,
    quantity_ordered,
    order_payment_method
  ];

  return new Promise((resolve, reject) => {
    pool.query(insertOrderQuery, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
}

module.exports = { insertOrder };
