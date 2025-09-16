'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard, DollarSign, Users, TrendingUp, Calendar, 
  Search, Filter, Download, Eye, CheckCircle, XCircle,
  Clock, RefreshCw, AlertTriangle, BarChart3, PieChart,
  ChevronLeft, ChevronRight, MoreVertical, User, Phone
} from 'lucide-react';

const PaymentManagement = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const itemsPerPage = 10;
  const baseURL = 'http://localhost:8088';

  // Fetch total payment amount
  const fetchTotalAmount = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/subscriptions/total-amount`);
      const amount = await response.json();
      setTotalAmount(amount);
    } catch (error) {
      console.error('Error fetching total amount:', error);
    }
  };

  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/subscriptions/plans`);
      const plans = await response.json();
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return ['BASIC', 'PREMIUM', 'ENTERPRISE']; // Fallback
    }
  };

  // Mock function to simulate fetching all payments/subscriptions
  const fetchPaymentsData = async () => {
    // Since we don't have a direct endpoint for all payments, we'll simulate data
    // In a real implementation, you'd have an endpoint like /api/v1/auth/payments/all
    const mockPayments = [
      {
        id: 1,
        userId: 101,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        phoneNumber: '+237123456789',
        planType: 'PREMIUM',
        amount: 15.0,
        status: 'COMPLETED',
        transactionId: 'TXN001',
        createdAt: '2024-09-10T10:30:00',
        expiresAt: '2024-10-10T10:30:00'
      },
      {
        id: 2,
        userId: 102,
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        phoneNumber: '+237987654321',
        planType: 'BASIC',
        amount: 5.0,
        status: 'COMPLETED',
        transactionId: 'TXN002',
        createdAt: '2024-09-12T14:20:00',
        expiresAt: '2024-10-12T14:20:00'
      },
      {
        id: 3,
        userId: 103,
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        phoneNumber: '+237456789123',
        planType: 'ENTERPRISE',
        amount: 5.0,
        status: 'PENDING',
        transactionId: 'TXN003',
        createdAt: '2024-09-14T09:15:00',
        expiresAt: '2024-11-14T09:15:00'
      }
    ];
    
    setPayments(mockPayments);
    setSubscriptions(mockPayments);
  };

  // Check for expired subscriptions
  const checkExpiredSubscriptions = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/subscriptions/expire-check`, {
        method: 'POST'
      });
      if (response.ok) {
        // Refresh data after checking
        await fetchPaymentsData();
      }
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} XAF`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if subscription is expired
  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  // Get plan color
  const getPlanColor = (planType) => {
    const colors = {
      BASIC: { bg: 'bg-[var(--color-lamaYellowLight)]', text: 'text-[var(--color-lamaYellowDark)]' },
      PREMIUM: { bg: 'bg-[var(--color-lamaPurpleLight)]', text: 'text-[var(--color-lamaPurpleDark)]' },
      ENTERPRISE: { bg: 'bg-[var(--color-lamaSkyLight)]', text: 'text-[var(--color-lamaSkyDark)]' }
    };
    return colors[planType] || colors.BASIC;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: { bg: 'bg-[var(--color-lamaGreenLight)]', text: 'text-[var(--color-lamaGreenDark)]', icon: CheckCircle },
      PENDING: { bg: 'bg-[var(--color-lamaYellowLight)]', text: 'text-[var(--color-lamaYellowDark)]', icon: Clock },
      FAILED: { bg: 'bg-[var(--color-lamaRedLight)]', text: 'text-[var(--color-lamaRedDark)]', icon: XCircle },
      EXPIRED: { bg: 'bg-[var(--color-lamaRedLight)]', text: 'text-[var(--color-lamaRedDark)]', icon: AlertTriangle }
    };
    return colors[status] || colors.PENDING;
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.phoneNumber.includes(searchQuery);
    
    const matchesPlan = selectedPlan === 'ALL' || payment.planType === selectedPlan;
    const matchesStatus = selectedStatus === 'ALL' || payment.status === selectedStatus;
    const matchesExpired = !showExpiredOnly || isExpired(payment.expiresAt);
    
    return matchesSearch && matchesPlan && matchesStatus && matchesExpired;
  });

  // Calculate stats
  const stats = {
    totalRevenue: totalAmount,
    totalSubscriptions: payments.length,
    activeSubscriptions: payments.filter(p => p.status === 'COMPLETED' && !isExpired(p.expiresAt)).length,
    expiredSubscriptions: payments.filter(p => isExpired(p.expiresAt)).length
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTotalAmount(),
        fetchPaymentsData()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Status Badge Component
  const StatusBadge = ({ status, expiresAt }) => {
    const isExp = isExpired(expiresAt);
    const displayStatus = isExp && status === 'COMPLETED' ? 'EXPIRED' : status;
    const config = getStatusColor(displayStatus);
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {displayStatus}
      </span>
    );
  };

  // Plan Badge Component
  const PlanBadge = ({ planType }) => {
    const config = getPlanColor(planType);
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {planType}
      </span>
    );
  };

  // Payment Detail Modal
  const PaymentDetailModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[var(--color-border-light)]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Payment Details
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Transaction ID: {selectedPayment.transactionId}
                </p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Customer</label>
                  <div className="mt-1">
                    <p className="font-medium text-[var(--color-text-primary)]">{selectedPayment.userName}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{selectedPayment.userEmail}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Phone Number</label>
                  <p className="text-[var(--color-text-primary)]">{selectedPayment.phoneNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Amount</label>
                  <p className="text-2xl font-bold text-[var(--color-lamaGreenDark)]">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Plan Type</label>
                  <div className="mt-1">
                    <PlanBadge planType={selectedPayment.planType} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedPayment.status} expiresAt={selectedPayment.expiresAt} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Payment Date</label>
                  <p className="text-[var(--color-text-primary)]">{formatDate(selectedPayment.createdAt)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Expires At</label>
                  <p className={`${isExpired(selectedPayment.expiresAt) ? 'text-[var(--color-lamaRedDark)]' : 'text-[var(--color-text-primary)]'}`}>
                    {formatDate(selectedPayment.expiresAt)}
                    {isExpired(selectedPayment.expiresAt) && ' (Expired)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Payment Management</h1>
            <p className="text-[var(--color-text-secondary)]">
              Monitor subscription payments and revenue
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={checkExpiredSubscriptions}
              disabled={refreshing}
              className="flex items-center gap-2 bg-[var(--color-lamaYellow)] hover:bg-[var(--color-lamaYellowDark)] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Check Expired
            </button>
            <button className="flex items-center gap-2 bg-[var(--color-lamaSky)] hover:bg-[var(--color-lamaSkyDark)] text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Revenue</p>
              <p className="text-2xl font-bold text-[var(--color-lamaGreenDark)]">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="bg-[var(--color-lamaGreenLight)] p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-[var(--color-lamaGreenDark)]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Subscriptions</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalSubscriptions}</p>
            </div>
            <div className="bg-[var(--color-lamaSkyLight)] p-3 rounded-lg">
              <Users className="h-6 w-6 text-[var(--color-lamaSkyDark)]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Active Subscriptions</p>
              <p className="text-2xl font-bold text-[var(--color-lamaGreenDark)]">{stats.activeSubscriptions}</p>
            </div>
            <div className="bg-[var(--color-lamaGreenLight)] p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-[var(--color-lamaGreenDark)]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Expired Subscriptions</p>
              <p className="text-2xl font-bold text-[var(--color-lamaRedDark)]">{stats.expiredSubscriptions}</p>
            </div>
            <div className="bg-[var(--color-lamaRedLight)] p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-[var(--color-lamaRedDark)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-light)] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-lamaSky)] focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-lamaSky)] focus:border-transparent"
            >
              <option value="ALL">All Plans</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-lamaSky)] focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <button
              onClick={() => setShowExpiredOnly(!showExpiredOnly)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showExpiredOnly
                  ? 'bg-[var(--color-lamaRedDark)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-lamaRedLight)]'
              }`}
            >
              Expired Only
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-secondary)]">
              <tr className="text-left text-[var(--color-text-secondary)] text-sm">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Payment Date</th>
                <th className="px-6 py-4 font-medium">Expires</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                    Loading payments...
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                    No payments found
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr 
                    key={payment.id} 
                    className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-lamaSkyLight)] rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-[var(--color-lamaSkyDark)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">{payment.userName}</p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">{payment.userEmail}</p>
                          <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {payment.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge planType={payment.planType} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} expiresAt={payment.expiresAt} />
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={isExpired(payment.expiresAt) ? 'text-[var(--color-lamaRedDark)]' : 'text-[var(--color-text-primary)]'}>
                        {formatDate(payment.expiresAt)}
                        {isExpired(payment.expiresAt) && (
                          <span className="block text-xs text-[var(--color-lamaRedDark)]">Expired</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-[var(--color-lamaSkyDark)] hover:bg-[var(--color-lamaSkyLight)] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-light)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--color-text-secondary)]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-[var(--color-border-light)] rounded-lg hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-[var(--color-lamaSkyDark)] text-white'
                          : 'border border-[var(--color-border-light)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-[var(--color-border-light)] rounded-lg hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showDetailModal && <PaymentDetailModal />}
    </div>
  );
};

export default PaymentManagement;