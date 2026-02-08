import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD", // ✅ Optional: Set currency explicitly
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: parseFloat(amount).toFixed(2) // ✅ Ensure it's a string
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            onSuccess(details); // ✅ Use details to get payer info
          });
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          if (onError) onError(err); // ✅ Defensive check
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;