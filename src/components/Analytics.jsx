import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recordsRes, statsRes] = await Promise.all([
          api.get('/api/records'),
          api.get('/api/stats')
        ]);
        setRecords(recordsRes.data || []);
        setStats(statsRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Gagal mengambil data analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data untuk grafik Revenue per Site
  const getRevenueData = () => {
    const map = {};
    records.forEach((r) => {
      map[r.site_name] = (map[r.site_name] || 0) + (r.revenue || 0);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, revenue: Math.round(value * 100) / 100 }));
  };

  // Data untuk grafik Records per User
  const getUserData = () => {
    const map = {};
    records.forEach((r) => {
      map[r.user] = (map[r.user] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, records: value }));
  };

  const totalRevenue = records.reduce((sum, r) => sum + (r.revenue || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">⏳ Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        ❌ {error}
      </div>
    );
  }

  const revenueData = getRevenueData();
  const userData = getUserData();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-sm text-gray-500">📊 Total Records</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {stats?.total_records || records.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-sm text-gray-500">💰 Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            Rp {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-sm text-gray-500">💾 Memory Usage</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {stats?.alloc_memory_mb || 0} MB
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <p className="text-sm text-gray-500">⏱️ Uptime</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">
            {stats?.uptime || 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Revenue per Site
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            👥 Records per User
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="records"
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Info */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🖥️ System Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Records:</span>
              <strong className="ml-2">{stats.total_records}</strong>
            </div>
            <div>
              <span className="text-gray-500">Total Revenue:</span>
              <strong className="ml-2">Rp {stats.total_revenue?.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-gray-500">Goroutines:</span>
              <strong className="ml-2">{stats.num_goroutines}</strong>
            </div>
            <div>
              <span className="text-gray-500">System Memory:</span>
              <strong className="ml-2">{stats.sys_memory_mb} MB</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}