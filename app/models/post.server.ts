import { prisma } from "~/db.server";

export type Post = {
    slug: string;
    title: string;
  };

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post) {
  return prisma.post.create({ data: post });
}

export async function updatePost(post, origSlug: string) {
  return prisma.post.update({ where: {slug: origSlug}, data: post });
}