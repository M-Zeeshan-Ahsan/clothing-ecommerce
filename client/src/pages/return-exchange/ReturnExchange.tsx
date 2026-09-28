import "./ReturnExchange.scss";

const ReturnExchange = () => {
  return (
    <main className="return-exchange">
      <section className="return-exchange__hero">
        <span className="return-exchange__eyebrow">LIBAAS</span>

        <h1>Return & Exchange</h1>

        <p>
          We want you to be happy with your purchase. Please review our return
          and exchange policy before requesting a return.
        </p>
      </section>

      <section className="return-exchange__container">
        <div className="return-exchange__highlight">
          <div>
            <span>RETURN WINDOW</span>
            <strong>7 Days</strong>
          </div>

          <div>
            <span>EXCHANGE</span>
            <strong>Available</strong>
          </div>

          <div>
            <span>CONDITION</span>
            <strong>Unused & Original</strong>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">01</span>

          <div>
            <h2>Return Window</h2>

            <p>
              You can request a return or exchange within 7 days of receiving
              your order.
            </p>

            <p>
              Requests submitted after the 7-day period may not be accepted.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">02</span>

          <div>
            <h2>Eligible Products</h2>

            <p>To be eligible for a return or exchange, the product must be:</p>

            <ul>
              <li>Unused and unworn</li>
              <li>Unwashed and free from any damage</li>
              <li>In its original condition</li>
              <li>Returned with original packaging and tags</li>
              <li>Free from stains, odors, or alterations</li>
            </ul>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">03</span>

          <div>
            <h2>Items That Cannot Be Returned</h2>

            <p>
              Products may not be eligible for return or exchange if they have
              been worn, washed, altered, damaged, stained, or are missing their
              original tags or packaging.
            </p>

            <p>
              Items that do not meet our return conditions may be sent back to
              the customer.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">04</span>

          <div>
            <h2>Damaged or Incorrect Items</h2>

            <p>
              If you receive a damaged, defective, or incorrect product, please
              contact us as soon as possible after receiving your order.
            </p>

            <p>
              Please provide your order number along with clear pictures or
              videos of the issue so our team can review your request.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">05</span>

          <div>
            <h2>Exchange Policy</h2>

            <p>
              Exchanges are subject to product availability. If the requested
              replacement product or size is unavailable, we may offer an
              alternative solution.
            </p>

            <p>
              The replacement product must meet the same return conditions
              mentioned above.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">06</span>

          <div>
            <h2>Return Shipping</h2>

            <p>
              For returns due to a change of mind, the customer may be
              responsible for the return shipping cost.
            </p>

            <p>
              If the product is damaged, defective, or incorrectly delivered due
              to an error on our side, LIBAAS will review the case and determine
              the applicable solution.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">07</span>

          <div>
            <h2>Refunds</h2>

            <p>
              Once the returned product has been received and inspected, we will
              notify you whether your return has been approved.
            </p>

            <p>
              Since LIBAAS currently offers Cash on Delivery, refund
              arrangements will be communicated to the customer separately when
              applicable.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">08</span>

          <div>
            <h2>How to Request a Return</h2>

            <p>
              To request a return or exchange, contact our customer support team
              through the Contact Us page.
            </p>

            <p>
              Please provide your order number, phone number, reason for the
              return, and supporting pictures when required.
            </p>
          </div>
        </div>

        <div className="return-exchange__section">
          <span className="return-exchange__number">09</span>

          <div>
            <h2>Inspection</h2>

            <p>
              All returned products are inspected before a return or exchange is
              approved. Approval depends on the product meeting the conditions
              stated in this policy.
            </p>
          </div>
        </div>

        <div className="return-exchange__section return-exchange__section--last">
          <span className="return-exchange__number">10</span>

          <div>
            <h2>Need Help?</h2>

            <p>
              If you have any questions about a return or exchange, please
              contact our support team with your order details. We will be happy
              to assist you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReturnExchange;
