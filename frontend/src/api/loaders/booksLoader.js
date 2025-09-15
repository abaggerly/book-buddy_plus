const booksLoader = async () => {
  try {
    const res = await fetch(`http://localhost:3000/books`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

export default booksLoader;
