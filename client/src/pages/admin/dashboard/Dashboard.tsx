import "./Dashboard.scss";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,240",
      change: "+12.5%",
    },
    {
      title: "Total Products",
      value: "86",
      change: "+8.2%",
    },
    {
      title: "Total Orders",
      value: "342",
      change: "+18.4%",
    },
    {
      title: "Total Sales",
      value: "Rs. 842,500",
      change: "+15.7%",
    },
  ];

  const recentOrders = [
    {
      id: "#1001",
      customer: "Ali Ahmed",
      amount: "Rs. 8,500",
      status: "Pending",
    },
    {
      id: "#1002",
      customer: "Ahmed Khan",
      amount: "Rs. 5,200",
      status: "Shipped",
    },
    {
      id: "#1003",
      customer: "Sara Malik",
      amount: "Rs. 12,400",
      status: "Delivered",
    },
    {
      id: "#1004",
      customer: "Hassan Ali",
      amount: "Rs. 6,800",
      status: "Confirmed",
    },
    {
      id: "#1005",
      customer: "Ayesha Noor",
      amount: "Rs. 4,500",
      status: "Pending",
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="admin-dashboard__heading">
        <div>
          <span>OVERVIEW</span>
          <h1>Dashboard</h1>
        </div>

        <p>Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="admin-dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.title} className="admin-dashboard__stat">
            <div className="admin-dashboard__stat-top">
              <span>{stat.title}</span>

              <div className="admin-dashboard__stat-icon">•</div>
            </div>

            <strong>{stat.value}</strong>

            <small>
              <b>{stat.change}</b> from last month
            </small>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="admin-dashboard__grid">
        {/* Recent Orders */}
        <section className="admin-dashboard__orders">
          <div className="admin-dashboard__section-header">
            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Recent Orders</h2>
            </div>

            <a href="/admin/orders">View All</a>
          </div>

          <div className="admin-dashboard__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span
                        className={`status status--${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Order Summary */}
        <section className="admin-dashboard__summary">
          <div className="admin-dashboard__section-header">
            <div>
              <span>ORDERS</span>
              <h2>Order Status</h2>
            </div>
          </div>

          <div className="admin-dashboard__summary-list">
            <div>
              <span>Pending</span>
              <strong>42</strong>
            </div>

            <div>
              <span>Confirmed</span>
              <strong>65</strong>
            </div>

            <div>
              <span>Shipped</span>
              <strong>38</strong>
            </div>

            <div>
              <span>Delivered</span>
              <strong>187</strong>
            </div>

            <div>
              <span>Cancelled</span>
              <strong>10</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
