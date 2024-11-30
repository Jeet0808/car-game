import React, { useState, useEffect, useRef, useCallback } from 'react';


function Card(params) {
    
    // State for comment input
    const [comment, setComment] = useState("");
    const obstacles = params.obstacles;

    const collidedObstacleId = params.collidedObstacleId;
    const collidedObstacle = obstacles.find(
        (obstacle) => obstacle.id === collidedObstacleId
    );

    const name = params.name;
    const upperCaseName = name.toUpperCase();

    const mendata = [
        "Kanav",
        "SHAURYA",
        "Mark",
        "Jeff",
        "SHAURYA",
        "Swetabh",
    ];

    const girlsdta = [
        "Lisa",
        "Nancy",
        "Riyana",
        "Nena",
        "Ross",
        "Babita"

    ];






    const handleCommentChange = (event) => {
        setComment(event.target.value); // Update comment state
    };

    const handleCommentSubmit = () => {
        console.log("User Comment:", comment);
        setComment(""); // Clear input field after submitting
    };

    function randomnogen() {
        const randomIndex = Math.floor(Math.random() * mendata.length);

        return randomIndex;
    }
    return (
        <div className="parent-girl">
            <div className="girl-message">
                <img
                    className="gif"
                    src={`${collidedObstacle.image}`}
                    alt="girl"
                />

                <h2>{girlsdta[randomnogen()]}</h2>
                <hr />

                <p id="message">
                    Ooh {upperCaseName} darling I can't go out with you today.
                    Because I am going out with {mendata[randomnogen()]} tonight.
                </p>
                <p id="message2">
                    You try another girl.
                    ~but tomorrow we both go out ok: {upperCaseName}.
                </p>
            </div>
            <input
                id="comment"
                placeholder="Reply"
                value={comment} // Bind input value to state
                onChange={handleCommentChange} // Handle user input
            />
            <button id="btn3" onClick={handleCommentSubmit}>Send</button>
        </div>
    );
};

export default Card;
