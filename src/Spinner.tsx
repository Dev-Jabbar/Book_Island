// Spinner.js
import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <style>
        {`
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px; /* Set an appropriate height */
          }

          .spinner {
            border: 8px solid rgba(0, 0, 0, 0.1);
            border-left: 8px solid #333; /* Change the color of the spinner */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
