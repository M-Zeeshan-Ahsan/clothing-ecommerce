import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationEmailParams {
  to: string;
  customerName: string;
  orderId: number;
  totalAmount: string | number;
  paymentMethod: string;
}

export const sendOrderConfirmationEmail = async ({
  to,
  customerName,
  orderId,
  totalAmount,
  paymentMethod,
}: SendOrderConfirmationEmailParams) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject: `Order #${orderId} placed successfully`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        
        <h2 style="color: #111;">
          Thank you for your order, ${customerName}!
        </h2>

        <p>
          Your order has been placed successfully.
        </p>

        <div style="margin: 25px 0; padding: 20px; background: #f7f7f7;">
          <p><strong>Order:</strong> #${orderId}</p>
          <p><strong>Total:</strong> Rs. ${totalAmount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>

        <p>
          We have received your order and will process it shortly.
        </p>

        <p>
          Thank you for shopping with us.
        </p>

        <p style="margin-top: 30px;">
          <strong>ESHANI</strong>
        </p>

      </div>
    `,
  });

  if (error) {
    console.error("Order confirmation email failed:", error);
    return null;
  }

  return data;
};
