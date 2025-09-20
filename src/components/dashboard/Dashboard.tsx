import { useState } from 'react';
import { MyTrips } from '@/components/dashboard/MyTrips';
import { Profile } from '@/components/dashboard/Profile';
import { Bookings } from '@/components/dashboard/Bookings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('my-trips');

  const renderContent = () => {
    switch (activeTab) {
      case 'my-trips':
        return <MyTrips />;
      case 'profile':
        return <Profile />;
      case 'bookings':
        return <Bookings />;
      default:
        return <MyTrips />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex mb-6 border-b">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'my-trips' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('my-trips')}
        >
          My Trips
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'bookings' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default Dashboard;