const Button = ({ children, onClick }) => {
    return (
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  export default Button;
  