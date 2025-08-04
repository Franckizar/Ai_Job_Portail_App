'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, CreditCard, Smartphone, RotateCw } from 'lucide-react';

interface InvoiceItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: number;
  items: InvoiceItem[];
  dateIssued: string;
  totalAmount: number;
  status: string;
  dueDate: string;
  paymentMethod: string | null;
  transactionId: string | null;
  paymentDate: string | null;
}

export default function InvoicePaymentSystem() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    paymentMethod: 'mobile_money',
    description: 'Payment for medical services'
  });
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch invoices for the current patient
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('https://wambs-clinic.onrender.com/api/v1/auth/invoices/patient/1');
        if (!response.ok) throw new Error('Failed to fetch invoices');
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handlePayInvoice = async () => {
    if (!selectedInvoice) return;
    
    setIsPaying(true);
    try {
      const response = await fetch(
        `https://wambs-clinic.onrender.com/api/v1/auth/invoices/${selectedInvoice.id}/pay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) throw new Error('Payment failed');

      // Refresh invoices after successful payment
      const updatedResponse = await fetch('https://wambs-clinic.onrender.com/api/v1/auth/invoices/patient/1');
      const updatedData = await updatedResponse.json();
      setInvoices(updatedData);
      
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment error occurred');
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Paid
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Unpaid
          </span>
        );
      case 'payment_error':
      case 'payment_failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Invoices</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and pay your outstanding medical invoices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice List */}
          <div className="lg:col-span-2 space-y-4">
            {invoices.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
                    invoice.status.toLowerCase() === 'paid'
                      ? 'border-green-500'
                      : invoice.status.toLowerCase() === 'unpaid'
                      ? 'border-yellow-500'
                      : 'border-red-500'
                  } transition-all hover:shadow-md cursor-pointer ${
                    selectedInvoice?.id === invoice.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Invoice #{invoice.id}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Issued: {formatDate(invoice.dateIssued)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(invoice.status)}
                      <span className="text-lg font-bold text-gray-900">
                        ${invoice.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {invoice.items.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                      <ul className="space-y-2">
                        {invoice.items.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity} × ${item.unitPrice.toFixed(2)}
                            </span>
                            <span className="font-medium text-gray-900">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                    {invoice.paymentMethod && (
                      <p className="text-sm text-gray-500">
                        Method: {invoice.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

            {selectedInvoice ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        value={selectedInvoice.totalAmount.toFixed(2)}
                        readOnly
                        className="bg-gray-50 block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={paymentData.phoneNumber}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, phoneNumber: e.target.value })
                      }
                      placeholder="652972651"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentData({ ...paymentData, paymentMethod: 'mobile_money' })
                        }
                        className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium ${
                          paymentData.paymentMethod === 'mobile_money'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        Mobile Money
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentData({ ...paymentData, paymentMethod: 'card' })
                        }
                        className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium ${
                          paymentData.paymentMethod === 'card'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Card
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={paymentData.description}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, description: e.target.value })
                      }
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handlePayInvoice}
                    disabled={isPaying || !paymentData.phoneNumber}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isPaying || !paymentData.phoneNumber
                        ? 'bg-blue-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isPaying ? (
                      <>
                        <RotateCw className="animate-spin mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${selectedInvoice.totalAmount.toFixed(2)}`
                    )}
                  </button>
                </div>

                {paymentSuccess && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Payment successful!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Invoice #{selectedInvoice.id} has been paid successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No invoice selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an invoice from the list to make a payment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}