const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers["Authorization"] =
      `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 10 }
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getPreviewPost(id, idType = "DATABASE_ID") {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

//Todo pas sûr
export async function getPreviewPage(id, idType = "DATABASE_ID") {
  const data = await fetchAPI(
    `
    query PreviewPage($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.page;
}


export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPagesWithSlug() {
  const data = await fetchAPI(`
    {
      pages(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.pages;
}

export async function getAllFAQsWithSlug() {
  const data = await fetchAPI(`
    {
      faqs(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.faqs;
}


export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  return data?.posts;
}

// export async function getAllPagesForHome(preview) {
//   const data = await fetchAPI(
//     `
//     query AllPages {
//       pages(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
//         edges {
//           node {
//             title
//             slug
//             date
//             featuredImage {
//               node {
//                 sourceUrl
//               }
//             }
//             author {
//               node {
//                 name
//                 firstName
//                 lastName
//                 avatar {
//                   url
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//     {
//       variables: {
//         onlyEnabled: !preview,
//         preview,
//       },
//     },
//   );
// 
//   return data?.pages;
// }

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    },
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}

export async function getPageAndMorePages(slug, preview, previewData) {
  const pagePreview = preview && previewData?.page;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePage = isId
    ? Number(slug) === pagePreview.id
    : slug === pagePreview.slug;
  const isDraft = isSamePage && pagePreview?.status === "draft";
  const isRevision = isSamePage && pagePreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PageFields on Page {
      title
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
    }
    query PageBySlug($id: String!) {
      pageBy(uri: $id) {
        ...PageFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      pages(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PageFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? pagePreview.id : slug
      },
    },
  );

  // Draft pages may not have an slug
  if (isDraft) data.pageBy.slug = pagePreview.id;
  // Apply a revision (changes in a published page)
  if (isRevision && data.pageBy.revisions) {
    const revision = data.pageBy.revisions.edges[0]?.node;

    if (revision) Object.assign(data.pageBy, revision);
    delete data.pageBy.revisions;
  }

  // Filter out the main page
  data.pages.edges = data.pages.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 pages, remove the last one
  if (data.pages.edges.length > 2) data.pages.edges.pop();

  return data;
}

export async function getFAQAndMoreFAQs(slug, preview, previewData) {
  const faqPreview = preview && previewData?.faq;
  // The slug may be the id of an unpublished faq
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === faqPreview.id
    : slug === faqPreview.slug;
  const isDraft = isSamePost && faqPreview?.status === "draft";
  const isRevision = isSamePost && faqPreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment FaqFields on Faq {
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
    }
    query FaqBySlug($id: String!) {
      faqBy(uri: $id) {
        ...FaqFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      faqs(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...FaqFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? faqPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    },
  );

  // Draft faqs may not have an slug
  if (isDraft) data.faq.slug = faqPreview.id;
  // Apply a revision (changes in a published faq)
  if (isRevision && data.faq.revisions) {
    const revision = data.faq.revisions.edges[0]?.node;

    if (revision) Object.assign(data.faq, revision);
    delete data.faq.revisions;
  }

  // Filter out the main faq
  data.faqs.edges = data.faqs.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 faqs, remove the last one
  if (data.faqs.edges.length > 2) data.faqs.edges.pop();

  return data;
}