import { useState } from "react";

import { useCreateContactMessageMutation } from "../../store/api/contactApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

import "./Contact.scss";

const Contact = () => {
  const [createContactMessage, { isLoading }] =
    useCreateContactMessageMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createContactMessage({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        message: formData.message,
      }).unwrap();

      showToast(result.message, "success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <main className="contact">
      <section className="contact__hero">
        <span className="contact__eyebrow">LIBAAS CONTACT</span>

        <h1>We’d Love To Hear From You</h1>

        <p>
          Have a question about your order, products, or anything else? Send us
          a message and our team will get back to you.
        </p>
      </section>

      <section className="contact__container">
        <div className="contact__info">
          <span className="contact__label">GET IN TOUCH</span>

          <h2>Let’s Talk</h2>

          <p>
            Whether you need help with an order or want to know more about our
            products, feel free to contact us.
          </p>

          <div className="contact__details">
            <div className="contact__detail">
              <span>Email</span>
              <strong>support@libaas.com</strong>
            </div>

            <div className="contact__detail">
              <span>Phone</span>
              <strong>+92 300 8608881</strong>
            </div>

            <div className="contact__detail">
              <span>Hours</span>
              <strong>Mon - Sat, 10:00 AM - 8:00 PM</strong>
            </div>
          </div>
        </div>

        <div className="contact__form-wrapper">
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__fields">
              <div className="contact__field">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field contact__field--full">
                <label htmlFor="email">
                  Email Address <span>(Optional)</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="contact__field contact__field--full">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="contact__submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
