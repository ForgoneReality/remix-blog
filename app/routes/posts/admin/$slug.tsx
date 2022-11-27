// import { marked } from "marked";
// import type { LoaderFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";

// import type { Post } from "~/models/post.server";
// import { getPost } from "~/models/post.server";

// type LoaderData = { post: Post; html: string };

// export const loader: LoaderFunction = async ({
//   params,
// }) => {
//   invariant(params.slug, `params.slug is required`);

//   const post = await getPost(params.slug);
//   invariant(post, `Post not found: ${params.slug}`);

//   const html = marked(post.markdown);
//   return json<LoaderData>({ post, html });
// };

// export default function PostSlug() {
//   const { post, html } = useLoaderData() as LoaderData;
//   return (
//     <main className="mx-auto max-w-4xl">
//       <h1 className="my-6 border-b-2 text-center text-3xl">
//         {post.title}
//       </h1>
//       <div dangerouslySetInnerHTML={{ __html: html }} />
//     </main>
//   );
// }

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useParams } from "@remix-run/react";
import { marked } from "marked";


import invariant from "tiny-invariant";
import { updatePost, getPost, Post, deletePost} from "~/models/post.server";


type LoaderData = { post: Post; html: string };

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({
  request, params
}) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(
    typeof title === "string",
    "title must be a string"
  );
  invariant(
    typeof slug === "string",
    "slug must be a string"
  );
  invariant(
    typeof markdown === "string",
    "markdown must be a string"
  );

  const origSlug = params.slug;

  invariant(
    typeof origSlug === "string",
    "Should never see this"
  );

  await updatePost({ title, slug, markdown }, origSlug);
  console.log("?!")
  return redirect("/posts/admin");
};

async function handleDelete(slug: string){
  console.log("1");
  await deletePost(slug);
  console.log("2");

  redirect("/posts/admin");
  console.log("3");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function EditPost() {
  const {post, html} = useLoaderData();
  const errors = useActionData();
  const params = useParams();
  console.log(params);
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" defaultValue={post.title} className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" defaultValue={post.slug} className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={html}
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="flex justify-end gap-x-1">
        <button onClick={(e) => {
          e.preventDefault();
          console.log("???")
          if(params.slug !== undefined)
          {
            handleDelete(params.slug);
          }
        }} className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300">
          Delete Post
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Update Post
        </button>
      </p>
    </Form>
  );
}