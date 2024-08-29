import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try{
        const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");

        let i = 1;
        let ingredients = [];

        while (result.data.drinks[0][`strIngredient${i}`]) {
            let ingredient = result.data.drinks[0][`strIngredient${i}`];
            ingredients.push(ingredient);
            i++;
        }

        i = 1;
        while(result.data.drinks[0][`strMeasure${i}`]) {
            let measure = result.data.drinks[0][`strMeasure${i}`];
            ingredients[i-1] =  measure + ingredients[i-1];
            i++;
        }
        // console.log(ingredients);
        
        res.render("index.ejs", {cocktail: result.data.drinks[0].strDrink, 
            image: result.data.drinks[0].strDrinkThumb + "/preview",
            type: result.data.drinks[0].strAlcoholic,
            glassType: result.data.drinks[0].strGlass,
            recipe: ingredients,
            instruction: result.data.drinks[0].strInstructions
        });
    }
    catch(error) {
        res.sendStatus(500);
    }
});

app.get("/submit", async (req, res) => {
    res.redirect("/");
});


app.post("/submit", async (req, res) => {
    try{
        let name = req.body["drink"];
        const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);

        let i = 1;
        let ingredients = [];

        while (result.data.drinks[0][`strIngredient${i}`]) {
            let ingredient = result.data.drinks[0][`strIngredient${i}`];
            ingredients.push(ingredient);
            i++;
        }

        i = 1;
        while(result.data.drinks[0][`strMeasure${i}`]) {
            let measure = result.data.drinks[0][`strMeasure${i}`];
            ingredients[i-1] =  measure + ingredients[i-1];
            i++;
        }
        // console.log(ingredients);
        
        res.render("index.ejs", {cocktail: result.data.drinks[0].strDrink, 
            image: result.data.drinks[0].strDrinkThumb + "/preview",
            type: result.data.drinks[0].strAlcoholic,
            glassType: result.data.drinks[0].strGlass,
            recipe: ingredients,
            instruction: result.data.drinks[0].strInstructions,
        });
    }
    catch(error) {
        res.render("index.ejs", {
            errorMessage: "Sorry, drink not found. Please try another name.",
        });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
