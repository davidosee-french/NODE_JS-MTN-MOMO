# PREREQUISITE
NODE VERSION - 14 or later 


# PACKAGES TO INSTALL 
- express
- axios 
- uuid 


# NPM COMMANDS 
```bash
  npm init -y 
  npm install express axios uuid 
  npm i | npm install 
  npm start
```
 


# FOLDERS TO BE CREATED 
- routes 
- controllers
- middlewares


# FILES TO BE CREATED 
- server.js
- .env 
- routes > app-routes.js
- controllers > app-controllers.js
- middlewares > ErrorHandler.js, NotFound.js


# CONFIGS
- package.json > Ajouter "type": "module" dans le json 
- package.json > Ajouter le script ci-dessous dans le script object
"start": "node --watch --env-file=.env server"

nodemon
dotenv