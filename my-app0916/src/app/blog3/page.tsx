import Link from "next/link";
import { posts } from "../blog/posts";

export default function Blog3() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center px-16 py-32 bg-white">
        <div>
          <h1>블로그 목록</h1>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog2/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
