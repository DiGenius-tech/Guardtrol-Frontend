import { useNavigate } from "react-router-dom";

function HistoryButton(props) {
  const history = useNavigate();
  const handleBackward = () => {
    history(-1);
  };
  const handleForward = () => {
    history(1);
  };
  return (
    <>
      {/* back-button works! */}
      <button
        onClick={props.forward ? handleForward : handleBackward}
        type={props.type}
        aria-label={props.text ? null : "back"}
        // history={props.forward}
      >
        {props.text}
      </button>
    </>
  );
}

export default HistoryButton;
