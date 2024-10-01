const Checkbox = () => {
  return (
    <label>
      <input type="checkbox" className="hidden" />

      <div className="flex gap-2">
        <div className="w-4 h-4 rounded bg-blue-500"> </div>
        children
      </div>
    </label>
  );
};

export default Checkbox;
