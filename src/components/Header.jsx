import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <h1>Which Element Are You?</h1>
      <span>based on completely random things</span>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
      </nav>
    </header>
  )
};

export default Header;
