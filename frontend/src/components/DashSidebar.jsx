import { Sidebar, SidebarItem } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signoutSuccess } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';

const DashSidebar = () => {

  const location = useLocation()
  const [tab, setTab] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  const handleSignout = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/user/signout', 
        {},
        { withCredentials: true }
      );
  
      if (res.status !== 200) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
        dispatch(signoutSuccess())
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          <Link to='/dashbaord?tab=profiile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser} label={'user'}
              labelColor='dark'
              as='div'
              >
              Profile
            </SidebarItem>
          </Link>

          <SidebarItem
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
            >
            Sign out
          </SidebarItem>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
