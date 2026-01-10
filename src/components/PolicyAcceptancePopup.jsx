import React, { useState } from 'react';
import { Modal, Button } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery } from '../redux/services/user';
import { put } from '../lib/methods';
import { selectToken, selectUser } from '../redux/selectors/auth';
import { updateUser } from '../redux/slice/authSlice';
import RegularButton from "../modules/Sandbox/Buttons/RegularButton";
import { suspenseHide, suspenseShow } from '../redux/slice/suspenseSlice';

const PolicyAcceptancePopup = () => {
  const [showModal, setShowModal] = useState(true);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [termsOfUseAccepted, setTermsOfUseAccepted] = useState(false);
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState(false);
  const [error, setError] = useState('');

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  // Move the hook before any conditional returns
  const { data: userData, refetch } = useGetUserQuery(user?._id, {
    skip: !user?._id,
  });

  // Don't show modal if user is not logged in
  if (!user || !user._id) {
    return null;
  }

  const handleAcceptPolicies = async () => {
  if (!privacyPolicyAccepted || !termsOfUseAccepted || !dataPrivacyAccepted) {
    setError('Please accept all policies to continue');
    return;
  }

  try {
    dispatch(suspenseShow());
    const data = await put(
      "users/privacy-policy",
      {
        privacyPolicyAccepted,
        termsOfUseAccepted,
        dataPrivacyAccepted
      },
      token,
      true,
      "Privacy policy acceptance updated"
    );

    if (data) {
      // Update Redux with the response data immediately
      dispatch(updateUser({
        ...user,
        privacyPolicyAccepted: true,
        termsOfUseAccepted: true,
        dataPrivacyAccepted: true
      }));
      
      // Refetch in background for consistency
      refetch();
      
      // Close modal
      setShowModal(false);
    }
  } catch (error) {
    setError('Failed to update policy acceptance. Please try again.');
  } finally {
    dispatch(suspenseHide());
  }
};

  // Don't show modal if user has already accepted all policies
  if (userData?.privacyPolicyAccepted && userData?.termsOfUseAccepted && userData?.dataPrivacyAccepted) {
    return null;
  }

  return (
    <Modal 
      show={showModal} 
      size="xl" 
      onClose={() => {}}
      className="backdrop-blur-sm"
    >
      <Modal.Header className="bg-gray-50 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Policy Acceptance Required
        </h3>
      </Modal.Header>
      <Modal.Body className="bg-white dark:bg-gray-900">
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            To continue using our services, please review and accept our policies:
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacyPolicyAccepted"
                checked={privacyPolicyAccepted}
                onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="privacyPolicyAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                I accept the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="termsOfUseAccepted"
                checked={termsOfUseAccepted}
                onChange={(e) => setTermsOfUseAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="termsOfUseAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                I accept the <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms of Use</a>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataPrivacyAccepted"
                checked={dataPrivacyAccepted}
                onChange={(e) => setDataPrivacyAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="dataPrivacyAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                I accept the <a href="/data-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Data Privacy Policy</a>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-50 dark:bg-gray-800">
        
        <RegularButton
                
                type={"submit"}
                onClick={handleAcceptPolicies}
                text="Accept and Continue"
                width="auto"
                padding="px-4 py-2"
                textSize="text-sm"
              />
      </Modal.Footer>
    </Modal>
  );
};

export default PolicyAcceptancePopup; 