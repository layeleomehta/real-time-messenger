import React from 'react'; 
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack, 
    Button, 
    ButtonGroup, 
    Heading, 
    Input
  } from '@chakra-ui/react'; 
  import {useFormik} from "formik"; 
  import * as Yup from "yup"; 
  import { useNavigate } from 'react-router-dom';

const Login = () => {
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
        onSubmit: (values, actions) => {
            console.log(JSON.stringify(values));
            actions.resetForm();  
        }
    }); 

    const navigate = useNavigate(); 

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
            type="password  "
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