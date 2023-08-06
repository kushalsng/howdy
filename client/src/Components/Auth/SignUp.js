import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null);

  const processImg = (file) => {};
  const submitHandler = () => {};
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
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
