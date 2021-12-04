import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  desc?: string;
  type?: string;
  imageUrl?: string;
}

const SEO: React.VFC<SEOProps> = ({ title, desc, type, imageUrl }) => {
  const { asPath } = useRouter();
  const tabInfo = {
    title,
    desc: desc || title,
  };

  const seoImage = imageUrl || '';

  return (
    <Head>
      <title>{tabInfo.title}</title>
      <meta property="og:title" content={tabInfo.title} />

      <meta property="og:description" content={tabInfo.desc} />
      <meta name="description" content={tabInfo.desc} />

      <link rel="canonical" href={`${process.env.URL}${asPath}`} />
      <meta property="og:url" content={`${process.env.URL}${asPath}`} />

      <meta property="og:image" content={seoImage} />

      <meta property="og:type" content={type || 'website'} />
    </Head>
  );
};

export default SEO;
