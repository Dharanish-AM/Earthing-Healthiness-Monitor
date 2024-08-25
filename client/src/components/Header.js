import "../App.css";
import accIcon from "../assets/icons8-male-user-50.png";
import { Link } from "react-router-dom";

function Header({ onProfileClick }) {
    return (
        <header className="header">
            <p className="header-title">SIH</p>
            <nav>
                <ul className="nav-list">
                    <Link to="/"><li>Home</li></Link>
                    <Link to="/map"><li>Map</li></Link>
                    <Link to="/history"><li>History</li></Link>
                </ul>
            </nav>
            <img
                src={accIcon}
                onClick={onProfileClick}
                className="acc-icon"
                alt="account"
            />
        </header>
    );
}

export default Header;
