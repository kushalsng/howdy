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
import { login } from '../../Helper/auth_api_helper';
import { ChatState } from '../../Context/ChatProvider';

const SignUp = () => {
  const { setUser, setChats, setSelectedChat } = ChatState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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
      setChats(null)
      setSelectedChat(null)
      const { data } = await login({
        email,
        password,
      });
      toast({
        title: 'LogIn Successful!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token',data.token);
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
  const handleGuestCredentials = async () => {};
  return (
    <VStack>
      <FormControl id='emailLogin' isRequired mb='1em'>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='passwordLogin' isRequired mb='1em'>
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
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      {/* <Button colorScheme='blue' width='100%' onClick={handleGuestCredentials}>
        Get Guest User Credentials
      </Button> */}
    </VStack>
  );
};

export default SignUp;
