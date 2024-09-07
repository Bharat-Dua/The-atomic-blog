import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
//? Tips to optimize your context in case:- three things are true at the same time
//? 1. The state in the context needs to update all the time
//? 2. The context has many consumer
//? 3. App is slow and laggy

// const PostProvider = createContext();
const PostContext = createContext();
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 10 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePost() {
  const post = useContext(PostContext);
  if (post === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return post;
}

export { PostProvider, usePost };
