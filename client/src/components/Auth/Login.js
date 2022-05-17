import React, { useContext, useState } from 'react'; 
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack, 
    Button, 
    ButtonGroup, 
    Heading, 
    Input, 
    Text
  } from '@chakra-ui/react'; 
  import {useFormik} from "formik"; 
  import * as Yup from "yup"; 
  import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';

const Login = () => {
    const navigate = useNavigate(); 

    const {setUser} = useContext(AccountContext); 
    const [error, setError] = useState(null); 

    const formik = useFormik({
        initialValues: {
            username: "", 
            password: ""
        }, 
        validationSchema: Yup.object({
            username: Yup.string()
                         .required("Username is required!")
                         .min(6, "Username too short!")
                         .max(30, "Username exceeds the maximum length allowed"), 
            password: Yup.string()
                         .required("Password is required!")
                         .min(6, "Password too short!")
                         .max(30, "Password exceeds the maximum length allowed")

        }),
        onSubmit: async (values, actions) => {
              // obtain user input data (this is formData)
              const formData = {...values}; 
              actions.resetForm();  

              // create a post request to the backend to the login route
              const existingUser = await fetch("http://localhost:4000/auth/login", {
                method: "POST", 
                credentials: "include", 
                headers: {
                  "Content-Type": "application/json"
                }, 
                body: JSON.stringify(formData)
              }); 


              const existingUserData = await existingUser.json();
              if(!existingUserData) return; 

              if(existingUserData.status){
                  // set this as the error message from context
                  setError(existingUserData.status)
              } else if(existingUserData.loggedIn){
                  // set this as user object from context
                  setUser({...existingUserData}); 
                  navigate("/home"); 
              }


            }
    }); 

  return (
    <VStack as="form"
            w={{base: "90%", md: "500px"}}
            m="auto"
            justify="center"
            height="100vh"
            spacing="1rem"
            onSubmit={formik.handleSubmit}
    >  

    <Heading>Log in!</Heading>

    <Text as="p" color="red.500">
          {error}
    </Text>

    <FormControl isInvalid={formik.errors.username && formik.touched.username}>
        <FormLabel fontSize="lg">Username</FormLabel>
        <Input
            name="username"
            placeholder='Enter your username'
            autoComplete='off'
            size="lg"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
    </FormControl>

    <FormControl isInvalid={formik.errors.password && formik.touched.password}>
        <FormLabel fontSize="lg">Password</FormLabel>
        <Input
            name="password"
            placeholder='Enter your password'
            autoComplete='off'
            size="lg"
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
    </FormControl>

    <ButtonGroup variant='outline' spacing='6' pt="1rem">
    <Button colorScheme='blue' type='submit'>Log In</Button>
    <Button onClick={() => navigate("/register")}>Sign Up</Button>
    </ButtonGroup>

    </VStack>
  )         
}

export default Login; 