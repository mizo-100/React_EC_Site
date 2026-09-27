export const Logo = () => {
  return (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
              <path d="m4.5 7.5 7.5 4 7.5-4M12 12v9" />
            </svg>
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            LH Shop
          </span>
    </>
  );
}
