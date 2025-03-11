import React from "react";
import InvoiceList from "../../project/invoice/InvoiceList";

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
`;

const InvoiceListWithStyles = () => (
  <>
    <style>{styles}</style>
    <InvoiceList />
  </>
);

export default InvoiceListWithStyles;
