# Instructions
1. Delete your current project folder, and everything in it.
2. Navigate to your desired folder, and create a new folder for this project (i.e. fourtify-visitor)
3. cd into the folder: `cd fourtify-visitor`
4. Clone the repo into this folder: `git clone https://github.com/Fourtify/fourtify-visitor.git .`
5. `npm install` or `sudo npm install`
6. `bower install`
7. Make a file called ".env" -- `vim .env`
8. Paste the following content:
```

EXPRESS_SECRET=FOURTIFY
NODE_ENV=development
PORT=3002
NODE_TLS_REJECT_UNAUTHORIZED=0

```
9. `npm start`

10.  Follow the instructions to start the api here: https://github.com/Fourtify/fourtify-api

11.  You can test locally by opening "domain.localhost:3001" where "domain" is an existing provider name on fourtify.us
