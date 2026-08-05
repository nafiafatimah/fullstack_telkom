import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function RecordsTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    revenue: '',
    user: '',
    payload: '{}'
  });
  const [seedCount, setSeedCount] = useState(5);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/records');
      setRecords(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Gagal mengambil data records');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        site_name: formData.site_name,
        revenue: Number.parseFloat(formData.revenue) || 0,
        user: formData.user,
        payload: formData.payload
      };
      
      await api.post('/api/records', payload);
      setShowModal(false);
      setFormData({ site_name: '', revenue: '', user: '', payload: '{}' });
      fetchRecords();
    } catch (err) {
      console.error('Error creating record:', err);
      alert(err.response?.data?.message || 'Gagal menambah record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus record dengan ID ${id}?`)) return;
    
    try {
      await api.delete(`/api/records/${id}`);
      fetchRecords();
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Gagal menghapus record');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm(`Buat ${seedCount} data dummy?`)) return;
    
    try {
      setSeeding(true);
      await api.post(`/api/seed?count=${seedCount}`);
      fetchRecords();
      alert('✅ Data dummy berhasil dibuat!');
    } catch (err) {
      console.error('Error seeding:', err);
      alert('Gagal membuat data dummy');
    } finally {
      setSeeding(false);
    }
  };

  // Filter records berdasarkan search
  const filteredRecords = records.filter((record) =>
    record.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-500">⏳ Memuat data...</div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">❌ {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      {/* Header dengan Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">📋 Manajemen Records</h2>
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Cari site atau user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            {/* Seed */}
            <div className="flex gap-1">
              <input
                type="number"
                min="1"
                max="100"
                value={seedCount}
                onChange={(e) => setSeedCount(Math.min(100, Math.max(1, Number.parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Jumlah seed data"
              />
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
              >
                {seeding ? '⏳...' : '🌱 Seed'}
              </button>
            </div>
            {/* Add */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
            >
              ➕ Tambah
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Total: <strong>{filteredRecords.length}</strong> records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payload</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {searchTerm ? '🔍 Tidak ada hasil pencarian' : '📭 Belum ada data. Klik "Seed" untuk membuat data dummy.'}
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">#{record.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{record.site_name}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    Rp {record.revenue?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.user}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-500 font-mono text-xs">
                    {record.payload?.substring(0, 40)}
                    {record.payload?.length > 40 ? '...' : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(record.created_at).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Record */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">➕ Tambah Record Baru</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="site-name-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name *
                  </label>
                  <input
                    id="site-name-input"
                    type="text"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={100}
                    placeholder="contoh: my-site.com"
                  />
                </div>
                <div>
                  <label htmlFor="revenue-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue *
                  </label>
                  <input
                    id="revenue-input"
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    max="1000000000"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="user-input" className="block text-sm font-medium text-gray-700 mb-1">
                    User *
                  </label>
                  <input
                    id="user-input"
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={50}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label htmlFor="payload-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Payload (JSON)
                  </label>
                  <textarea
                    id="payload-input"
                    name="payload"
                    value={formData.payload}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows="3"
                    placeholder='{"status":"active","region":"us-east-1"}'
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  💾 Simpan
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setShowModal(false); 
                    setFormData({ site_name: '', revenue: '', user: '', payload: '{}' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  ✖️ Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}