import React from 'react';
import IconAngleArrowLeftBlue from "../../images/icons/icon-angle-arrow-left-blue.svg";
import IconAngleArrowRightBlue from "../../images/icons/icon-angle-arrow-right-blue.svg";
import IconShareBlue from "../../images/icons/icon-share-blue.svg";
import IconBookmarkBlue from "../../images/icons/icon-bookmark-blue.svg";
import IconCopyBlue from "../../images/icons/icon-copy-blue.svg";
import { useNavigate } from "react-router-dom";

const MobileAppBar = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }
    const goNext = () => {
        navigate(1)
    }
    return (
        <>
            {/* mobile-app-bar-app works! */}
            <div className='block sm:hidden bg-dark-100 text-white fixed bottom-0 left-0 right-0 text-center py-2'>
                <ul className='grid grid-cols-5 gap-2 px-2'>
                    <li className='col-span-1 flex justify-center items-center hover:bg-gray-300 h-10 rounded' onClick={goBack}>
                        <button  aria-label='Back'>
                            <img src={IconAngleArrowLeftBlue} alt="Back" />
                        </button>
                    </li>
                    <li className='col-span-1 flex justify-center items-center hover:bg-gray-300 h-10 rounded' onClick={goNext}>
                        <button  aria-label='Next'>
                            <img src={IconAngleArrowRightBlue} alt="Next" />
                        </button>
                    </li>
                    <li className='col-span-1 flex justify-center items-center hover:bg-gray-300 h-10 rounded'>
                        <button  aria-label='Share'>
                            <img src={IconShareBlue} alt="Share" />
                        </button>
                    </li>
                    <li className='col-span-1 flex justify-center items-center hover:bg-gray-300 h-10 rounded'>
                        <button  aria-label='Bookmark'>
                            <img src={IconBookmarkBlue} alt="Bookmark" />
                        </button>
                    </li>
                    <li className='col-span-1 flex justify-center items-center hover:bg-gray-300 h-10 rounded'>
                        <button aria-label='Copy'>
                            <img src={IconCopyBlue} alt="Copy" />
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default MobileAppBar;
