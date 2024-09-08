import axios from 'axios'
import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Comment from './comment'

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [comments, setComments] = useState([])
  const navigate = useNavigate()

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
      } else {
        toast.success("Comment added successfully")
        setComments([res.data, ...comments])
        setComment('')
        setCommentError(null)
      }
    } catch (error) {
      setCommentError(error.message)
    }
  }

  const addComment = (e) => {
    setComment(e.target.value)
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/comment/getcomment/${postId}`, {
          withCredentials: true
        })
        setComments(res.data)
      } catch (error) {
        console.log(error.message);
        toast.error(error.message)
      }
    }
    fetchComments()
  }, [postId])

  const handleLikes = async (commentId) => {
    try {
      if (!currentUser) {
        toast.error("Please login to like a comment")
        navigate('/sign-in')
      }
      const res = await axios.put(`http://localhost:3000/api/comment/likeComment/${commentId}`, {
        userId: currentUser?._id,
      }, {
        withCredentials: true
      })
      if (res.data.success === false) {
        toast(res.data.message)
      }
      setComment(comments.map((comment) => {
        comment._id === commentId ? {
          ...comment,
          likes: res.data.likes,
          numberOfLikes: res.data.likes.length,
        } : comment
      }))

    } catch (error) {
      console.log(error.message);
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
              You must sign in to comment.
              <Link to={'/sign-in'} className='ml-1 text-red-500 underline'>Sign in</Link>
            </div>
          )
      }
      {
        currentUser && (
          <form className='border border-e-teal-500 rounded-md p-3' onSubmit={handlesubmit}>
            <Textarea
              placeholder='Add a comment...'
              rows='3'
              maxLength='200'
              onChange={addComment}
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
      {comments.length === 0 ? (
        <p className='text-sm text-gray-500'>No comments yet.</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-2'>
            <p>Comments</p>
            <p className='text-gray-500 border border-gray-500 py-1 px-2 rounded-sm'>{comments.length}</p>
          </div>
          {
            comments.map((comment, index) => (
              <Comment
                key={comment?._id}
                comment={comment}
                onlike={handleLikes}
              />
            ))
          }
        </>
      )}
    </div>
  )
}

export default CommentSection
