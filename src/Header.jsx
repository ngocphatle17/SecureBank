import React from 'react';
import { Link } from 'react-router-dom'; 

function Header() {
    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">SecureBank</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#dashboard" className="hover:text-blue-200">Dashboard</a></li>
                        <li><a href="#transfer" className="hover:text-blue-200">Transfer</a></li>
                        <li><a href="#bills" className="hover:text-blue-200">Bills</a></li>
                        <li><a href="#locate" className="hover:text-blue-200">Locate</a></li>
                        {/* Use Link component for navigation */}
                        <li>
                            <Link to="/signin" className="hover:text-blue-200">
                                Sign Out
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
