import { useState } from "react";
import {
  type Admin,
  useAddAdmin,
  useAdmins,
  useCurrentAdmin,
  useDeleteAdmin,
  useUpdateAdmin,
} from "../api/adminAdminsApi";
import { AdminsTable } from "../components/AdminsTable";

type AdminFormState = {
  name: string;
  email: string;
  password?: string;
  role: "full" | "register" | "viewer";
};

const emptyForm: AdminFormState = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
};

type ModalState =
  | { open: false }
  | {
      open: true;
      type: "success" | "error";
      message: string;
    };

export const AdminsPage = () => {
  const { data: adminsData, isPending, isError, error } = useAdmins();
  const { data: me } = useCurrentAdmin();
  const addAdmin = useAddAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState<AdminFormState>(emptyForm);
  const [modal, setModal] = useState<ModalState>({ open: false });

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setForm({ ...emptyForm });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAdmin) {
        await updateAdmin.mutateAsync({
          id: editingAdmin.id,
          name: form.name,
          email: form.email,
          role: form.role,
        });
        setModal({
          open: true,
          type: "success",
          message: "管理者情報を更新しました。",
        });
      } else {
        if (!form.password) {
          setModal({
            open: true,
            type: "error",
            message: "パスワードを入力してください。",
          });
          return;
        }
        await addAdmin.mutateAsync({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setModal({
          open: true,
          type: "success",
          message: "管理者を追加しました。",
        });
      }

      setIsFormOpen(false);
      setEditingAdmin(null);
      setForm(emptyForm);
    } catch {
      setModal({
        open: true,
        type: "error",
        message: "処理に失敗しました。",
      });
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (!me) return;

    if (admin.id === me.id) {
      setModal({
        open: true,
        type: "error",
        message: "ログイン中の管理者は削除できません。",
      });
      return;
    }

    const ok = confirm(
      `管理者「${admin.name}」を削除しますか？\nこの操作は取り消せません。`,
    );
    if (!ok) return;

    try {
      await deleteAdmin.mutateAsync(admin.id);
      setModal({
        open: true,
        type: "success",
        message: "管理者を削除しました。",
      });
    } catch {
      setModal({
        open: true,
        type: "error",
        message: "削除に失敗しました。",
      });
    }
  };

  const canManageAdmins = me?.role === "full";

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-sm text-gray-600">管理者を読み込み中です...</p>
      </main>
    );
  }

  if (isError || !adminsData) {
    console.error(error);
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-sm text-red-600">
          管理者の取得に失敗しました。
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理者管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            {adminsData.admins.length}人の管理者
          </p>
        </div>

        {canManageAdmins && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            ＋ 管理者追加
          </button>
        )}
      </div>

      {isFormOpen && canManageAdmins && (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingAdmin ? "管理者の編集" : "管理者の追加"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-name"
                className="block text-sm font-medium text-gray-700"
              >
                名前
              </label>
              <input
                id="admin-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {!editingAdmin && (
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  パスワード
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="admin-role"
                className="block text-sm font-medium text-gray-700"
              >
                権限
              </label>
              <select
                id="admin-role"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    role: e.target.value as "full" | "register" | "viewer",
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="full">full（管理者の操作も可能）</option>
                <option value="register">register（商品登録など）</option>
                <option value="viewer">viewer（閲覧のみ）</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingAdmin(null);
                  setForm(emptyForm);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={addAdmin.isPending || updateAdmin.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {editingAdmin ? "更新する" : "追加する"}
              </button>
            </div>
          </form>
        </section>
      )}

      <AdminsTable
        admins={adminsData.admins}
        onEdit={canManageAdmins ? handleOpenEdit : undefined}
        onDelete={canManageAdmins ? handleDelete : undefined}
        meId={me?.id}
      />

      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <p
              className={`text-sm font-medium ${
                modal.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {modal.message}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setModal({ open: false })}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
