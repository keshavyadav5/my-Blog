import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'

const Comment = ({ comment }) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await axios.get(`http://localhost:3000/api/user/${comment.userId}`, {
          withCredentials: true
        })
        setUser(res?.data)
      }
      getUser();
    } catch (error) {
      console.log(error.message);
    }
  }, [comment,user])
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gray-200' src={user?.profilePicture} alt={user?.username} />
      </div>
      <div className="flex-1">
        <div className="font-bold mr-1 text-xs truncate flex gap-1">
          <span>{user ? `@${user?.username}` : 'anonymous user'}</span>
          <span className="text-gray-600 text-xs ">{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className='text-gray-500 mb-2'>{comment?.content}</p>
      </div>
    </div>
  )
}

export default Comment 