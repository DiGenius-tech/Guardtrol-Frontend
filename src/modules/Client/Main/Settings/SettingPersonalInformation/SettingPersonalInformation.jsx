import React, { useRef, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";

const SettingPersonalInformation = () => {
  const profilePhotoControlRef = useRef();
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");

  const getSelectedFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
    }
  };
  return (
    <>
      {/* setting-personal-information-app works! */}
      <form action="" className="max-w-3xl">
        <div className="grid grid-cols-12 gap-4 sm:gap-8">
          <div className="col-span-6">
            <h3 className="font-bold">Profile photo</h3>
          </div>
          <div className="col-span-6">
            <div className="flex items-start gap-4">
              <div>
                <div className="h-20 w-20 min-h-20 min-w-20 rounded-full overflow-hidden">
                  {!preview ? (
                    <div className="bg-secondary-50 rounded-full h-full w-full flex items-center justify-center text-2xl font-bold">
                      AB{" "}
                      {/**this is the user name initials as image preiview if image is not available */}
                    </div>
                  ) : (
                    <img src={preview} alt={fileName} />
                  )}
                </div>
              </div>
              <form action="">
                <p className="text-sm">
                  We accept files in PNG or JPG format, with a maximum size of 5
                  MB.{" "}
                  <label
                    htmlFor="profile_image"
                    className="cursor-pointer text-primary-500 font-semibold whitespace-nowrap"
                  >
                    Change my photo
                  </label>
                  <input
                    type="file"
                    name="profile_image"
                    id="profile_image"
                    hidden
                    ref={profilePhotoControlRef}
                    onChange={(e) => getSelectedFile(e)}
                  />
                  <strong className="block text-xs mt-2">{fileName}</strong>
                </p>
              </form>
            </div>
          </div>
          <div className="col-span-6">
            <h3 className="font-bold">Name</h3>
            <p>Changes cannot be made to your name after account creation.</p>
          </div>
          <div className="col-span-6">
            <TextInputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="Full Name"
              id="name"
              //   error={validationErrors["name"]}
              //   onChange={handleChange}
              //   required="required"
              //   value={formData.name}
            />

            {/* <TextInputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  error={validationErrors['email']}
                  onChange={handleChange}
                  required="required"
                  value={formData.email}
                />
                <TextInputField
                  label="Phone Number"
                  name="phone"
                  type="number"
                  placeholder="Phone Number"
                  id="phone"
                  error={validationErrors['phone']}
                  onChange={handleChange}
                  required="required"
                  value={formData.phone}
                /> */}
          </div>
          <div className="col-span-6">
            <h3 className="font-bold">Email Address</h3>
            <p>
              All communications and activity notifications will be sent to your
              email address.
            </p>
          </div>
          <div className="col-span-6">
            <TextInputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Email Address"
              id="email"
              //   error={validationErrors['email']}
              //   onChange={handleChange}
              //   required="required"
              //   value={formData.email}
            />
          </div>
          <div className="col-span-6">
            <h3 className="font-bold">Phone Number</h3>
            <p>
              Your phone number can be used as a security measure to validate
              some actions on the account.
            </p>
          </div>
          <div className="col-span-6">
            <TextInputField
              label="Phone Number"
              name="phone"
              type="number"
              placeholder="Phone Number"
              id="phone"
              //   error={validationErrors['phone']}
              //   onChange={handleChange}
              //   required="required"
              //   value={formData.phone}
            />
          </div>
        </div>
        <div className="text-right">
          <RegularButton text="Save Changes" width="auto" padding="px-4 py-2" />
        </div>
      </form>
    </>
  );
};

export default SettingPersonalInformation;
