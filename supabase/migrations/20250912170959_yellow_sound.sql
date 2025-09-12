/*
  # Add function to decrement product stock

  1. Function
    - `decrement_stock` - Safely decrements product stock when orders are placed
  
  2. Security
    - Function can be called by authenticated users
    - Prevents stock from going below 0
*/

-- Create function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET stock = GREATEST(0, stock - quantity)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;