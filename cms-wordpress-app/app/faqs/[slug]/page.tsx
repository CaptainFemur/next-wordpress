import Head from "next/head";
import Container from "../../../components/container";
import PostBody from "../../../components/post-body";
import MoreStories from "../../../components/more-stories";
import Header from "../../../components/header";
import PostHeader from "../../../components/post-header";
import SectionSeparator from "../../../components/section-separator";
import Layout from "../../../components/layout";
import PostTitle from "../../../components/post-title";
import { Suspense } from "react";
import { getAllFAQsWithSlug, getFAQAndMoreFAQs } from "../../../lib/api";
import { CMS_NAME } from "../../../lib/constants";

export default async function FAQ({ params, preview, previewData }) {
    const {faqs, faq}  = await getInitialFAQs({ params, preview, previewData });
    const moreFAQs = faqs?.edges;

    return (
    <Layout preview={preview}>
        <Container>
            <Header />
            <Suspense fallback={
                <PostTitle>Loading…</PostTitle>
            }>
                <>
                    <article>
                        <Head>
                            <title>
                            {`${faq.title} | Next.js Blog Example with ${CMS_NAME}`}
                            </title>
                            <meta
                            property="og:image"
                            content={faq.featuredImage?.node.sourceUrl}
                            />
                        </Head>
                        <PostHeader
                            title={faq.title}
                            coverImage={faq.featuredImage}
                            date={faq.date}
                            author={faq.author}
                        />
                        <PostBody content={faq.content} />
                    </article>
                    <SectionSeparator />
                    {
                        moreFAQs.length > 0 && <MoreStories type="faqs" posts={moreFAQs} />
                    }
                </>
            </Suspense>
        </Container>
    </Layout>
    );
}

export const getInitialFAQs = async ({
    params,
    preview = false,
    previewData,
  }) => {
    const data = await getFAQAndMoreFAQs(params?.slug, preview, previewData);
    console.debug('FAQS', data);
    return {
        preview,
        faq: data.faqBy,
        faqs: data.faqs,
      };
};
  

export async function generateStaticParams() {
  const allPages = await getAllFAQsWithSlug();

  return allPages.edges.map(({ node }) => `/faqs/${node.slug}`) || []
};
