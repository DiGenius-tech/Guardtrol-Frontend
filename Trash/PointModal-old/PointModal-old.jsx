import React, {  useState } from 'react';
import cancel_icon_dark from "../../../../../images/icons/cancel-icon-dark.svg";

const routeList = [
    {
        id: 1,
        title: "Prince Bella Hotels & Tours",
        address: "No 14 Modupe Shitta street, Off Liasu Road close to Synagogue Church, Lagos 100265",
        point: "point-1",
        mapLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.738038640648!2d3.276644774644562!3d6.554718793438388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8fc27a7b025f%3A0xfe809984750c8912!2sPrince%20Bella%20Hotels%20%26%20Tours!5e0!3m2!1sen!2sng!4v1711464853318!5m2!1sen!2sng`
    },
    {
        id: 2,
        title: "Sugarland Hotel and Suites",
        point: "point-2",
        address: "Onile Wura, 8/10 Ajayi Close, Liasu Rd, Ikotun, Lagos",
        mapLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.768155155137!2d3.272475396789555!3d6.550929000000022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8fea17de5ccb%3A0x8633a3fc85cacf3b!2sSugarland%20Hotel%20and%20Suites!5e0!3m2!1sen!2sng!4v1711467333676!5m2!1sen!2sng`
    }
]

const PointModal = () => {
    const initialState = routeList[0]
    const [route, setRoute] = useState(initialState);

    const handleChangeRoute = (e) => {
        setRoute(JSON.parse(e.target.value))
    }


    return (
        <>
            {/* point-modal-app works! */}


            {/* <!-- Modal toggle --> */}
            <button type='button' data-modal-target="default-modal" data-modal-toggle="default-modal" className='flex mx-auto underline text-base font-normal text-primary-500 hover:text-secondary-500'>View the points</button>

            {/* <!-- Main modal --> */}
            <div id="default-modal" tabIndex="-1" aria-hidden="true" className="text-base hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-xl shadow dark:bg-gray-700">
                        {/* <!-- Modal header --> */}
                        <div className="p-4 md:p-5 dark:border-gray-600">
                            <button type="button" className="flex text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-7 h-7 ms-auto justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <img src={cancel_icon_dark} alt="Close modal" />
                                <span className="sr-only">Close modal</span>
                            </button>
                            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                                View the route
                            </h3>
                        </div>

                        {/* <!-- Modal body --> */}
                        <div className="p-4 sm:p-8 space-y-4">
                            <div className="mb-6">
                                <label
                                    htmlFor="point"
                                    className="block mb-2 font-semibold dark:text-white text-start sm:text-lg"
                                >
                                    Select point
                                </label>
                                <select onChange={(e) => handleChangeRoute(e)} id="point" className="cursor-pointer border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                                    {
                                        routeList.map((route) => {
                                            return <option value={JSON.stringify(route)} key={route.id}>{route.title}</option>
                                        })
                                    }
                                </select>

                            </div>

                            <div className='rounded-xl overflow-hidden border border-secondary-500'>
                                <iframe title={route.title} src={route.mapLink} width="100%" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PointModal;
