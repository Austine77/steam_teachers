import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {

  const stats = [
    { title:"Total Earnings", value:"$28,450", change:"+12.5%" },
    { title:"New Enrollments", value:"589", change:"+8.2%" },
    { title:"Certificates Issued", value:"492", change:"--" },
    { title:"Pending Requests", value:"41", change:"--" }
  ];

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <h2 className="logo">STEAM ONE</h2>

        <nav>
          <a className="active">Dashboard</a>
          <a>Users</a>
          <a>Enrollments</a>
          <a>Courses</a>
          <a>Marketplace</a>
          <a>Payments</a>
          <a>Certificates</a>
          <a>Contact Requests</a>
          <a>Recruiting</a>
          <a>Consulting Leads</a>
          <a>Emails</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>

        <div className="admin-user">
          <div>Admin</div>
          <small>admin@steamoneplatform.com</small>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <div className="admin-header">

          <div>
            <h1>Welcome Back, Admin!</h1>
          </div>

          <input className="search" placeholder="Search..." />

        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">

          {stats.map((s,i)=>(
            <div key={i} className="stat-card">
              <h3>{s.value}</h3>
              <p>{s.title}</p>
              <span>{s.change}</span>
            </div>
          ))}

        </div>

        {/* TABLE SECTION */}
        <div className="table-grid">

          <div className="table-card">
            <h3>Recent Payments</h3>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Jane Doe</td><td>$199</td><td>Mar 14</td></tr>
                <tr><td>Laura Kim</td><td>$299</td><td>Mar 12</td></tr>
                <tr><td>Mike Lee</td><td>$249</td><td>Mar 03</td></tr>
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h3>Pending Contact Requests</h3>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Laura Kim</td><td>Mar 13</td><td>✔</td></tr>
                <tr><td>John Park</td><td>Mar 14</td><td>✔</td></tr>
                <tr><td>Sara Tanaka</td><td>Mar 9</td><td>✔</td></tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* CHART AREA */}
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            Chart placeholder (connect chart library later)
          </div>
        </div>

      </main>

    </div>
  );
}