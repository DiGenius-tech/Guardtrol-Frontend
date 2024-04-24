import React from 'react';
import TextInputField from '../../../../../Sandbox/InputField/TextInputField';

const ShiftConfigForm = (props) => {
    return (
        <>
            {/* shift-config-form-app works! */}

            <form action="">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <TextInputField
                            label="Name of shift"
                            name="name"
                            type="text"
                            id="name"
                            semibold_label={true}
                            //   error={validationErrors["name"]}
                            onChange={props.handleShiftData}
                            required="required"
                            value={props.shift.name}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <fieldset>
                            <legend className='block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold'>Shift starts</legend>

                            <div className="flex items-center gap-2">
                                <div className='flex items-center gap-2'>
                                    <div className='w-[50px]'>
                                        <input type='number' max={59} min={0}
                                            value={props.shiftStartMinutes}
                                            onChange={props.handleShiftStartMinutesChange}
                                            placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                    </div>
                                    <div>:</div>
                                    <div className='w-[50px]'>
                                        <input type='number' max={59} min={0}
                                            value={props.shiftStartSeconds}
                                            onChange={props.handleShiftStartSecondsChange} placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                    </div>
                                </div>
                                <ul className='flex items-center'>
                                    <li className="meridian-check">
                                        <input type="radio" id='shiftStartAM' name='shiftStartMeridian'
                                            value="am" onChange={(e) => props.handleShiftStartMeridianChange(e)} />
                                        <label htmlFor="shiftStartAM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-l-lg block w-full p-2.5'>AM</label>
                                    </li>
                                    <li className="meridian-check">
                                        <input type="radio" id='shiftStartPM' name='shiftStartMeridian'
                                            value="pm" onChange={(e) => props.handleShiftStartMeridianChange(e)} />
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
                                            value={props.shiftEndMinutes}
                                            onChange={props.handleShiftEndMinutesChange}
                                            placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                    </div>
                                    <div>:</div>
                                    <div className='w-[50px]'>
                                        <input type='number' max={59} min={0}
                                            value={props.shiftEndSeconds}
                                            onChange={props.handleShiftEndSecondsChange} placeholder='00' className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                                    </div>
                                </div>
                                <ul className='flex items-center'>
                                    <li className="meridian-check">
                                        <input type="radio" id='shiftEndAM' name='shiftEndMeridian'
                                            value="am" onChange={(e) => props.handleShiftEndMeridianChange(e)} />
                                        <label htmlFor="shiftEndAM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-l-lg block w-full p-2.5'>AM</label>
                                    </li>
                                    <li className="meridian-check">
                                        <input type="radio" id='shiftEndPM' name='shiftEndMeridian'
                                            value="pm" onChange={(e) => props.handleShiftEndMeridianChange(e)} />
                                        <label htmlFor="shiftEndPM" className='cursor-pointer text-center border border-gray-300 text-sm rounded-r-lg block w-full p-2.5'>PM</label>
                                    </li>
                                </ul>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-span-12">
                        <div className="sm:flex items-center justify-between flex-wrap">
                            <button type='submit' onClick={props.handleAddShiftToList} className="text-sm font-semibold text-primary-500">+ Save and configure another shift</button>
                            <span className='flex flex-nowrap text-sm text-dark-200'>
                                <span>1</span>/<span>5</span>&nbsp;Shifts
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ShiftConfigForm;
