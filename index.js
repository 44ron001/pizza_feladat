import express from 'express';
import cors from 'cors';
import futarRouter from './routes/futarRouter.js';
import pizzakRouter from './routes/pizzakRouter.js';
import vevokRouter from './routes/vevokRouter.js';
import rendelesRouter from './routes/rendelesRouter.js';
import tetelRouter from './routes/tetelRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/futar", futarRouter);
app.use("/api/pizza", pizzakRouter);
app.use("/api/vevo", vevokRouter);
app.use("/api/rendeles", rendelesRouter);
app.use("/api/tetel", tetelRouter);

app.use(function (req, res) {
	res.status(404).json({ success:false, error: "Az útvonal nem található!" });
});

app.listen(3000, () => { 
	console.log("3000");
});