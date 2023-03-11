import React from 'react';
import {Text} from "@chakra-ui/react";

const navigationItems = [
    {
        title: 'Home',
        icon: 'home',
        path: '/'
    },
    {
        title: 'About',
        icon: 'info',
        path: '/about'
    },
    {
        title: 'Ceva',
        icon: 'info',
        path: '/about'
    },
    {
        title: 'Altceva',
        icon: 'info',
        path: '/about'
    },
    {
        title: 'Ceva mai mult',
        icon: 'info',
        path: '/about'
    }
]

export const Navbar = () => {
    return (
        <div className="w-full h-7 flex flex-row justify-around">
            <div className="flex flex-col">
                <Text>Reputation</Text>
                <Text className="mx-auto">CLIENT</Text>
            </div>
            <div className="flex flex-row">
                {
                    navigationItems.map((items, index) => {
                        return (
                            <div key={index} className="px-2">
                                <a href={items.path}>{items.title}</a>
                            </div>
                        )
                    })
                }
            </div>
            <div>DappConnect</div>
        </div>
    )
};

export default Navbar;