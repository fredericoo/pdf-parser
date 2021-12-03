import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, useColorModeValue, Icon } from '@chakra-ui/react';
import { AiFillFileAdd } from 'react-icons/ai';

type FileUploadProps = {
  onFileAccepted: (file: File) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileAccepted }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      onFileAccepted(acceptedFiles[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
    maxFiles: 1,
    multiple: false,
  });

  const dropText = isDragActive ? 'Drop the files here ...' : "Drag 'n' drop your file here, or click to select files";

  const activeBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue(isDragActive ? 'teal.300' : 'gray.300', isDragActive ? 'teal.500' : 'gray.500');

  return (
    <Center
      p={16}
      my={8}
      w="100%"
      cursor="pointer"
      bg={isDragActive ? activeBg : 'transparent'}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="2px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon as={AiFillFileAdd} mr={2} />
      <p>{dropText}</p>
    </Center>
  );
};

export default FileUpload;
