import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import LogIn from '../Components/Auth/LogIn';
import SignUp from '../Components/Auth/SignUp';
import { useNavigate } from 'react-router-dom';
import Howdy from '../Components/Howdy';
import { ChatState } from '../Context/ChatProvider';

const Homepage = () => {
  const { setUser } = ChatState()
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if(userData){
      setUser(userData);
      navigate('/chats');
    }
  }, [])
  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        justifyContent='center'
        p={3}
        bg='white'
        textColor='black'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Howdy />
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='enclosed'>
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LogIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
