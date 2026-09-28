import "./Shipping.scss";

const Shipping = () => {
  return (
    <main className="shipping">
      <section className="shipping__hero">
        <span className="shipping__eyebrow">LIBAAS</span>

        <h1>Shipping & Delivery</h1>

        <p>
          Everything you need to know about order processing, delivery times,
          shipping charges, and receiving your LIBAAS order.
        </p>
      </section>

      <section className="shipping__container">
        <div className="shipping__highlight">
          <div>
            <span>SHIPPING CHARGE</span>
            <strong>Rs. 199</strong>
          </div>

          <div>
            <span>PAYMENT METHOD</span>
            <strong>Cash on Delivery</strong>
          </div>

          <div>
            <span>DELIVERY</span>
            <strong>Pakistan Nationwide</strong>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">01</span>

          <div>
            <h2>Order Processing</h2>

            <p>
              Once your order is successfully placed, our team will review and
              process it for delivery.
            </p>

            <p>
              Orders are generally prepared for dispatch after confirmation.
              Processing time may vary depending on product availability and
              order volume.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">02</span>

          <div>
            <h2>Delivery Time</h2>

            <p>
              Delivery usually takes approximately 3–7 working days after your
              order has been dispatched.
            </p>

            <p>
              Delivery times may vary depending on your location, courier
              service, weather conditions, public holidays, and other
              circumstances beyond our control.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">03</span>

          <div>
            <h2>Shipping Charges</h2>

            <p>
              A standard shipping fee of <strong>Rs. 199</strong> is currently
              applicable to orders.
            </p>

            <p>
              The applicable shipping charge will be shown in your order summary
              before you place your order.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">04</span>

          <div>
            <h2>Cash on Delivery</h2>

            <p>
              LIBAAS currently offers Cash on Delivery (COD) as the available
              payment method.
            </p>

            <p>
              You will pay the complete order amount to the courier when your
              order is delivered.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">05</span>

          <div>
            <h2>Delivery Address</h2>

            <p>
              Please make sure that your name, phone number, city, and complete
              delivery address are correct before placing your order.
            </p>

            <p>
              LIBAAS is not responsible for delivery issues caused by incomplete
              or incorrect information provided by the customer.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">06</span>

          <div>
            <h2>Courier Delivery</h2>

            <p>
              Your order may be delivered through a third-party courier service.
              The courier may contact you on the phone number provided during
              checkout.
            </p>

            <p>
              Please keep your phone available around the expected delivery time
              so that the courier can reach you.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">07</span>

          <div>
            <h2>Delayed Deliveries</h2>

            <p>
              Occasionally, deliveries may take longer than the estimated time
              due to weather, public holidays, courier delays, high order
              volumes, or other unexpected circumstances.
            </p>

            <p>
              We appreciate your patience in such situations and will assist you
              whenever possible.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">08</span>

          <div>
            <h2>Order Not Received</h2>

            <p>
              If your order has not arrived within the expected delivery period,
              please contact our customer support team with your order number
              and phone number.
            </p>
          </div>
        </div>

        <div className="shipping__section">
          <span className="shipping__number">09</span>

          <div>
            <h2>Failed Delivery Attempts</h2>

            <p>
              If the courier is unable to deliver your order because the
              customer is unavailable or the provided address or contact
              information is incorrect, additional delivery attempts may depend
              on the courier's policy.
            </p>
          </div>
        </div>

        <div className="shipping__section shipping__section--last">
          <span className="shipping__number">10</span>

          <div>
            <h2>Need Help?</h2>

            <p>
              If you have any questions about your shipment or delivery, please
              contact us through our Contact Us page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shipping;
