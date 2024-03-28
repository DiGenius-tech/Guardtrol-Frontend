function TextFieldError() {
  return (
    <>
      {/* text-field-error-app works! */}

      <div className="mb-6">
        <label
          htmlFor="email"
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className=" 
          border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full p-2.5 sm:py-4 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500"
          placeholder="Error input"
          autoComplete="email"
          required
        />
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">Oh, snapp!</span> Some error message.
        </p>
      </div>
    </>
  );
}

export default TextFieldError;
