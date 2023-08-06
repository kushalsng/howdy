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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = () => {};
  return (
    <VStack>
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
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme='red'
        width='100%'
        onClick={submitHandler}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default SignUp;
