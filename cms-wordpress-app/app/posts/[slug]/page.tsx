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
import { getAllPostsWithSlug, getPostAndMorePosts } from "../../../lib/api";
import { CMS_NAME } from "../../../lib/constants";

export default async function Post({ params, preview, previewData }) {
    const {posts, post}  = await getInitialPosts({ params, preview, previewData });

    const morePosts = posts?.edges;
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
                            {`${post.title} | Next.js Blog Example with ${CMS_NAME}`}
                            </title>
                            <meta
                            property="og:image"
                            content={post.featuredImage?.node.sourceUrl}
                            />
                        </Head>
                        <PostHeader
                            title={post.title}
                            coverImage={post.featuredImage}
                            date={post.date}
                            author={post.author}
                            categories={post.categories}
                        />
                        <PostBody content={post.content} />
                        <footer>
                            {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
                        </footer>
                    </article>
                    <SectionSeparator />
                    {
                        morePosts.length > 0 && <MoreStories posts={morePosts} />
                    }
                </>
            </Suspense>
        </Container>
    </Layout>
    );
}

export const getInitialPosts = async ({
    params,
    preview = false,
    previewData,
  }) => {
    const data = await getPostAndMorePosts(params?.slug, preview, previewData);
  
    return {
        preview,
        post: data.post,
        posts: data.posts,
      };
};
  

export async function generateStaticParams() {
  const allPosts = await getAllPostsWithSlug();

  return allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || []
};
