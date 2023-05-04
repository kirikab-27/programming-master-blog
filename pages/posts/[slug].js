import Head from 'next/head'
import Image from 'next/image'
import { GraphQLClient, gql}  from "graphql-request"; //バックエンド連携 
import styles from "../../styles/Slug.module.css";
import Link from 'next/link';

const graphcms = new GraphQLClient(
  "https://api-ap-northeast-1.hygraph.com/v2/clh8qy5a38ub401umdmx5fp2r/master"
);

const QUERY = gql`
    query Post($slug: String!) {
        post(where: {slug: $slug}) {
            id
            title
            slug
            datePublished
            content {
                html
            }
            photo {
                id
                url
            }
        }
    }
`;

const SLUGLIST = gql`
    {
        posts {
            slug
        }
    }
`;


export async function getStaticPaths() {
    const { posts } = await graphcms.request(SLUGLIST);
    return {
        paths:
            //{ params: { slug: "nextjs-graphql-blog" }},
            posts.map((post) => ({params: { slug: post.slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }){
    const slug = params.slug;
    const data = await graphcms.request(QUERY, { slug });
    const post = data.post;
    return {
      props: {
        post,
      },
    };
}

export default function Home({ post }) {
  return (
    <main className={styles.blog}>
      <h2>{post.title}</h2>
      <img src={post.photo.url} alt="" className={styles.photo} />
      <div className={styles.title}>
        <h6 className={styles.date}>{post.datePublished}</h6>
      </div>
      <div 
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
      <div className={styles.backButton}>
        <Link href="/">
          <span>←もどる</span>
        </Link>
      </div>
    </main>
  ) 
    
}
