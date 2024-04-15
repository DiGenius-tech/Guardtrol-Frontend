import { Badge, Button, Card, Flowbite } from "flowbite-react";
import React, { useState } from "react";
import handClickImage from "../../images/handclick-featured-image.svg";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { customTheme } from "../../flowbite-theme.ts";
// lorem348
const patro_points = [
  {
    id: 1,
    title: "Maxime ipsam debitis eum delectus minus",
    image:
      "https://images.pexels.com/photos/4070976/pexels-photo-4070976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    title: "Minus possimus vitae repellendus eum",
    image:
      "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    title: "Minus possimus vitae repellendus eum",
    image:
      "https://images.pexels.com/photos/7587825/pexels-photo-7587825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 4,
    title: "Minus possimus vitae repellendus eum",
    image:
      "https://img.freepik.com/free-photo/house-isolated-field_1303-23773.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

const PatrolRouteConfiguration = () => {
  const [patrolPoints, setpatrolPoints] = useState(patro_points);
  console.log(patrolPoints);
  return (
    <>
      {/* patrol-route-configuration-app works! */}

      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {/* <Outlet /> */}
        <div className="mx-auto max-w-[500px] my-16">
          <div className="relative">
            <button
              className="btn-icon arrow-left left-0 top-0 absolute"
              aria-label="back"
            ></button>
            <h1 className="ms-4 font-bold text-center text-xl text-dark-450">
              Patrol route configuration
            </h1>
          </div>

          <div className="my-8 sm:my-16"></div>
          <button className="block w-full">
            <Card href="#" className="py-2">
              <div className="flex items-center justify-center">
                <img src={handClickImage} alt="Click" />
              </div>
              <p className="text-primary-500 font-bold text-xl text-center max-w-48 mx-auto">
                Click here to add another patrol point
              </p>
            </Card>
          </button>

          <div className="my-32"></div>

          <ul className="flex flex-nowrap gap-2 overflow-scroll">
            {patrolPoints.map((pt, i) => {
              console.log("pt: ", pt);
              const { image, id } = pt;
              // let {image} = `url('${point.image}')`;
              console.log("image: ", image);
              return (
                <li className="min-w-[90px] sm:min-w-[130px]" key={id}>
                  <div
                    className={
                      "bg-[url('" +
                      image +
                      "')] " +
                      `point-card | h-32 relative w-full rounded-md overflow-hidden bg-center bg-no-repeat bg-cover`
                    }
                  >
                    <span className="absolute top-1 left-1">
                      <Flowbite theme={{ theme: customTheme }}>
                        <Badge color="dark_transparent_badge">{i + 1}</Badge>
                      </Flowbite>
                    </span>
                    <p>Hello</p>
                    {/* <img
                        src={`https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                        alt=""
                      /> */}
                    {/* <img
                        src={image}
                        alt=""
                        className="w-auto"
                      /> */}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="my-8"></div>
          <RegularButton text="Submit" />
        </div>
      </div>
    </>
  );
};

export default PatrolRouteConfiguration;
