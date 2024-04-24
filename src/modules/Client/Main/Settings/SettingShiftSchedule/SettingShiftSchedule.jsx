import React, { useEffect, useState } from 'react';
import TextInputField from '../../../../Sandbox/InputField/TextInputField';
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import { Dropdown } from 'flowbite-react';
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import ShiftConfigForm from './ShiftConfigForm/ShiftConfigForm';

const list_of_shifts = [
    {
        id: "1",
        name: "Early morning shift",
        startTime: "06:30 am",
        endTime: "09:30 am"
    },
    {
        id: "2",
        name: "Night shift",
        startTime: "09:00 pm",
        endTime: "06:00 am"
    }
]

const SettingShiftSchedule = () => {

    const [listOfShifts, setlistOfShifts] = useState(list_of_shifts);

    const [shiftStartSeconds, setShiftStartSeconds] = useState('00');
    const [shiftStartMinutes, setShiftStartMinutes] = useState('00');
    const [shiftStartMeridian, setShiftStartMeridian] = useState('am');
    // 
    const [shiftEndSeconds, setShiftEndSeconds] = useState('00');
    const [shiftEndMinutes, setShiftEndMinutes] = useState('00');
    const [shiftEndMeridian, setShiftEndMeridian] = useState('am');

    const [shiftNumber, setShiftNumber] = useState({
        numberOfShifts: "",
        numberOfMoreShifts: "",
    });

    const [shift, setShift] = useState({
        name: "",
        startTime: "",
        endTime: ""
    })
    const [formData, setFormData] = useState({
        numberOfShift: "",
        shift: [],
    });



    // Handler functions to update state variables
    const handleShiftStartMinutesChange = (e) => {
        setShiftStartMinutes(e.target.value);
        // setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const handleShiftStartSecondsChange = (e) => {
        setShiftStartSeconds(e.target.value);
    };

    const handleShiftStartMeridianChange = (e) => {
        setShiftStartMeridian(e.target.value);
    };

    // 

    const handleShiftEndMinutesChange = (e) => {
        setShiftEndMinutes(e.target.value);
    };

    const handleShiftEndSecondsChange = (e) => {
        setShiftEndSeconds(e.target.value);
    };

    const handleShiftEndMeridianChange = (e) => {
        setShiftEndMeridian(e.target.value);
    };

    // 

    const handleNumberOfShiftChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleShiftData = (e) => {
        setShift({ ...shift, [e.target.name]: e.target.value });
    }

    const handleAddShiftToList = (e) => {
        e.preventDefault();
        for (const key in shift) {
            if (Object.hasOwnProperty.call(shift, key)) {
                const element = shift[key];
                if (!element) return;

            }
        }
        setlistOfShifts([...listOfShifts, {id: (listOfShifts.length + 1).toString(), ...shift}]);
        setShift({
            name: "",
            startTime: "",
            endTime: ""
        })
    }

    useEffect(() => {
        setShift({
            ...shift, startTime: `${shiftStartMinutes}:${shiftStartSeconds} ${shiftStartMeridian}`,
            endTime: `${shiftEndMinutes}:${shiftEndSeconds} ${shiftEndMeridian}`
        });
        return () => {

        };
    }, [shift.name,
        shiftStartMinutes, shiftStartSeconds, shiftStartMeridian,
        shiftEndMinutes, shiftEndSeconds, shiftEndMeridian]);

    return (
        <>
            {/* setting-shift-schedule-app works! */}
            <div className="max-w-4xl">
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
                            onChange={handleNumberOfShiftChange}
                            value={formData.numberOfShift}
                        />
                    </div>
                    <div className="hidden sm:block col-span-12 sm:col-span-5">
                        <h3 className="font-bold">Configure shifts</h3>
                        <p>Input how the shifts should be</p>


                        {/* data test */}
                        {/* <div className="my-16"></div>
                        <p>Shift Date: {shift.name}</p>
                        <p>Selected shift start time: {`${shiftStartMinutes}:${shiftStartSeconds} ${shiftStartMeridian}`}</p>
                        <p>Selected shift end time: {`${shiftEndMinutes}:${shiftEndSeconds} ${shiftEndMeridian}`}</p> */}
                    </div>
                    <div className="col-span-12 sm:col-span-7">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                                {/* list of configured shifts */}
                                <ul className='grid grid-cols-1 gap-2'>
                                    {
                                        listOfShifts.map((shift) => {
                                            return <li key={shift.id} className='col-span-1'>
                                                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div>
                                                            <h3 className="font-bold">{shift.name}</h3>
                                                            <p className="text-dark-200">{shift.startTime}&nbsp;-&nbsp;{shift.endTime}</p>
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
                                        })
                                    }
                                    {/* <li className='col-span-1'>
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
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                        <hr className="my-4" />

                        {/* Shift configuration form */}
                        <ShiftConfigForm
                            shift={shift}
                            handleShiftData={handleShiftData}
                            handleShiftStartMinutesChange={handleShiftStartMinutesChange}
                            shiftStartMinutes={shiftStartMinutes}
                            shiftStartSeconds={shiftStartSeconds}
                            shiftEndMinutes={shiftEndMinutes}
                            shiftEndSeconds={shiftEndSeconds}
                            handleShiftEndMeridianChange={handleShiftEndMeridianChange}
                            handleShiftEndSecondsChange={handleShiftEndSecondsChange}
                            handleShiftEndMinutesChange={handleShiftEndMinutesChange}
                            handleShiftStartMeridianChange={handleShiftStartMeridianChange}
                            handleShiftStartSecondsChange={handleShiftStartSecondsChange}
                            handleAddShiftToList={handleAddShiftToList}
                        />
                    </div>
                </div>
                <div className="my-4"></div>
                <div className="text-right">
                    <RegularButton text="Save Changes" width="auto" padding="px-4 py-2" textSize="text-sm" />
                </div>
            </div>
        </>
    );
}

export default SettingShiftSchedule;
