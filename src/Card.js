function Card(params) {
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
        "Kavyansh",
        "Swetabh",
    ];

    const girlsdta = [
        "Lisa",
        "Menu",
        "Anushka",
        "Nancy",
        "Riyana",
        "Nena",
        
    ];

    const randomIndex = Math.floor(Math.random() * mendata.length);
    const randommen = mendata[randomIndex];
    const upperCasemen = randommen.toUpperCase(); // Call toUpperCase correctly

    const girlrandome = Math.floor(Math.random() * girlsdta.length);
    const girlran = girlsdta[girlrandome]; // Use the correct random index for girlsdta

    return (
        <div className="parent-girl">
            <div className="girl-message">
                <img
                    className="gif"
                    src={`${collidedObstacle.image}`}
                    alt="girl"
                />

                <h2>{girlran}</h2>
                <hr />

                <p id="message">
                    Ooh {upperCaseName} darling I can't go out with you today.
                    Because I am going out with {upperCasemen} tonight.
                </p>
                <p id="message2">
                    You try another girl.
                    ~but tomorrow we both go out ok: {upperCaseName}.
                </p>
            </div>
        </div>
    );
};

export default Card;
