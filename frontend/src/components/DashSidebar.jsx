import { Sidebar, SidebarItem } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';

const DashSidebar = () => {

  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

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
            className='cursor-pointer'>
            Sign out
          </SidebarItem>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
