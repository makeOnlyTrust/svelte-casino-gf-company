import express from "express"
import { handler } from "./build/handler.js";

const port = 9002;
const app = express();

app.use(express.static('public'));
app.use(handler);

app.listen(port, () => { 
   console.log(`server is on running on port ${port}`);
});