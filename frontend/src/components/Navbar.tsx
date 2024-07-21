import React from "react";

type NavbarProps = {
  logout: () => void;
};
const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  return (
    <nav className="nav">
      <h4 className="nav-head">Brainstorm</h4>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;
