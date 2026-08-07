import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarApp from './NavBar';

export default function HomePage() {
    return (
        <>
            <NavbarApp />
            <main>
                <Outlet />
            </main>
        </>
    );
}
