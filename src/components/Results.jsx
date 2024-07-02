import { useContext } from "react";
import { UserContext } from "./UserContext";

const Results = ({ element, artwork, isLoading }) => {
  const { name } = useContext(UserContext);

  return (
    <div>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <h2>{artwork.title}</h2>
          <img src={artwork.primaryImage} alt={artwork.title} />
          <p>{artwork.artistDisplayName}</p>
          <p>{artwork.objectDate}</p>
        </div>
      ) : isLoading ? (
        <p>Image Loading...</p>
      ) : (
        <p>No artwork found.</p>
      )}
    </div>
  );
};

export default Results;
