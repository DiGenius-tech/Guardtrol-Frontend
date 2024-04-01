function PasswordForgotLink() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="password"
          className="block font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <Link
          to="/auth/forgot-password"
          className="text-primary-500 font-medium"
        >
          I forgot my password
        </Link>
      </div>
      <input
        type="password"
        id="password"
        name="password"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        required
      />
    </div>
  );
}

export default PasswordForgotLink;
