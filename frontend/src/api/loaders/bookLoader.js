const bookLoader = async ({ params }) => {
  try {
    const res = await fetch(`http://localhost:3000/books/${params.id}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

export default bookLoader;
