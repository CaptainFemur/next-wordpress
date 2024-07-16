'use client' ;
import HeroPost from "../components/hero-post";
import MoreStories from "../components/more-stories";

export default function HomePage({ heroPost, morePosts }) {
    return (
        <div>
            {heroPost && (
                <HeroPost
                title={heroPost.title}
                coverImage={heroPost.featuredImage}
                date={heroPost.date}
                author={heroPost.author}
                slug={heroPost.slug}
                excerpt={heroPost.excerpt}
                />
            )}
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </div>
    );
}