import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../Helper/auth_api_helper';
import { ChatState } from '../../Context/ChatProvider';

const SignUp = () => {
  const { setUser } = ChatState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const processImg = (file) => {
    setLoading(true);
    if (!file) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
      return;
    }
    const imgRegex = /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/;
    if (!imgRegex.test(file.type)) {
      toast({
        title: 'Please select a valid image!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
      return;
    }
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'howdy-chat-app');
    data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    fetch(process.env.REACT_APP_CLOUDINARY_API, {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err) => {
        console.error('error in image upload, ', err);
        setLoading(false);
      });
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'All fields are mandatory',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
      return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Please enter a valid email!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await register({
        name,
        email,
        password,
        pic,
      });
      toast({
        title: 'Sign Up Successful!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setLoading(false);
      navigate('/chats');
    } catch (err) {
      console.error('error while sign up: ', err);
      toast({
        title: 'Unable to Sign Up',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl id='first-name' isRequired mb='1em'>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired mb='1em'>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired mb='1em'>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter The Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w='4rem'>
            <Button
              h='1.75rem'
              size='sm'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='confirm-password' isRequired mb='1em'>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm The Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement w='4rem'>
            <Button
              h='1.75rem'
              size='sm'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic' mb='1em'>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type='file'
          border='0'
          cursor='pointer'
          accept='image/*'
          onChange={(e) => processImg(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
