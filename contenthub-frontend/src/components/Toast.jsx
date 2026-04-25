function Toast({ message }) {
    if (!message) return null;

  return (
   <div className="toast-success">
     {message}
    </div>
  );

}

export default Toast;