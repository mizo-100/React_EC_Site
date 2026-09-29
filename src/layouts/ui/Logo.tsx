export const Logo = () => {
  return (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <img
                src="/icons/product.svg"
                alt="LH Shop"
                className="h-5 w-5 object-contain"
              />
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            LH Shop
          </span>
    </>
  );
}
