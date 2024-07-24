const app = require('./App')

const PORT = process.env.PORT || 3001;
// const HOST = process.env.devHOST;

app.listen(PORT, () => {
    console.log(`Connected to server`);
});

