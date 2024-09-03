import React, { useEffect, useState } from 'react'
import { Table } from 'flowbite-react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  console.log(userPosts);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/getposts?userId=${currentUser?.rest?._id || currentUser?._id}`)
        if (res.data.success === false) {
          toast.error('Error to fetch posts')
        }

        setUserPosts(res.data.posts)
      } catch (error) {
        toast.error(error.message)
        console.log(error.message);
      }
    }
    if (currentUser?.rest?.isAdmin || currentUser?.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._Id])
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser?.isAdmin || currentUser?.rest?.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date update</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {
              userPosts.map((post, index) => (
                <Table.Body key={index + "tablebody" + 100}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(post?.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img src={post?.image}
                          alt={post?.title}
                          className='w-20 h-10 object-cover rounded-md bg-gray-500' />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        {post?.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post?.category}
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-xl text-red-500 cursor-pointer'><MdDelete/></span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post?._id}`}>
                        <span className='text-teal-500'><FaEdit/></span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </>
      ) : (
        <p>You have no posts yets, please create some posts</p>
      )
      }
    </div >
  )
}

export default DashPosts