import "../App.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="header-container">
      <div className="header-container-home">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/dashboard");
          }}
        ></div>
      </div>
      <div className="header-container-map">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/map");
          }}
        ></div>
      </div>
      <div className="header-container-history">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/history");
          }}
        ></div>
      </div>
    </header>
  );
}

export default Header;
