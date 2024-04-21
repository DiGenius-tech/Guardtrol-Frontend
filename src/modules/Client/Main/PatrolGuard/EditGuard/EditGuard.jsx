import { Button, Modal, Tabs } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import EditPersonalInformation from './EditPersonalInformation/EditPersonalInformation';
import BankDetails from './BankDetails/BankDetails';
import EditNextOfKin from './EditNextOfKin/EditNextOfKin';
import EditIdentification from './EditIdentification/EditIdentification';
import EditGuarantorForm from './EditGuarantorForm/EditGuarantorForm';
import "./EditGuard.scss";

const EditGuard = (props) => {
    const [modalSize, setModalSize] = useState('7xl')
    const [openEditGuardModal, setOpenEditGuardModal] = useState(false);

    console.log("setGuardToEdit: ", props.setGuardToEdit)
    const handleCLoseModal = () => {
        setOpenEditGuardModal(false);
        props.setGuardToEdit(null);
    }
    useEffect(() => {
        console.log("props.guardToEdit: ", props.guardToEdit)
        if (props.guardToEdit)
            setOpenEditGuardModal(true);
    }, [props.guardToEdit])
    return (
        <>
            {/* edit-guard-app works! */}

            {/* <Button onClick={() => props.setOpenEditGuardModal(true)}>Toggle modal</Button> */}

            <div className="edit-guard-modal">
                <Modal size={modalSize} show={openEditGuardModal} onClose={handleCLoseModal}>
                    {/* {props.guardToEdit?.email} */}
                    <Modal.Header>
                        Edit Guard
                    </Modal.Header>
                    <Modal.Body>

                        <h3 className="font-bold text-center text-2xl text-dark-450">Guard Info</h3>
                        <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
                            Fill the following form to complete your onboarding
                        </p>
                        <div className="my-6"></div>
                        <div className="space-y-6">
                            <div className="tab flex-tabs flex-tab-nowrap">
                                <Tabs aria-label="Tabs with underline" style="fullWidth">
                                    <Tabs.Item active title="Personal information">
                                        <EditPersonalInformation />
                                    </Tabs.Item>
                                    <Tabs.Item active title="Guarantor form">
                                        <EditGuarantorForm />
                                    </Tabs.Item>
                                    <Tabs.Item active title="Identification">
                                        <EditIdentification />
                                    </Tabs.Item>
                                    <Tabs.Item active title="Next of kin">
                                        <EditNextOfKin />
                                    </Tabs.Item>
                                    <Tabs.Item active title="Bank details">
                                        <BankDetails />
                                    </Tabs.Item>
                                </Tabs>
                            </div>
                        </div>
                    </Modal.Body> 
                </Modal>
            </div>
        </>
    );
}

export default EditGuard;
