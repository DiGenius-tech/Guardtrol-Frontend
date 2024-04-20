import React, { useEffect, useRef, useState } from 'react';
import "./StepperWidget.scss";
import Stepper from './stepper';

const StepperWidget = () => {

    const stepperRef = useRef() //stepperWrapper
    const pagesRef = useRef()
    const progressRef = useRef();
    const [pages, setPages] = useState();
    const [pagesWidth, setPagesWidth] = useState(0);
    const [progressBar, setProgressBar] = useState();
    const [stepper, setStepper] = useState();

    const handleNext = () => {
        stepper.stepForward()
    }

    const handlePrevious = () => {
        stepper.stepBackward()
    }


    useEffect(() => {
        setPages(pagesRef.current);
        setProgressBar(progressRef.current);
        const list = pages ? pages.getElementsByClassName("page") : null;
        const pageCount = list ? list.length : null;
        setPagesWidth(pageCount * 100)
        setStepper(new Stepper(pages, pageCount, progressBar));
        return () => {

        };
    }, [pages]);

    return (
        <>
            {/* stepper-widget-app works! */}

            <div className="stepper-widget">
                <div className="max-w-5xl mx-auto p-8">

                    <ol ref={progressRef} className="progress | flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                        <li className="step current flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                <svg className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                            </span>
                        </li>
                        <li className="step flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                <svg className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="me-2">2</span>
                                Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                            </span>
                        </li>
                        <li className="step flex items-center">
                            <svg className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="me-2">3</span>
                            Confirmation
                        </li>
                    </ol>


                    <div ref={stepperRef} className="stepper py-8 min-h-max" id="free-online-appointment-form-stepper">
                        <ul ref={pagesRef} className="pages" style={{
                            width: `${pagesWidth}%`
                        }}>
                            {/* <!-- Page1 --> */}
                            <li className="page p-6">
                                Step 1

                                <div>
                                    <button className="step-control next-btn" onClick={handleNext}>Next</button>
                                </div>
                            </li>
                            {/* <!-- Page 2 --> */}
                            <li className="page p-6">
                                Step 2
                                <div className='flex items-center gap-4'>
                                    <button className="step-control prev-btn" onClick={handlePrevious}>Previous</button>
                                    <button className="step-control next-btn" onClick={handleNext}>Next</button>
                                </div>
                            </li>
                            {/* <!-- Page 3 --> */}
                            <li className="page p-6">Step 3
                                <div className='flex items-center gap-4'>
                                    <button className="step-control prev-btn" onClick={handlePrevious}>Previous</button>
                                    <button className="step-control next-btn" onClick={handleNext}>Next</button>
                                </div>
                            </li>
                            {/* <!-- Page 4 --> */}
                            <li className="page p-6">Step 4
                                <div className='flex items-center gap-4'>
                                    <button className="step-control prev-btn" onClick={handlePrevious}>Previous</button>
                                    <button className="step-control next-btn" onClick={handleNext}>Next</button>
                                </div>
                            </li>
                            {/* <!-- Page 5 --> */}
                            <li className="page p-6">Step 5
                                <div className='flex items-center gap-4'>
                                    <button className="step-control prev-btn" onClick={handlePrevious}>Previous</button>
                                    <button className="step-control next-btn" onClick={handleNext}>Next</button>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}

export default StepperWidget;
