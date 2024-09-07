import axios from 'axios'
import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)

  const handlesubmit = async (e) => {
    e.preventDefault()
    try {
      if (comment.length > 200) { return; }
      const res = await axios.post(`http://localhost:3000/api/comment/create`, {
        content: comment,
        userId: currentUser?.rest?._id || currentUser?._id,
        postId
      }, {
        withCredentials: true
      })
      if (res.data.success === false) {
        toast(res.data.message)
      }
      setComment('')
      setCommentError(null)
    } catch (error) {
      setCommentError(error.message)
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ?
          (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
              <p>Signed in as:</p>
              <img src={currentUser?.profilePicture || currentUser?.rest.profilePicture} alt="" className='h-5 w-5 rounded-full object-cover' />
              <Link to={'/dashboard?tab=profile'} className='text-xs text-teal-500 hover:underline'>
                @{currentUser?.username || currentUser?.rest?.username}
              </Link>
            </div>
          ) :
          (
            <div className='text-sm text-emerald-500 my-5'>
              You must Signed in to comment.
              <Link to={'/sign-in'} className='ml-1 text-red-500 underline'>Sign in</Link>
            </div>
          )
      }
      {
        currentUser && (
          <form className='border border-e-teal-500 rounded-md p-3
          ' onSubmit={handlesubmit}>
            <Textarea
              placeholder='Add a comment...'
              rows='3'
              maxLength='200'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className='flex justify-between items-center mt-5'>
              <p className='text-xs text-gray-500'>{200 - comment.length} characters remaining</p>
              <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
            </div>
            {
              commentError && (
                <Alert color='failure'>{commentError}</Alert>
              )
            }
          </form>
        )
      }
    </div>
  )
}

export default CommentSection