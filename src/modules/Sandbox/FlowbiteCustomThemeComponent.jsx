import { Badge, Button, Flowbite } from "flowbite-react";
import { customTheme } from "../../flowbite-theme.ts";


export default function FlowbiteCustomThemeComponent() {
  return <>
    <Flowbite theme={{ theme: customTheme }}>
      <Button className="bg-red-500 hover:bg-red-600">Click me</Button>
      <Button  color="primary">Click me</Button>
    </Flowbite>
    <div className="my-4"></div>
    <span className="flex"><Badge color="warning">20</Badge></span>
  </>;
}