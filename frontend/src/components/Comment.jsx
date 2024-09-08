import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { FaThumbsUp } from "react-icons/fa6";

const Comment = ({ comment, onlike }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [user, setUser] = useState({})
  const [likes, setLikes] = useState(comment.likes)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${comment.userId}`, {
          withCredentials: true
        })
        setUser(res?.data)
      } catch (error) {
        console.log(error.message);
      }
    }
    getUser()

    if (currentUser && likes.includes(currentUser._id || currentUser.rest._id)) {
      setHasLiked(true)
    }
  }, [comment, currentUser, likes])

  const handleLike = async () => {
    try {
      const userId = currentUser?.rest?._id || currentUser?._id
      await onlike(comment?._id)

      if (hasLiked) {
        setLikes(likes.filter(id => id !== userId))
        setHasLiked(false)
      } else {
        setLikes([...likes, userId])
        setHasLiked(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

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
        <div className="">
          <button
            type='button'
            onClick={handleLike}
            className={`text-gray-500 hover:text-blue-500 text-sm ${
              hasLiked ? '!text-blue-500' : ''
            }`}
          >
            <FaThumbsUp />
          </button>
          <span className='ml-2'>{likes.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Comment
