import type { Admin } from "../api/adminAdminsApi";

type AdminsTableProps = {
  admins: Admin[];
  onEdit?: (admin: Admin) => void;
  onDelete?: (admin: Admin) => void;
  meId?: string;
};

export const AdminsTable = ({
  admins,
  onEdit,
  onDelete,
  meId,
}: AdminsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              名前
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              メールアドレス
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              権限
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {admins.map((admin) => {
            const isMe = admin.id === meId;

            return (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{admin.name}</td>
                <td className="px-4 py-3 text-gray-700">{admin.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      admin.role === "full"
                        ? "bg-red-100 text-red-800"
                        : admin.role === "register"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <>
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(admin)}
                        className="mr-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        編集
                      </button>
                    )}
                    {onDelete && !isMe && (
                      <button
                        type="button"
                        onClick={() => onDelete(admin)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        削除
                      </button>
                    )}
                    {!onEdit && !onDelete && (
                      <span className="text-sm text-gray-400">
                        操作権限がありません
                      </span>
                    )}
                  </>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
