import { Metadata } from 'next'
import { CMS_NAME } from "../lib/constants";
import Container from "../components/container";
import Intro from "../components/intro";
import { getAllPostsForHome } from "../lib/api";
import HomePage from "./home-page"; 

export const metadata: Metadata = {
  title: `Next.js Blog Example with ${CMS_NAME}`,
}
 
export default async function Page({ preview }) {
    const {allPosts: { edges }}  = await getInitialPosts({ preview });
    const heroPost = edges[0]?.node;
    const morePosts = edges.slice(1);

    return (
        <Container>
            <Intro />
            <HomePage heroPost={heroPost} morePosts={morePosts} />
        </Container>
    );
}

export const getInitialPosts = async ({ preview = false }) => {
    const allPosts = await getAllPostsForHome(preview);
  
    return {
      allPosts, preview
    };
};
  