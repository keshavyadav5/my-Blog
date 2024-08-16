import React from 'react';
import { Avatar, Button, Dropdown, DropdownHeader, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from 'react-redux'

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user)

  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg cursor-pointer'>Keshav's</span>Blog
      </Link>

      <div className='relative hidden lg:block'>
        <TextInput
          type='text'
          placeholder='Search...'
          className='pr-10'
        />
        <AiOutlineSearch className='absolute top-2.5 right-3 text-gray-400' />
      </div>

      <Button className='w-12 h-12 flex items-center justify-center lg:hidden' color='gray' pill>
        <AiOutlineSearch className='text-2xl' />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-12 hidden lg:flex items-center justify-center' color='gray' pill>
          <FaMoon />
        </Button>

        {
          currentUser ? (
            <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User"
                img={currentUser.profilePicture}
                rounded
              />
            }
            >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"} >
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
          )
            :
            (
              <Link to='/sign-in'>
                <Button gradientDuoTone='purpleToBlue' outline>
                  <span className='text-sm'>Sign In</span>
                </Button>
              </Link >
            )
        }
        <Navbar.Toggle />
      </div >

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/project'} as={'div'}>
          <Link to='/project'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar >
  );
}

export default Header;
