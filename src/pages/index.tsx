import { useState } from 'react';
import { useToast } from '@chakra-ui/toast';
import download from '../lib/download';
import {
  Progress,
  Text,
  Container,
  Button,
  HStack,
  styled,
  Heading,
  OrderedList,
  ListItem,
  Box,
  Icon,
} from '@chakra-ui/react';
import SEO from '../components/SEO';
import FileUpload from '../components/FileUpload';
import pdfToImages from '../lib/pdfToImages';
import OCRImages from '../lib/OCRImages';
import { AiFillInfoCircle } from 'react-icons/ai';

const PageContent = styled(Container, {
  baseStyle: {
    maxW: 'container.lg',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    py: 8,
    minH: '100vh',
  },
});

const pageInfo = {
  title: 'Scanned PDF to JSON',
  desc: "Upload a PDF file and we'll convert it to a JSON file with the text on each page.",
};

const Home = () => {
  const toast = useToast();

  const [progress, setProgress] = useState<{ current: number; total: number; type?: 'Processing' | 'Recognising' }>({
    current: 0,
    total: 0,
  });
  const [results, setResults] = useState<Record<string, string>>({});

  const handleFileSelect = async (file: File) => {
    if (file?.type !== 'application/pdf') {
      toast({ status: 'error', title: 'Invalid file type' });
      return;
    }
    const pdfUrl = URL.createObjectURL(file);

    const imageUrls = await pdfToImages(pdfUrl, {
      scale: 2,
      onStart: progress => setProgress({ ...progress, total: progress.total * 2, type: 'Processing' }),
      onProgress: progress => setProgress({ ...progress, total: progress.total * 2, type: 'Processing' }),
    });
    const recognisedImages = await OCRImages(imageUrls, {
      onStart: progress =>
        setProgress({ current: progress.total + progress.current, total: progress.total * 2, type: 'Recognising' }),
      onProgress: progress =>
        setProgress({ current: progress.total + progress.current, total: progress.total * 2, type: 'Recognising' }),
    });

    setResults(recognisedImages);
  };

  if (!progress.total) {
    return (
      <PageContent>
        <SEO title={pageInfo.title} desc={pageInfo.desc} imageUrl="/favicon.png" />
        <Heading as="h1" mb={4}>
          Recognise text in your PDF files
        </Heading>

        <Box mt={4}>
          <Heading size="md">How it works</Heading>
          <OrderedList>
            <ListItem>Each page of the uploaded PDF file will be converted to a PNG image</ListItem>
            <ListItem>Each PNG image will go through an OCR that will read the text on the screen</ListItem>
            <ListItem>A JSON file download will be available for you with the contents of each page.</ListItem>
          </OrderedList>
        </Box>

        <FileUpload onFileAccepted={handleFileSelect} />

        <Box color="blue.500" display="flex" alignItems="center" borderRadius="md">
          <Icon as={AiFillInfoCircle} mr={2} />
          <Text as="span">
            No data about your files is collected or stored. All the processing and text recognition happens on your
            device.
          </Text>
        </Box>
      </PageContent>
    );
  }

  if (progress.total === progress.current) {
    return (
      <PageContent>
        <SEO title="Processing complete!" desc={pageInfo.desc} imageUrl="/favicon.png" />
        <Text pb={2}>Processing complete!</Text>
        <HStack>
          <Button variant="solid" onClick={() => download(JSON.stringify(results), 'results.json')}>
            Download File
          </Button>
          <Button variant="outline" onClick={() => setProgress({ current: 0, total: 0 })}>
            Upload Another
          </Button>
        </HStack>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <SEO
        title={`${Math.floor((progress.current / progress.total) * 100)}% complete`}
        desc={pageInfo.desc}
        imageUrl="/favicon.png"
      />

      <Progress
        w="100%"
        size="xs"
        value={(progress.current / progress.total) * 100}
        isIndeterminate={!progress.total}
      />
      <Text pt={2}>
        {!!progress.total ? `${progress.type} page ${progress.current} of ${progress.total}…` : 'Processing PDF…'}
      </Text>
    </PageContent>
  );
};

export default Home;
