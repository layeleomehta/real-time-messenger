import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
  } from "@chakra-ui/modal";
  import { Button, ModalOverlay, FormControl, Input, FormErrorMessage, VStack} from "@chakra-ui/react";
  import { useFormik } from "formik";
  import * as Yup from "yup"; 
  
  const AddFriendModal = ({ isOpen, onClose }) => {

    const formik = useFormik({
        initialValues: {
            friendName: "", 
        }, 
        // validationSchema: Yup.object({
        //     friendName: Yup.string()
        //                  .required("Username is required!")
        //                  .min(6, "Username too short!")
        //                  .max(30, "Username exceeds the maximum length allowed")
        // }),
        onSubmit: (values, actions) => {
            console.log(values); 
            actions.resetForm();  
            }
    }); 

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered="true">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a friend!</ModalHeader>
          <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={formik.errors.friendName && formik.touched.friendName}>
                    <Input
                        name="friendName"
                        placeholder='Enter the username you want to add!'
                        autoComplete='off'
                        size="lg"
                        value={formik.values.friendName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.friendName}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" type="submit" onClick={formik.handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default AddFriendModal;