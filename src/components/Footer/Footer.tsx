import { Text, Icon } from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';

const Footer: React.VFC = () => {
  return (
    <Text
      my={8}
      as="a"
      href="https://github.com/fredericoo/pdf-parser"
      target="_blank"
      rel="noreferrer"
      color="gray.400"
      _hover={{ color: 'gray.500' }}
      aria-label="GitHub"
    >
      <Icon as={AiFillGithub} height="1.5rem" width="1.5rem" />
    </Text>
  );
};

export default Footer;
