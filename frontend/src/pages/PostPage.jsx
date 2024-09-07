import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction'

const PostPage = () => {
  const { postSlug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState();
  console.log(post);



  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:3000/api/post/getposts?slug=${postSlug}`)

        if (res.data.success === false) {
          setError(true)
          setLoading(false)
          toast.error('Error fetching posts');
        }
        setPost(res?.data?.posts)
        setLoading(false)
        setError(false)
      } catch (error) {
        setError(true)
        setLoading(false)
        toast.error('Error fetching posts');
      }
    }
    fetchPost()
  }, [postSlug])
  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post[0]?.title}</h1>
      <Link to={`/search?category=${post && post[0]?.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{post && post[0]?.category}</Button>
      </Link>
      <img src={post && post[0]?.image} alt={post && post[0]?.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post[0]?.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post[0]?.content?.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div className='p-3 max-w-2xl mx-auto post-content' dangerouslySetInnerHTML={{ __html: post && post[0]?.content }}></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
    </main>
  )
}

export default PostPage