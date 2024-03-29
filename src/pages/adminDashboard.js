import React, { useState } from 'react';
import Sidebar from '../components/adminDashboardComponents/Sidebar';
import UsersTab from '../components/adminDashboardComponents/UsersTab';
import SongsTab from '../components/adminDashboardComponents/SongsTab';
import '../App.css';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('users');

    let content;
    switch (activeTab) {
        case 'users':
            content = <UsersTab />;
            break;
        case 'songs':
            content = <SongsTab />;
            break;
        default:
            content = <div>Select a tab</div>;
    }

    return (
        <div className="adminDashboard">
            <Sidebar setActiveTab={setActiveTab} />
            <div className="content">{content}</div>
        </div>
    );
}

export default Dashboard;