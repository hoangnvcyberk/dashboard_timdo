import { convertToVnd } from "@/helpers/convertToVnd"

const AdminRevenueBreakdown: React.FC<{ totalRevenue: number }> = ({
  totalRevenue,
}) => {
  const adminShare = totalRevenue * 0.3
  const remaining = totalRevenue - adminShare

  return (
    <div className="mb-4">
      <div className="text-2xl font-bold text-gray-800">
        Tổng tiền: {convertToVnd(totalRevenue)}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Admin's Share */}
        <div className="p-4 bg-blue-100 rounded-lg text-center shadow-md">
          <div className="text-lg font-semibold text-blue-700">
            Phần Admin (30%)
          </div>
          <div className="mt-2 text-xl font-bold text-blue-900">
            {convertToVnd(adminShare)}
          </div>
        </div>

        {/* Remaining amount */}
        <div className="p-4 bg-green-100 rounded-lg text-center shadow-md">
          <div className="text-lg font-semibold text-green-700">
            Tiền còn lại
          </div>
          <div className="mt-2 text-xl font-bold text-green-900">
            {convertToVnd(remaining)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRevenueBreakdown
