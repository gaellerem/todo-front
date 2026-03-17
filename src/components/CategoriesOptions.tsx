function CategoryOptions({ categories }) {
  return (
    <>
      {categories.map((c, i) => (
        <option key={i} value={c}>
          {c}
        </option>
      ))}
    </>
  );
}

export default CategoryOptions;
