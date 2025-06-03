
import React, { useEffect, useState } from 'react';
// import apiCalls from '../../utils/api';
import apiCalls from "../../../utils/api";


const PaymentsList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    apiCalls.getAdminPayments().then(res => setPayments(res.data || []));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[var(--accent-color)]/20">
          <thead>
            <tr className="bg-[var(--secondary-color)] text-[var(--accent-color)] text-sm">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t border-[var(--accent-color)]/20">
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.user?.name}</td>
                <td className="px-4 py-2">{p.book?.title}</td>
                <td className="px-4 py-2 text-right">₹{p.amount}</td>
                <td className="px-4 py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PaymentsList;

