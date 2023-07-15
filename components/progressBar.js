const ProgressBar = ({ bgcolor, progress, height }) => {
  const ParentDiv = {
    height: height,
    width: "100%",
    borderRadius: 40,
  };

  const ChildDiv = {
    height: "100%",
    width: `${progress}%`,
    transition: "width 300ms ease-in-out",
    backgroundColor: bgcolor,
    borderRadius: 40,
    textAlign: "right",
  };

  return (
    <div style={ParentDiv} className="bg-gray-600">
      <div style={ChildDiv}></div>
    </div>
  );
};

export default ProgressBar;
