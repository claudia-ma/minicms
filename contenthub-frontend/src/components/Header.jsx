import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  let title = "Dashboard";
  let subtitle = "Manage and publish your content with clarity.";
  let buttonText = "+ New Content";
  let buttonAction = () => navigate("/create");

  if (location.pathname === "/create") {
    title = "Create Content";
    subtitle = "Write and publish a new editorial entry.";
    buttonText = "← Back";
    buttonAction = () => navigate("/");
  }

  if (location.pathname.includes("/edit/")) {
    title = "Edit Content";
    subtitle = "Refine and update your content.";
    buttonText = "← Back";
    buttonAction = () => navigate("/");
  }

  return (
    <div className="header">

      <div>
        <h1>{title}</h1>

        <p className="header-subtitle">
          {subtitle}
        </p>
      </div>

      <button
        className="primary-button"
        onClick={buttonAction}
      >
        {buttonText}
      </button>

    </div>
  );
}

export default Header;