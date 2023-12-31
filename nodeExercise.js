const url = "https://jsonplaceholder.typicode.com";

const getData = async (params) => {
  try {
    const response = await fetch(`${url}/${params}`);
    return response.json();
  } catch (e) {
    console.log(e);
  }
};

const getUserWithMax = (prop, users) =>
  users.reduce((acc, user) => (user[prop] > acc[prop] ? user : acc));

const getLotsOfData = async (params) => {
  try {
    const arrGetData = [];
    params.forEach((param) => arrGetData.push(getData(param)));
    return await Promise.all(arrGetData);
  } catch (e) {
    console.log(e);
  }
};

const getPostWithCommentById = async (id) => {
  const [post, comments] = await getLotsOfData([
    `/posts/${id}`,
    `/posts/${id}/comments`,
  ]);
  return [post, comments];
};

(async () => {
  try {
    // 2. Get data from all users from API above. You will get a list of 10 users.
    // 3. Get all the posts and comments from the API. Map the data with the users array.
    const [posts, comments, users] = await getLotsOfData([
      "posts",
      "comments",
      "users",
    ]);

    const userData = users.map((user) => {
      user.posts = posts.filter((post) => post.userId === user.id);
      user.comments = comments.filter(
        (comment) => comment.email === user.email
      );
      return user;
    });
    console.log("2, 3. ", userData);

    // 4. Filter only users with more than 3 comments.
    const usersMoreThan3Cmts = users.filter((user) => user.comments.length > 3);
    console.log("4. ", usersMoreThan3Cmts);

    // 5. Reformat the data with the count of comments and posts
    const result = users.map((user) => {
      user.commentsCount = user.comments.length;
      user.postsCount = user.posts.length;
      return user;
    });
    console.log("5. ", result);

    //6. Who is the user with the most comments/posts?
    // 6.1. The user with the most comments
    const userWithMostComments = getUserWithMax("commentsCount", users);
    console.log("6.1. ", userWithMostComments);

    // 6.2. The user with the most posts
    const userWithMostPosts = getUserWithMax("postsCount", users);
    console.log("6.2. ", userWithMostPosts);

    // 7. Sort the list of users by the postsCount value descending?
    const dataWithSort = [...users];
    dataWithSort.sort((a, b) => b.postsCount - a.postsCount);
    console.log("7. ", dataWithSort);

    // 8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
    const [post1, commentsOfPost1] = await getPostWithCommentById("1");

    const post = {
      ...post1,
      comments: commentsOfPost1,
    };
    console.log("8. ", post);
  } catch (e) {
    console.log(e);
  }
})();
