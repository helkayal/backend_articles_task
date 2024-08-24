const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require('./db/mongoose')

app.use(express.json());

const userRouter = require('./routers/user');
const articlaRouter = require('./routers/article');
app.use(userRouter);
app.use(articlaRouter);

app.listen(port, () => {
    console.log(`App listening Successfully at http://localhost:${port}`);
});