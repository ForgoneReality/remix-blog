import { prisma } from "~/db.server";

//dunno why the tutorial has it without markdown so I made my own
export type Post = {
    slug: string;
    title: string;
  };

export type FullPost = {
  slug: string;
  title: string;
  markdown: string;
}

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: FullPost) {
  return prisma.post.create({ data: post });
}

export async function updatePost(post: FullPost, origSlug: string) {
  return prisma.post.update({ where: {slug: origSlug}, data: post });
}

export async function deletePost(origSlug: string) {
  console.log("?!??")
  return prisma.post.delete({ where: {slug: origSlug}});
}