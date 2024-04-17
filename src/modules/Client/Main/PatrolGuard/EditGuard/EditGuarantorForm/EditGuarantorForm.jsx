import React, { useRef, useState } from 'react';
import "./EditGuarantorForm.scss";
import TextInputField from '../../../../../Sandbox/InputField/TextInputField';
import RegularButton from '../../../../../Sandbox/Buttons/RegularButton';
import SelectField from '../../../../../Sandbox/SelectField/SelectField';
const titleOptions = [
    {
        name: "Type one",
        value: "typeOne"
    },
    {
        name: "Type two",
        value: "typeTwo"
    },
]
const sexOptions = [
    {
        name: "Male",
        value: "male"
    },
    {
        name: "Female",
        value: "female"
    },
]

const BTN = {
    PERSONAL_INFO: "PERSONAL_INFO",
    WORK_INFO: "WORK_INFO",
}
const EditGuarantorForm = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const pagesRef = useRef();
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        sex: "",
        phone: "",
        altPhone: "",
        placeOfWork: "",
        rank: "",
    });
    const [stepperMargin, setstepperMargin] = useState(0);
    const [formCompleted, setFormCompleted] = useState(false);
    const [title, setTitle] = useState(titleOptions[0]);
    const [sex, setSex] = useState(sexOptions[0]);
    const [stepperError, setStepperError] = useState("");



    const handleChange = (e) => {
        setStepperError("")
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: "" });
        console.log("formData: ", formData)
    };
    const handleSelectChange = (e) => {
        setStepperError("")
        let _title = JSON.parse(e.target.value)
        setFormData({ ...formData, [e.target.name]: _title.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: "" });
        console.log("formData: ", formData)
    }


    const handleNextStep = (btn) => {
        switch (btn) {
            case BTN.PERSONAL_INFO:
                if (
                    formData.title != '' &&
                    formData.firstName != '' &&
                    formData.lastName != '' &&
                    formData.email != '' &&
                    formData.dob != '' &&
                    formData.sex != '' &&
                    formData.phone != '' &&
                    formData.altPhone != ''
                ) {
                    if (stepperMargin < 200) {
                        setstepperMargin((initValue) => {
                            pagesRef.current.style.marginLeft = `-${initValue + 100}%`;
                            return initValue + 100
                        })
                    }
                } else {
                    setStepperError("Complete this section!")
                }
                break;

            case BTN.WORK_INFO:
                if (
                    formData.placeOfWork != '' &&
                    formData.rank != ''
                ) {
                    if (stepperMargin < 200) {
                        setstepperMargin((initValue) => {
                            pagesRef.current.style.marginLeft = `-${initValue + 100}%`;
                            return initValue + 100
                        })
                    }
                } else {
                    setStepperError("Complete this section!")
                }
                break;

            default:
                break;
        }
    }

    const completeForm = () => {
        setFormCompleted(true)
    }

    const handlePreviousStep = () => {
        if (stepperMargin > 0) {
            setstepperMargin((initValue) => {
                pagesRef.current.style.marginLeft = `-${initValue - 100}%`;
                return initValue - 100
            })
        }
    }

    return (
        <>
            {/* edit-guarantor-form-app works! */}


            <button onClick={handlePreviousStep}>Previous</button>
            <button onClick={handleNextStep}>Next</button>

            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                <li
                    className={
                        (stepperMargin === 0 || stepperMargin > 0 ? "text-blue-600 dark:text-blue-500 " : "") +
                        `
                flex md:w-full items-center 
                sm:after:content-[''] 
                after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">

                        {
                            stepperMargin === 100 || stepperMargin > 100 ? <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg> : <span className="me-2">1</span>
                        }
                        Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                    </span>
                </li>
                <li
                    className={
                        (stepperMargin === 100 || stepperMargin > 100 ? "text-blue-600 dark:text-blue-500 " : "") + `
                flex md:w-full items-center 
                after:content-[''] 
                after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                        {
                            stepperMargin === 200 || stepperMargin > 200 ? <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg> : <span className="me-2">2</span>
                        }
                        Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                    </span>
                </li>
                <li className={
                    (stepperMargin === 200 || stepperMargin > 200 ? "text-blue-600 dark:text-blue-500 " : "") + `flex items-center`}>
                    {
                        formCompleted ? <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg> : <span className="me-2">3</span>
                    }
                    Confirmation
                </li>
            </ol>
            <div className="my-8"></div>
            <form className="stepper">
                <ul className="pages" ref={pagesRef}>
                    <li className="page">

                        <div className="mx-auto max-w-xl">
                            <fieldset>
                                <legend className='text-xl font-semibold mb-16 text-center'>Personal Information</legend>

                                {
                                    stepperError ? <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center" role="alert">
                                        <span class="font-medium">Please!</span> {stepperError}.
                                    </div> : ""
                                }

                                <div className="grid grid-cols-12 gap-x-4">
                                    <div className="col-span-12">
                                        <SelectField
                                            value={title}
                                            name="title"
                                            id="title"
                                            label="Title"
                                            semibold_label={true}
                                            handleChangeOption={handleSelectChange}
                                            optionList={titleOptions}
                                            multipleSelect={false}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="First Name"
                                            semibold_label={true}
                                            type="text"
                                            id="firstName"
                                            required="required"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            error={validationErrors['firstName']}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Last Name"
                                            semibold_label={true}
                                            type="text"
                                            id="lastName"
                                            required="required"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            error={validationErrors['lastName']}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <TextInputField
                                            label="Email"
                                            semibold_label={true}
                                            type="text"
                                            id="email"
                                            required="required"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={validationErrors['email']}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Date of Birth"
                                            semibold_label={true}
                                            type="date"
                                            id="dob"
                                            required="required"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            error={validationErrors['dob']}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <SelectField
                                            value={sex}
                                            name="sex"
                                            id="sex"
                                            label="Sex"
                                            semibold_label={true}
                                            handleChangeOption={handleSelectChange}
                                            optionList={sexOptions}
                                            multipleSelect={false}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Phone"
                                            semibold_label={true}
                                            type="text"
                                            id="phone"
                                            required="required"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            error={validationErrors['phone']}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Alternative Phone"
                                            semibold_label={true}
                                            type="text"
                                            id="altPhone"
                                            required="required"
                                            name="altPhone"
                                            value={formData.altPhone}
                                            onChange={handleChange}
                                            error={validationErrors['altPhone']}
                                        />
                                    </div>
                                </div>
                                <RegularButton text="Next" type="button" onClick={() => handleNextStep(BTN.PERSONAL_INFO)} />
                            </fieldset>
                        </div>
                    </li>
                    <li className="page">

                        <div className="mx-auto max-w-xl">
                            <fieldset>
                                <legend className='text-xl font-semibold mb-16 text-center'>Work Information</legend>
                                {
                                    stepperError ? <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center" role="alert">
                                        <span class="font-medium">Please!</span> {stepperError}.
                                    </div> : ""
                                }

                                <div className="grid grid-cols-12 gap-x-4">
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Place of Work"
                                            semibold_label={true}
                                            type="text"
                                            id="placeOfWork"
                                            required="required"
                                            name="placeOfWork"
                                            value={formData.placeOfWork}
                                            onChange={handleChange}
                                            error={validationErrors['placeOfWork']}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TextInputField
                                            label="Rank"
                                            semibold_label={true}
                                            type="text"
                                            id="rank"
                                            required="required"
                                            name="rank"
                                            value={formData.rank}
                                            onChange={handleChange}
                                            error={validationErrors['rank']}
                                        />
                                    </div>
                                </div>
                                <RegularButton text="Next" type="button" onClick={() => handleNextStep(BTN.WORK_INFO)} />
                            </fieldset>
                        </div>
                    </li>
                    <li className="page">
                        PAge 3
                    </li>
                </ul>
            </form>

        </>
    );
}

export default EditGuarantorForm;
