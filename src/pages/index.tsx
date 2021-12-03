import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/toast';
import Tesseract from 'tesseract.js';
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
} from '@chakra-ui/react';
import FileUpload from '../components/FileUpload';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

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

const Home = () => {
  const toast = useToast();

  const [pdf, setPdf] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (pdf) {
      pdfjsLib.getDocument(pdf).promise.then(async doc => {
        for (let i = 0; i < doc.numPages; i++) {
          const canvas = document.createElement('canvas');

          const page = await doc.getPage(i + 1);
          const context = canvas.getContext('2d');
          const viewport = page.getViewport({ scale: 3 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          setProgress({ current: 0, total: doc.numPages });

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          const pagePng = canvas.toDataURL('image/png');

          setProgress({ current: i + 1, total: doc.numPages });
          await Tesseract.recognize(pagePng, 'isl').then(({ data: { text } }) => {
            results.push(text);
          });
        }
        setResults(results);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf]);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({ status: 'error', title: 'Invalid file type' });
      return;
    }
    const pdfUrl = URL.createObjectURL(file);
    setPdf(pdfUrl);
  };

  if (!pdf) {
    return (
      <PageContent>
        <Heading as="h1" mb={4}>
          PDF parser
        </Heading>

        <Text mb={2}>Upload a pdf file to have it processed:</Text>

        <FileUpload onFileAccepted={handleFileSelect} />

        <Box mt={4}>
          <Heading size="md">How it works</Heading>
          <OrderedList>
            <ListItem>Each page of the uploaded PDF file will be converted to a PNG image</ListItem>
            <ListItem>Each PNG image will go through an OCR that will read the text on the screen</ListItem>
            <ListItem>A lookup for specific words in each text will generate a spreadsheet</ListItem>
          </OrderedList>
        </Box>
      </PageContent>
    );
  }

  if (progress.total > 0 && progress.total === progress.current) {
    return (
      <PageContent>
        <Text pb={2}>Processing complete!</Text>
        <HStack>
          <Button variant="solid" onClick={() => download(JSON.stringify(results), 'results.json')}>
            Download File
          </Button>
          <Button variant="outline" onClick={() => setPdf(undefined)}>
            Upload Another
          </Button>
        </HStack>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Progress
        w="100%"
        size="xs"
        value={(progress.current / progress.total) * 100}
        isIndeterminate={!progress.total}
      />
      <Text pt={2}>
        {!!progress.total ? `Processing page ${progress.current} of ${progress.total}…` : 'Processing PDF…'}
      </Text>
    </PageContent>
  );
};

export default Home;
