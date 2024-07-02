import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Question from "./components/Question";
import UserForm from "./components/UserForm";
import Header from "./components/Header";
import Results from "./components/Results";

const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "What's your favorite season?",
    options: ["Spring 🌸", "Summer 🌞", "Fall 🍂", "Winter ❄️"],
  },
  {
    question: "What's your favorite animal?",
    options: ["Dog 🐶", "Cat 🐱", "Bird 🐦", "Fish 🐟"],
  },
  {
    question: "What's your favorite food?",
    options: ["Pizza 🍕", "Sushi 🍣", "Salad 🥗", "Pasta 🍝"],
  },
  {
    question: "What's your favorite hobby?",
    options: ["Reading 📚", "Gaming 🎮", "Cooking 🍳", "Exercising 🏋️"],
  },
  {
    question: "What's your favorite movie genre?",
    options: ["Action 🎬", "Comedy 😂", "Drama 🎭", "Horror 😱"],
  },
  {
    question: "What's your favorite music genre?",
    options: ["Pop 🎶", "Rock 🎸", "Rap 🎤", "Country 🤠"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Spring 🌸": "Earth",
  "Summer 🌞": "Fire",
  "Fall 🍂": "Water",
  "Winter ❄️": "Air",
  "Dog 🐶": "Earth",
  "Cat 🐱": "Water",
  "Bird 🐦": "Air",
  "Fish 🐟": "Water",
  "Pizza 🍕": "Fire",
  "Sushi 🍣": "Water",
  "Salad 🥗": "Earth",
  "Pasta 🍝": "Earth",
  "Reading 📚": "Water",
  "Gaming 🎮": "Fire",
  "Cooking 🍳": "Fire",
  "Exercising 🏋️": "Earth",
  "Action 🎬": "Fire",
  "Comedy 😂": "Air",
  "Drama 🎭": "Water",
  "Horror 😱": "Earth",
  "Pop 🎶": "Air",
  "Rock 🎸": "Fire",
  "Rap 🎤": "Water",
  "Country 🤠": "Earth",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const determineElement = (answers) => {
    const counts = {};
    answers.forEach(function (answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b;
    });
  };

  const fetchArtwork = async (keyword) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`
      );
      const data = await res.json();
      if (data.objectIDs.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
        const objectID = data.objectIDs[randomIndex];
        const artworkRes = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
        );
        const artworkData = await artworkRes.json();
        if (artworkData.primaryImage === "") {
          fetchArtwork(keyword);
        } else {
          setArtwork(artworkData);
          setIsLoading(false);
        }
      } else {
        setArtwork(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setArtwork(null);
    }
  };

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex]
  );

  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
              />
            ) : (
              <Results
                element={element}
                artwork={artwork}
                isLoading={isLoading}
              />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
