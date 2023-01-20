import axios from 'axios';

import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={{
                    name: "JJ Kasper",
                    picture: "/assets/blog/authors/jj.jpeg"
                  }}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const res = await fetch(`https://633fac66d1fcddf69ca7402e.mockapi.io/blog?slug=${params.slug}`);
  const post = await res.json();

  return {
    props: {
      post: {
        ...post[0]
      },
    },
  }
}

export async function getStaticPaths() {

  const res = await fetch("https://633fac66d1fcddf69ca7402e.mockapi.io/blog");
  const allPosts = await res.json();

  return {
    paths: allPosts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
