import React, { useEffect, useState } from 'react';
import TextInputField from '../../../../Sandbox/InputField/TextInputField';
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import { Dropdown } from 'flowbite-react';
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";

const SettingShiftSchedule = () => {

    const [shiftStartSeconds, setShiftStartSeconds] = useState('00');
    const [shiftStartMinutes, setShiftStartMinutes] = useState('00');
    const [shiftStartMeridian, setShiftStartMeridian] = useState('AM');
    // 
    const [shiftEndSeconds, setShiftEndSeconds] = useState('00');
    const [shiftEndMinutes, setShiftEndMinutes] = useState('00');
    const [shiftEndMeridian, setShiftEndMeridian] = useState('AM');

    const [numberOfShift, setnumberOfShift] = useState({
        numberOfShifts: "",
        numberOfMoreShifts: "",
    });
    const [shift, setShift] = useState({
        nameOfShift: "",
        shiftStartsTime: "",
        shiftEndTime: ""
    })
    const [formData, setFormData] = useState({
        numberOfShift: null,
        shift: [],
    });



    // Handler functions to update state variables
    const handleShiftStartMinutesChange = (e) => {
        console.log("handleShiftStartMinutesChange-e.target.value: ", e.target.value)
        setShiftStartMinutes(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const handleShiftStartSecondsChange = (e) => {
        console.log("handleShiftStartSecondsChange-e.target.value: ", e.target.value)
        setShiftStartSeconds(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const handleShiftStartMeridianChange = (e) => {
        console.log("handleShiftStartMeridianChange-e.target.value: ", e.target.value)
        setShiftStartMeridian(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    // 

    // Handler functions to update state variables
    const handleShiftEndMinutesChange = (e) => {
        console.log("handleShiftEndMinutesChange-e.target.value: ", e.target.value)
        setShiftEndMinutes(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const handleShiftEndSecondsChange = (e) => {
        console.log("handleShiftEndSecondsChange-e.target.value: ", e.target.value)
        setShiftEndSeconds(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const handleShiftEndMeridianChange = (e) => {
        console.log("handleShiftEndMeridianChange-e.target.value: ", e.target.value)
        setShiftEndMeridian(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    // 

    const handleNumberOfShiftChange = (e) => {
        console.log("e.target.value: ", e.target.value)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleAddShift = (e) => {
        console.log("e.target.value: ", e.target.value)
        setShift({ ...shift, [e.target.name]: e.target.value });
        console.log("shift: ", shift)
    }

    const handleAddShiftToList = () => {

    }

    useEffect(() => {
        setShift({ ...shift, shiftStartsTime: `${shiftStartMinutes}:${shiftStartSeconds} ${shiftStartMeridian}` });
        console.log("shift: ", shift)
        return () => {

        };
    }, [shiftStartMinutes, shiftStartSeconds, shiftStartMeridian]);

    return (
        <>
            {/* setting-shift-schedule-app works! */}
            <form action="" className="max-w-4xl">
                <div className="grid grid-cols-12 gap-4 sm:gap-8">
                    <div className="hidden sm:block col-span-12 sm:col-span-5">
                        <h3 className="font-bold">Number shifts</h3>
                        <p>Input how the shifts should be</p>
                    </div>
                    <div className="col-span-12 sm:col-span-7">
                        <div>
                            <ul className='flex items-center gap-4 flex-wrap'>
                                <li>
                                    <div className="flex items-center mb-4">
                                        <input id="one-shift" type="radio" name="numberOfShifts" value="1"
                                            onChange={(e) => handleNumberOfShiftChange(e)} className="custom-success-check | text-[#22C55E] w-4 h-4 border-gray-300 focus:ring-2 focus:ring-success-100 dark:focus:ring-success-500 dark:focus:bg-success-500 dark:bg-red-700 dark:border-gray-600" />
                                        <label htmlFor="one-shift" className="cursor-pointer block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                            1 Shift
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center mb-4">
                                        <input id="two-shifts" type="radio" name="numberOfShifts" value="2"
                                            onChange={(e) => handleNumberOfShiftChange(e)} className="custom-success-check | text-[#22C55E] w-4 h-4 border-gray-300 focus:ring-2 focus:ring-success-100 dark:focus:ring-success-500 dark:focus:bg-success-500 dark:bg-red-700 dark:border-gray-600" />
                                        <label htmlFor="two-shifts" className="cursor-pointer block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                            2 Shifts
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center mb-4">
                                        <input id="three-shifts" type="radio" name="numberOfShifts" value="3"
                                            onChange={(e) => handleNumberOfShiftChange(e)} className="custom-success-check | text-[#22C55E] w-4 h-4 border-gray-300 focus:ring-2 focus:ring-success-100 dark:focus:ring-success-500 dark:focus:bg-success-500 dark:bg-red-700 dark:border-gray-600" />
                                        <label htmlFor="three-shifts" className="cursor-pointer block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                            3 Shifts
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center mb-4">
                                        <input id="four-shifts" type="radio" name="numberOfShifts" value="4"
                                            onChange={(e) => handleNumberOfShiftChange(e)} className="custom-success-check | text-[#22C55E] w-4 h-4 border-gray-300 focus:ring-2 focus:ring-success-100 dark:focus:ring-success-500 dark:focus:bg-success-500 dark:bg-red-700 dark:border-gray-600" />
                                        <label htmlFor="four-shifts" className="cursor-pointer block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                            4 Shifts
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center mb-4">
                                        <input id="more-than-four-shifts" type="radio" name="numberOfShifts" value="more-than-4"
                                            onChange={(e) => handleNumberOfShiftChange(e)} className="custom-success-check | text-[#22C55E] w-4 h-4 border-gray-300 focus:ring-2 focus:ring-success-100 dark:focus:ring-success-500 dark:focus:bg-success-500 dark:bg-red-700 dark:border-gray-600" />
                                        <label htmlFor="more-than-four-shifts" className="cursor-pointer block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                            More than 4 Shifts
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="my-2"></div>
                        <TextInputField
                            label="How many shifts?"
                            name="numberOfMoreShifts"
                            type="text"
                            id="numberOfMoreShifts"
                            semibold_label={true}
                            //   error={validationErrors["name"]}
                            onChange={handleNumberOfShiftChange}
                            //   required="required"
                            value={numberOfShift.numberOfMoreShifts}
                        />
                    </div>
                    <div className="hidden sm:block col-span-12 sm:col-span-5">
                        <h3 className="font-bold">Configure shifts</h3>
                        <p>Input how the shifts should be</p>

                        <div className="my-16"></div>
                        <p>Shift Date: {shift.nameOfShift}</p>
                        <p>Selected shift start time: {`${shiftStartMinutes}:${shiftStartSeconds} ${shiftStartMeridian}`}</p>
                        <p>Selected shift end time: {`${shiftEndMinutes}:${shiftEndSeconds} ${shiftEndMeridian}`}</p>
                    </div>
                    <div className="col-span-12 sm:col-span-7">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                                <ul className='grid grid-cols-1 gap-2'>
                                    <li className='col-span-1'>
                                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div className="flex items-center justify-between text-sm">
                                                <div>
                                                    <h3 className="font-bold">Early morning shift</h3>
                                                    <p className="text-dark-200">06:30 am - 09:30 am</p>
                                                </div>
                                                <Dropdown
                                                    label=""
                                                    placement="right"
                                                    dismissOnClick={false}
                                                    renderTrigger={() => (
                                                        <button type='button' className="flex w-8 justify-end">
                                                            <img src={icon_menu_dots} alt="menu" />
                                                        </button>
                                                    )}
                                                >
                                                    <Dropdown.Item>Edit</Dropdown.Item>
                                                    <Dropdown.Item>Remove</Dropdown.Item>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </li>
                                    <li className='col-span-1'>
                                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div className="flex items-center justify-between text-sm">
                                                <div>
                                                    <h3 className="font-bold">Early morning shift</h3>
                                                    <p className="text-dark-200">06:30 am - 09:30 am</p>
                                                </div>
                                                <Dropdown
                                                    label=""
                                                    placement="right"
                                                    dismissOnClick={false}
                                                    renderTrigger={() => (
                                                        <button type='button' className="flex w-8 justify-end">
                                                            <img src={icon_menu_dots} alt="menu" />
                                                        </button>
                                                    )}
                                                >
                                                    <Dropdown.Item>Edit</Dropdown.Item>
                                                    <Dropdown.Item>Remove</Dropdown.Item>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-span-12">
                                <TextInputField
                                    label="Name of shift"
                                    name="nameOfShift"
                                    type="text"
                                    id="nameOfShift"
                                    semibold_label={true}
                                    //   error={validationErrors["name"]}
                                    onChange={handleAddShift}
                                      required="required"
                                    value={shift.nameOfShift}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <fieldset>
                                    <legend className='block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold'>Shift starts</legend>

                                    <div className="flex items-center gap-2">
                                        <div className='flex items-center gap-2'>
                                            <div className='w-[50px]'>
                                                <input type='number' max={59} min={0}
                                                    value={shiftStartMinutes}
                                                    onChange={handleShiftStartMinutesChange}
                                                    placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                            </div>
                                            <div>:</div>
                                            <div className='w-[50px]'>
                                                <input type='number' max={59} min={0}
                                                    value={shiftStartSeconds}
                                                    onChange={handleShiftStartSecondsChange} placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                            </div>
                                        </div>
                                        <ul className='flex items-center'>
                                            <li className="meridian-check">
                                                <input type="radio" id='shiftStartAM' name='shiftStartMeridian'
                                                    value="AM" onChange={(e) => handleShiftStartMeridianChange(e)} />
                                                <label htmlFor="shiftStartAM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-l-lg block w-full p-2.5'>AM</label>
                                            </li>
                                            <li className="meridian-check">
                                                <input type="radio" id='shiftStartPM' name='shiftStartMeridian'
                                                    value="PM" onChange={(e) => handleShiftStartMeridianChange(e)} />
                                                <label htmlFor="shiftStartPM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-r-lg block w-full p-2.5'>PM</label>
                                            </li>
                                        </ul>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <fieldset>
                                    <legend className='block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold'>Shift ends</legend>

                                    <div className="flex items-center gap-2">
                                        <div className='flex items-center gap-2'>
                                            <div className='w-[50px]'>
                                                <input type='number' max={59} min={0}
                                                    value={shiftEndMinutes}
                                                    onChange={handleShiftEndMinutesChange}
                                                    placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                            </div>
                                            <div>:</div>
                                            <div className='w-[50px]'>
                                                <input type='number' max={59} min={0}
                                                    value={shiftEndSeconds}
                                                    onChange={handleShiftEndSecondsChange} placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                            </div>
                                        </div>
                                        <ul className='flex items-center'>
                                            <li className="meridian-check">
                                                <input type="radio" id='shiftEndAM' name='shiftEndMeridian'
                                                    value="AM" onChange={(e) => handleShiftEndMeridianChange(e)} />
                                                <label htmlFor="shiftEndAM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-l-lg block w-full p-2.5'>AM</label>
                                            </li>
                                            <li className="meridian-check">
                                                <input type="radio" id='shiftEndPM' name='shiftEndMeridian'
                                                    value="PM" onChange={(e) => handleShiftEndMeridianChange(e)} />
                                                <label htmlFor="shiftEndPM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-r-lg block w-full p-2.5'>PM</label>
                                            </li>
                                        </ul>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-span-12">
                                <div className="flex items-center justify-between flex-wrap">
                                    <button type='submit' className="text-sm font-semibold text-primary-500">+ Save and configure another shift</button>
                                    <span className='flex flex-nowrap text-sm text-dark-200'>
                                        <span>1</span>/<span>5</span>&nbsp;Shifts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-4"></div>
                <div className="text-right">
                    <RegularButton text="Save Changes" width="auto" padding="px-4 py-2" textSize="text-sm" />
                </div>
            </form>
        </>
    );
}

export default SettingShiftSchedule;
