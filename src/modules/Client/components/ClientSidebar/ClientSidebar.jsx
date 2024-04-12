import { Flowbite, Sidebar } from 'flowbite-react';
import React from 'react';
import {
    HiChartPie,
    HiClipboardList,
    HiHome,
    HiOutlineCog,
    HiUser,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { customTheme } from '../../../../flowbite-theme';


const ClientSidebar = () => {
    return (
        <>
            {/* client-sidebar-app works! */}
            <Flowbite theme={{ theme: customTheme }}>
                <Sidebar aria-label="Sidebar with multi-level dropdown example">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/client" icon={HiChartPie}>
                                Dashboard
                            </Sidebar.Item>
                            {/* <Sidebar.Collapse
                                    icon={HiShoppingBag}
                                    label="E-commerce"
                                    renderChevronIcon={(theme, open) => {
                                        const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                                        return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                                    }}
                                >
                                    <Sidebar.Item href="#">Products</Sidebar.Item>
                                    <Sidebar.Item href="#">Sales</Sidebar.Item>
                                    <Sidebar.Item href="#">Refunds</Sidebar.Item>
                                    <Sidebar.Item href="#">Shipping</Sidebar.Item>
                                </Sidebar.Collapse> */}
                            <Sidebar.Item href="/client/history" icon={HiClipboardList}>
                                History
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiUser}>
                                Gaurds
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiHome}>
                                Beats
                            </Sidebar.Item>
                            <Sidebar.Item href="#" icon={HiOutlineCog}>
                                Settings
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </Flowbite>
        </>
    );
}

export default ClientSidebar;
