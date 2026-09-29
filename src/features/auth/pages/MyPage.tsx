import { useAuthStore } from "../../../stores/authStore";

export const MyPage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">マイページ</h1>

      <dl className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <dt className="text-sm text-gray-500">名前</dt>
          <dd className="font-medium">{user.name}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">メールアドレス</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
      </dl>
    </main>
  );
}
