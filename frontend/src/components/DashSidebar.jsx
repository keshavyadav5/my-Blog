import { Sidebar, SidebarItem } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signoutSuccess } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user)
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
        <Sidebar.ItemGroup className='flex gap-1 flex-col'>

          <Link to='/dashboard?tab=profile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser} label={(currentUser?.rest?.isAdmin || currentUser?.isAdmin) ? 'Admin' : 'user'}
              labelColor='dark'
              as='div'
            >
              Profile
            </SidebarItem>
          </Link>
          <Link to='/dashboard?tab=posts'>
            <SidebarItem
              active={tab === 'posts'}
              icon={MdOutlinePostAdd}
              as='div'
            >
              Posts
            </SidebarItem>
          </Link>
          <Link to='/dashboard?tab=users'>
            <SidebarItem
              active={tab === 'users'}
              icon={HiOutlineUserGroup}
              as='div'
            >
              Users
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
