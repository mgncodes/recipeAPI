const http = require('http');
const url = require('url');
const qs = require('querystring');

const Recipes = require('./recipeDB');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;

const server = http.createServer((request, response) => {
    if(request.method === 'GET') {
        return handleGet(request, response);
    } else if(request.method === 'POST') {
        return handlePost(request, response);
    } else if(request.method === 'PUT') {
        return handlePut(request, response);
    } else if(request.method === 'DELETE') {
        return handleDelete(request, response);
    }
});
function handleGet(request, response) {
    const { pathname } = url.parse(request.url)
    if (pathname !== '/recipes') {
        return handleError(response, 404)
    } response.setHeader('Content-Type', 'application/json;charset=utf-8');
    return response.end(JSON.stringify(Recipes.getRecipes()));
}
function handlePost(request, response) {
    const size = parseInt(request.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;
    const { pathname } = url.parse(request.url);
    if (pathname !== '/add-recipe') {
        return handleError(res, 404);
    } 
    request 
    .on('data', (chunk) => { 
        const offset = pos + chunk.length ;
        if (offset > size) { 
            reject(413, 'Too Large', response) ;
            return ;
        } chunk.copy(buffer, pos) ;
        pos = offset ;
    }) 
    .on('end', () => { 
        if (pos !== size) { 
            reject(400, 'Bad Request', response) ;
            return ;
        } const data = JSON.parse(buffer.toString());
        Recipes.addRecipe(data);
        console.log('New Recipe : ', data) ;
        response.setHeader('Content-Type', 'application/json;charset=utf-8');
        response.end('New Recipe : ' + JSON.stringify(data))
    });
}
function handlePut(request, response) {
    const { pathname, query } = url.parse(request.url);
    if (pathname !== '/edit-recipe') {
        return handleError(response, 404);
    } const { recipeId } = qs.parse(query);
    const size = parseInt(request.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;
    request 
    .on('data', (chunk) => { 
        const offset = pos + chunk.length; 
        if (offset > size) { 
            reject(413, 'Too Large', response) ;
            return ;
        } chunk.copy(buffer, pos) ;
        pos = offset ;
    }) 
    .on('end', () => { 
        if (pos !== size) { 
            reject(400, 'Bad request', response) ;
            return ;
        } const data = JSON.parse(buffer.toString());
        const recipeUpdated = Recipes.editRecipe(recipeId, data);
        response.setHeader('Content-Type', 'application/json;charset=utf-8');
        response.end(`{"Recipe Updated": ${recipeUpdated}}`);
    });
}
function handleDelete(request, response) {
    const { pathname, query } = url.parse(request.url);
    if (pathname !== '/delete-recipe') {
        return handleError(response, 404);
    } const { recipeId } = qs.parse(query);
    const recipeDeleted = Recipes.deleteRecipe(recipeId);
    response.setHeader('Content-Type', 'application/json;charset=utf-8');
    response.end(`{"Recipe Deleted": ${recipeDeleted}}`);
}
function handleError (response, code) { 
    response.statusCode = code;
    response.end(`{"error": "${http.STATUS_CODES[code]}"}`) ;
}
server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});