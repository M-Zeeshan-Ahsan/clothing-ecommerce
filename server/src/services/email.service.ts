import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================
// Customer Order Confirmation
// =========================

interface SendOrderConfirmationEmailParams {
  to: string;
  customerName: string;
  orderId: number;
  totalAmount: string | number;
  paymentMethod: string;
  items: {
    productName: string;
    quantity: number;
    price: string | number;
  }[];
  subtotal: string | number;
  shippingFee: string | number;
  address: string;
  city: string;
}

export const sendOrderConfirmationEmail = async ({
  to,
  customerName,
  orderId,
  totalAmount,
  paymentMethod,
  items,
  subtotal,
  shippingFee,
  address,
  city,
}: SendOrderConfirmationEmailParams) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #eeeeee;">
            <div style="font-size: 14px; font-weight: 600; color: #222;">
              ${item.productName}
            </div>

            <div style="font-size: 13px; color: #777; margin-top: 4px;">
              Qty: ${item.quantity}
            </div>
          </td>

          <td
            style="
              padding: 14px 0;
              border-bottom: 1px solid #eeeeee;
              text-align: right;
              font-size: 14px;
              color: #222;
              white-space: nowrap;
            "
          >
            Rs. ${item.price}
          </td>
        </tr>
      `,
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject: `Order #${orderId} Confirmed | ESHANI`,

    html: `
      <!DOCTYPE html>
      <html>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f6f6f6;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
          "
        >

          <div
            style="
              max-width: 620px;
              margin: 30px auto;
              background: #ffffff;
            "
          >

            <!-- Header -->

            <div
              style="
                padding: 28px 35px;
                border-bottom: 1px solid #eeeeee;
                text-align: center;
              "
            >
              <div
                style="
                  font-size: 25px;
                  font-weight: 700;
                  letter-spacing: 4px;
                  color: #111111;
                "
              >
                ESHANI
              </div>

              <div
                style="
                  margin-top: 7px;
                  font-size: 12px;
                  color: #888888;
                  letter-spacing: 1px;
                "
              >
                PREMIUM FASHION
              </div>
            </div>

            <!-- Main Content -->

            <div style="padding: 35px;">

              <!-- Confirmation -->

              <div style="text-align: center;">

                <div
                  style="
                    width: 48px;
                    height: 48px;
                    line-height: 48px;
                    margin: 0 auto 18px;
                    border-radius: 50%;
                    background: #f2f2f2;
                    font-size: 22px;
                  "
                >
                  ✓
                </div>

                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    color: #111111;
                  "
                >
                  Order Confirmed
                </h1>

                <p
                  style="
                    margin: 12px 0 0;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #666666;
                  "
                >
                  Thank you, ${customerName}. Your order has been
                  successfully placed.
                </p>

              </div>

              <!-- Order Number -->

              <div
                style="
                  margin-top: 30px;
                  padding: 18px;
                  background: #f8f8f8;
                  text-align: center;
                "
              >
                <div
                  style="
                    font-size: 12px;
                    color: #777777;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                  "
                >
                  Order Number
                </div>

                <div
                  style="
                    margin-top: 7px;
                    font-size: 20px;
                    font-weight: 600;
                    color: #111111;
                  "
                >
                  #${orderId}
                </div>
              </div>

              <!-- Order Summary -->

              <h3
                style="
                  margin: 30px 0 15px;
                  font-size: 16px;
                  font-weight: 600;
                "
              >
                Order Summary
              </h3>

              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                "
              >
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Pricing -->

              <div style="margin-top: 20px;">

                <div
                  style="
                    padding: 7px 0;
                    font-size: 14px;
                    color: #666666;
                  "
                >
                  <span>Subtotal</span>
                  <span style="float: right;">
                    Rs. ${subtotal}
                  </span>
                </div>

                <div
                  style="
                    padding: 7px 0;
                    font-size: 14px;
                    color: #666666;
                  "
                >
                  <span>Shipping</span>
                  <span style="float: right;">
                    Rs. ${shippingFee}
                  </span>
                </div>

                <div
                  style="
                    margin-top: 10px;
                    padding-top: 15px;
                    border-top: 1px solid #eeeeee;
                    font-size: 17px;
                    font-weight: 600;
                    color: #111111;
                  "
                >
                  <span>Total</span>
                  <span style="float: right;">
                    Rs. ${totalAmount}
                  </span>
                </div>

              </div>

              <!-- Payment Method -->

              <div style="margin-top: 28px;">

                <h3
                  style="
                    margin: 0 0 12px;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Payment Method
                </h3>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    color: #666666;
                  "
                >
                  ${paymentMethod}
                </p>

              </div>

              <!-- Delivery Address -->

              <div style="margin-top: 25px;">

                <h3
                  style="
                    margin: 0 0 12px;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Delivery Address
                </h3>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #666666;
                  "
                >
                  ${address}<br />
                  ${city}
                </p>

              </div>

              <!-- Processing Message -->

              <div
                style="
                  margin-top: 30px;
                  padding: 18px;
                  background: #fafafa;
                  font-size: 13px;
                  line-height: 1.7;
                  color: #666666;
                "
              >
                We've received your order and will start processing it
                shortly. We'll keep you updated about your order.
              </div>

              <p
                style="
                  margin: 30px 0 0;
                  text-align: center;
                  font-size: 13px;
                  color: #888888;
                "
              >
                Thank you for choosing ESHANI.
              </p>

            </div>

            <!-- Footer -->

            <div
              style="
                padding: 22px 35px;
                background: #111111;
                text-align: center;
              "
            >
              <div
                style="
                  font-size: 15px;
                  font-weight: 600;
                  letter-spacing: 3px;
                  color: #ffffff;
                "
              >
                ESHANI
              </div>

              <div
                style="
                  margin-top: 7px;
                  font-size: 11px;
                  color: #999999;
                "
              >
                Thank you for shopping with us.
              </div>
            </div>

          </div>

        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Order confirmation email failed:", error);
    return null;
  }

  return data;
};

// =========================
// New Order Notification
// =========================

interface SendNewOrderNotificationEmailParams {
  orderId: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string | null;
  items: {
    productName: string;
    quantity: number;
    price: string | number;
  }[];
  subtotal: string | number;
  shippingFee: string | number;
  totalAmount: string | number;
  paymentMethod: string;
}

export const sendNewOrderNotificationEmail = async ({
  orderId,
  customerName,
  customerEmail,
  phone,
  address,
  city,
  postalCode,
  items,
  subtotal,
  shippingFee,
  totalAmount,
  paymentMethod,
}: SendNewOrderNotificationEmailParams) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.productName}
          </td>

          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.quantity}
          </td>

          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            Rs. ${item.price}
          </td>
        </tr>
      `,
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: "eshani.support@gmail.com",
    subject: `New Order #${orderId} - ESHANI`,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          padding: 30px;
        "
      >

        <h2 style="color: #111;">
          New Order Received 🎉
        </h2>

        <p>
          A new order has been placed on ESHANI.
        </p>

        <!-- Order Information -->

        <div
          style="
            margin: 25px 0;
            padding: 20px;
            background: #f7f7f7;
          "
        >

          <p>
            <strong>Order ID:</strong> #${orderId}
          </p>

          <p>
            <strong>Customer:</strong> ${customerName}
          </p>

          <p>
            <strong>Email:</strong> ${customerEmail}
          </p>

          <p>
            <strong>Phone:</strong> ${phone}
          </p>

          <p>
            <strong>Payment Method:</strong> ${paymentMethod}
          </p>

        </div>

        <!-- Shipping Address -->

        <h3>Shipping Address</h3>

        <p>
          ${address}<br />
          ${city}${postalCode ? `, ${postalCode}` : ""}
        </p>

        <!-- Order Items -->

        <h3>Order Items</h3>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
          "
        >

          <thead>
            <tr>
              <th style="text-align: left; padding: 10px;">
                Product
              </th>

              <th style="text-align: left; padding: 10px;">
                Qty
              </th>

              <th style="text-align: left; padding: 10px;">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>

        </table>

        <!-- Order Total -->

        <div
          style="
            margin-top: 25px;
            padding: 20px;
            background: #f7f7f7;
          "
        >

          <p>
            <strong>Subtotal:</strong>
            Rs. ${subtotal}
          </p>

          <p>
            <strong>Shipping:</strong>
            Rs. ${shippingFee}
          </p>

          <p>
            <strong>Total:</strong>
            Rs. ${totalAmount}
          </p>

        </div>

        <p style="margin-top: 30px;">
          <strong>ESHANI</strong>
        </p>

      </div>
    `,
  });

  if (error) {
    console.error("New order notification email failed:", error);
    return null;
  }

  return data;
};
