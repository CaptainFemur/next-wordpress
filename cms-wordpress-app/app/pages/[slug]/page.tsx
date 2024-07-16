import Head from "next/head";
import Container from "../../../components/container";
import PostBody from "../../../components/post-body";
import MoreStories from "../../../components/more-stories";
import Header from "../../../components/header";
import PostHeader from "../../../components/post-header";
import SectionSeparator from "../../../components/section-separator";
import Layout from "../../../components/layout";
import PostTitle from "../../../components/post-title";
import Tags from "../../../components/tags";
import { Suspense } from "react";
import { getAllPagesWithSlug, getPageAndMorePages } from "../../../lib/api";
import { CMS_NAME } from "../../../lib/constants";

export default async function Post({ params, preview, previewData }) {
    const {pages, page}  = await getInitialPages({ params, preview, previewData });
    const morePages = pages?.edges;

    console.debug('NTM', page);

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
                            {`${page.title} | Next.js Blog Example with ${CMS_NAME}`}
                            </title>
                            <meta
                            property="og:image"
                            content={page.featuredImage?.node.sourceUrl}
                            />
                        </Head>
                        <PostHeader
                            title={page.title}
                            coverImage={page.featuredImage}
                            date={page.date}
                            author={page.author}
                        />
                        <PostBody content={page.content} />
                    </article>
                    <SectionSeparator />
                    {
                        morePages.length > 0 && <MoreStories posts={morePages} />
                    }
                </>
            </Suspense>
        </Container>
    </Layout>
    );
}

export const getInitialPages = async ({
    params,
    preview = false,
    previewData,
  }) => {
    const data = await getPageAndMorePages(params?.slug, preview, previewData);
  
    return {
        preview,
        page: data.pageBy,
        pages: data.pages,
      };
};
  

export async function generateStaticParams() {
  const allPages = await getAllPagesWithSlug();

  return allPages.edges.map(({ node }) => `/pages/${node.slug}`) || []
};
