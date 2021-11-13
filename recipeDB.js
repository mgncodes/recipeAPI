let recipeList = require('./recipeList.json');

function getRecipes() {
    return recipeList;
}

function addRecipe(recipe) {
    const recipeCnt = recipeList.length;
    recipe['recipeId'] = recipeCnt + 1;
    recipeList.push(recipe);
}

function deleteRecipe(id) {
    const recipeCnt = recipeList.length;
    recipeList = recipeList.filter(recipe => recipe.recipeId != id);
    return recipeList.length !== recipeCnt;
}

function editRecipe(id, recipe) {
    const found = recipeList.filter(rec => rec.recipeId == id);
    if (found.length === 0) return false;
    recipeList = recipeList.map(rec => {
        if (id == rec.recipeId) {
            rec = {recipeId: rec.recipeId, ...recipe};
        } return rec;
    }); return true;
}

const Recipes = function() {}

Recipes.prototype.getRecipes = getRecipes;
Recipes.prototype.addRecipe = addRecipe;
Recipes.prototype.deleteRecipe = deleteRecipe;
Recipes.prototype.editRecipe = editRecipe;

module.exports = new Recipes();