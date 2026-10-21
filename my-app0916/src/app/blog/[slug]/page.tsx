import { posts } from "../posts";
import LikeButton from "../../../components/like-button";

export default async function Posts({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <h1>게시글을 찾을 수 없습니다</h1>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton likes={post.likes} />
    </article>
  );
}
