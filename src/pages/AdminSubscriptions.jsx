
import { useState, useEffect } from 'react';
import { subscriptionAPI, authAPI } from '../services/api'; // Import authAPI for user stats

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expired: 0,
        revenue: 0,
        totalUsers: 0,
        usersWithSubs: 0,
        usersWithoutSubs: 0
    });

    useEffect(() => {
        fetchSubscriptions();
        fetchUserStats();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await subscriptionAPI.getAll();
            setSubscriptions(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await authAPI.getUserStats(); // You'll need to add this to your api.js
            const userStats = response.data;

            setStats(prev => ({
                ...prev,
                totalUsers: userStats.total,
                usersWithSubs: userStats.withSubscription,
                usersWithoutSubs: userStats.withoutSubscription
            }));
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (subs) => {
        const active = subs.filter(s => s.status === 'active').length;
        const expired = subs.filter(s => s.status === 'expired').length;
        const revenue = subs
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + (s.plan?.price || 0), 0);

        setStats(prev => ({
            ...prev,
            total: subs.length,
            active,
            expired,
            revenue: revenue.toFixed(2)
        }));
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-500/20 text-green-300 border-green-500/30',
            expired: 'bg-red-500/20 text-red-300 border-red-500/30',
            cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
        return colors[status?.toLowerCase()] || colors.cancelled;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center relative overflow-hidden">
                {/* Floating blurry orbs */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

                <div className="text-center relative z-10">
                    <div className="relative inline-flex">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 bg-indigo-400/80 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-300 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">

            {/* Floating blurry orbs */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                {/* Header Section with Animation */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-300 text-lg">Monitor and manage users and subscriptions</p>
                </div>

                {/* Stats Cards - Updated with User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="glass-dark rounded-2xl p-6 border-4 border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">Total Users</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-white/10 rounded-full p-4 border border-white/10">
                                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-blue-300">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Registered users</span>
                        </div>
                    </div>

                    {/* Users with Subscriptions */}
                    <div className="glass-dark rounded-2xl p-6 border-4 border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">With Subscription</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.usersWithSubs}</p>
                            </div>
                            <div className="bg-white/10 rounded-full p-4 border border-white/10">
                                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">Percentage</span>
                                <span className="font-semibold text-green-300">
                                    {stats.totalUsers > 0 ? ((stats.usersWithSubs / stats.totalUsers) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: stats.totalUsers > 0 ? `${(stats.usersWithSubs / stats.totalUsers) * 100}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Users without Subscriptions */}
                    <div className="glass-dark rounded-2xl p-6 border-4 border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">Without Subscription</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.usersWithoutSubs}</p>
                            </div>
                            <div className="bg-white/10 rounded-full p-4 border border-white/10">
                                <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">Percentage</span>
                                <span className="font-semibold text-yellow-300">
                                    {stats.totalUsers > 0 ? ((stats.usersWithoutSubs / stats.totalUsers) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: stats.totalUsers > 0 ? `${(stats.usersWithoutSubs / stats.totalUsers) * 100}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="glass-dark rounded-2xl p-6 border-4 border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">Monthly Revenue</p>
                                <p className="text-3xl font-bold text-white mt-2">${stats.revenue}</p>
                            </div>
                            <div className="bg-white/10 rounded-full p-4 border border-white/10">
                                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-purple-300">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">From active subs</span>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Table */}
                <div className="glass-dark rounded-2xl p-6 border-4 border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold gradient-text">Recent Subscriptions</h2>
                            <div className="flex items-center space-x-2">
                                <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/15 hover-lift transition-all duration-200">
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover-lift glow-on-hover transition-all duration-200">
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="text-gray-300 text-lg font-medium">No subscriptions found</p>
                                                <p className="text-gray-400 text-sm mt-1">Subscriptions will appear here once users subscribe</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub, index) => (
                                        <tr
                                            key={sub.id}
                                            className="hover:bg-white/5 transition-colors duration-200 animate-fade-in"
                                            style={{ animationDelay: `${0.05 * index}s` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {sub.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-white">{sub.user?.name}</div>
                                                        <div className="text-sm text-gray-300">{sub.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                        {sub.plan?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusBadge(sub.status)}`}>
                                                    <span className="mr-1">●</span>
                                                    {sub.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                {new Date(sub.start_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                {new Date(sub.end_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-green-300">${sub.plan?.price}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-indigo-300 hover:text-indigo-200 font-semibold hover-glow transition-colors duration-200">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div >
        </div >
    );
};

export default AdminSubscriptions;