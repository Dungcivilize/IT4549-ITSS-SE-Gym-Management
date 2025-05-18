import React, { useState } from 'react';
import { FiUser, FiPackage, FiPlusCircle, FiRefreshCw, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const MembershipActions = () => {
  const [memberId, setMemberId] = useState('');
  const [packageId, setPackageId] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState({
    register: false,
    renew: false,
    cancel: false
  });

  const API_URL = '/api/memberships';

  const handleAction = async (actionType) => {
    setIsLoading({ ...isLoading, [actionType]: true });
    setMessage('');
    try {
      let endpoint = '';
      let method = 'POST';

      switch (actionType) {
        case 'register':
          endpoint = `${API_URL}/register?memberId=${memberId}&packageId=${packageId}`;
          break;
        case 'renew':
          endpoint = `${API_URL}/renew?memberId=${memberId}&packageId=${packageId}`;
          break;
        case 'cancel':
          endpoint = `${API_URL}/${membershipId}`;
          method = 'DELETE';
          break;
        default:
          break;
      }

      const res = await fetch(endpoint, { method });
      if (!res.ok) throw new Error(await res.text());

      setMessage('✅ Thao tác thành công!');
      if (actionType !== 'cancel') {
        setMemberId('');
        setPackageId('');
      } else {
        setMembershipId('');
      }
    } catch (error) {
      setMessage('❌ Thao tác thất bại: ' + error.message);
    } finally {
      setIsLoading({ ...isLoading, [actionType]: false });
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto mt-10 border border-gray-100 space-y-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700 flex items-center justify-center">
        <FiPackage className="mr-3" /> Quản lý Gói Tập
      </h2>

      {message && (
        <div className="text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Đăng ký / Gia hạn */}
        <div className="bg-indigo-50 p-6 rounded-2xl shadow-inner">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
            <FiPlusCircle className="mr-2" /> Đăng ký / Gia hạn
          </h3>

          <div className="space-y-4">
            <InputField icon={<FiUser />} placeholder="ID hội viên" value={memberId} setValue={setMemberId} />
            <InputField icon={<FiPackage />} placeholder="ID gói tập" value={packageId} setValue={setPackageId} />

            <div className="flex gap-3">
              <ActionButton
                label="Đăng ký"
                icon={<FiPlusCircle className="mr-2" />}
                loading={isLoading.register}
                color="indigo"
                onClick={() => handleAction('register')}
                disabled={!memberId || !packageId}
              />
              <ActionButton
                label="Gia hạn"
                icon={<FiRefreshCw className="mr-2" />}
                loading={isLoading.renew}
                color="emerald"
                onClick={() => handleAction('renew')}
                disabled={!memberId || !packageId}
              />
            </div>
          </div>
        </div>

        {/* Hủy gói tập */}
        <div className="bg-rose-50 p-6 rounded-2xl shadow-inner">
          <h3 className="text-lg font-semibold text-rose-700 mb-4 flex items-center">
            <FiTrash2 className="mr-2" /> Hủy Gói Tập
          </h3>

          <div className="space-y-4">
            <InputField icon={<FiPackage />} placeholder="ID Membership cần hủy" value={membershipId} setValue={setMembershipId} />

            <ActionButton
              label="Hủy gói tập"
              icon={<FiTrash2 className="mr-2" />}
              loading={isLoading.cancel}
              color="rose"
              onClick={() => handleAction('cancel')}
              disabled={!membershipId}
              full
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, placeholder, value, setValue }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
    />
  </div>
);

const ActionButton = ({ label, icon, loading, color, onClick, disabled, full }) => {
  const baseColor = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    rose: 'bg-rose-600 hover:bg-rose-700'
  };

  const loadingColor = {
    indigo: 'bg-indigo-300',
    emerald: 'bg-emerald-300',
    rose: 'bg-rose-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${
        full ? 'w-full' : 'flex-1'
      } py-3 px-4 rounded-xl transition-all font-medium flex items-center justify-center shadow-md text-white ${
        loading ? `${loadingColor[color]} cursor-not-allowed` : baseColor[color]
      }`}
    >
      {loading ? <FiRefreshCw className="animate-spin mr-2" /> : icon}
      {label}
    </button>
  );
};

export default MembershipActions;
