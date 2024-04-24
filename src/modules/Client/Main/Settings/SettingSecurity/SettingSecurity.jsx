import React from 'react';
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import TextInputField from '../../../../Sandbox/InputField/TextInputField';

const SettingSecurity = () => {
    return (
        <>
            {/* setting-security-app works! */}

            <form action="" className="max-w-3xl">
                <div className="grid grid-cols-12 gap-4 sm:gap-8">
                    <div className="hidden sm:block col-span-12 sm:col-span-6">
                        <h3 className="font-bold">Change password</h3>
                        <p>Passwords must be at least 8 characters long.</p>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="grid grid-cols-1">
                            <div className="col-span-1">
                                <TextInputField
                                    label="Current Pasword"
                                    name="cuurentPassword"
                                    type="text"
                                    id="cuurentPassword"
                                    semibold_label={true}
                                //   error={validationErrors["currentPassword"]}
                                //   onChange={handleChange}
                                //   required="required"
                                //   value={formData.currentPassword}
                                />
                            </div>
                            <div className="col-span-1">
                                <TextInputField
                                    label="New Pasword"
                                    name="newPassword"
                                    type="text"
                                    id="newPassword"
                                    semibold_label={true}
                                //   error={validationErrors["newPassword"]}
                                //   onChange={handleChange}
                                //   required="required"
                                //   value={formData.newPassword}
                                />
                            </div>
                            <div className="col-span-1">
                                <TextInputField
                                    label="Confirm Pasword"
                                    name="confirmPassword"
                                    type="text"
                                    id="confirmPassword"
                                    semibold_label={true}
                                //   error={validationErrors["confirmPassword"]}
                                //   onChange={handleChange}
                                //   required="required"
                                //   value={formData.confirmPassword}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:text-right">
                    <RegularButton text="Change Password" width="auto" padding="px-4 py-2" textSize="text-sm" />
                </div>
            </form>
        </>
    );
}

export default SettingSecurity;
