import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  updateStart, 
  updateSuccess, 
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
 } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify'
import { HiOutlineExclamationCircle } from "react-icons/hi";


const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [ showModel, setShowModel] = useState(false)
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError('File must be less than 2MB');
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      alert('Please fill all fields');
      return;
    }
    try {
      dispatch(updateStart());
      const token = currentUser.token;

      const res = await axios.put(
        `http://localhost:3000/api/user/update/${currentUser.rest._id}`,
        {
          email: formData.email,
          profilePicture: formData.profilePicture,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully");
        dispatch(updateSuccess(res.data));
      } else {
        toast.error(res.data.message || "Failed to update profile");
        dispatch(updateFailure(res.data.message));
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
        withCredentials: true,
      });
  
      if (res.status !== 200) {
        toast.error(res.data.message || "Failed to delete user");
        dispatch(deleteUserFailure(res.data.message));
      } else {
        toast.success("User deleted successfully");
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      dispatch(deleteUserFailure(error.message));
    }
  };
  

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleOnChange}
          accept='image/*'
          ref={filePickerRef}
          hidden
        />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                },
                path: {
                  stroke: `rgba(62,152,${imageFileUploadingProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`}
          />
        </div>
        {imageFileUploadingError && (
          <Alert color='failure'>
            {imageFileUploadingError}
          </Alert>
        )}
        <TextInput
          type="text"
          id='username'
          placeholder='username'
          defaultValue={currentUser.username || currentUser.username}
          onChange={handleChange}
          readOnly
        />
        <TextInput
          type="email"
          id='email'
          placeholder='email'
          defaultValue={currentUser.email || currentUser.email} 
          onChange={handleChange}
          readOnly
        />
        <TextInput
          type="password"
          id='password'
          placeholder='password'
          onChange={handleChange}
          readOnly
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled>
          Update
        </Button>
        <div className="text-red-500 flex justify-between">
          <span 
          className='cursor-pointer'
          onClick={() => setShowModel(true)}
          >Delete Account</span>
          <span className='cursor-pointer'>Sign out</span>
        </div>
      </form>
      <Modal 
      show={showModel}
      onClick={()=>setShowModel(false)}
      popup
      size='md'
      >
      <Modal.Header/>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-200'>Are you sure to delete your accoount?</h3>
          <div className='flex justify-center gap-5'>
            <Button color='failure' onClick={handleDeleteUser}>
              Yes, I'm sure
            </Button>
            <Button color='gray' onClick={()=>setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
