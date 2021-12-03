import { AppComponent } from 'next/dist/shared/lib/router/router'
import { ChakraProvider } from '@chakra-ui/react'

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return <ChakraProvider><Component {...pageProps} /></ChakraProvider>
}

export default MyApp
