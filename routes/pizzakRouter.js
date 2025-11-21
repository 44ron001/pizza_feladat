import express from 'express';
import pool from '../db.js';
const pizzakRouter = express.Router();

const getAllPizza = async() => {
	const [rows] = await pool.execute('SELECT * FROM pizza;');
	return(rows);
}

const getPizza = async(id) => {
	const [rows] = await pool.execute('SELECT * FROM pizza WHERE pizza.pazon = ' + id.toString() + ';');
	return(rows);
}

const newPizza = async(pazon, pnev, par) => {
	await pool.execute(`INSERT INTO pizza (pazon, pnev, par) VALUES (${pazon.toString()}, "${pnev.toString()}", "${par.toString()}");`);
}

const editPizza = async(pazon, pnev, par) => {
	await pool.execute(`UPDATE pizza SET pizza.pnev = "${pnev.toString()}", pizza.par= "${par.toString()}" WHERE pizza.pazon = ${pazon.toString()};`);
}

const deletePizza = async(pazon) => {
	await pool.execute("DELETE FROM tetel WHERE pazon = ?", [pazon]);
	await pool.execute("DELETE FROM pizza WHERE pazon = ?", [pazon]);
}

pizzakRouter.get('/', async (req, res) => {
	try {
		res.status(201).json({ success:true, data:(await getAllPizza()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a pizzák lekérdezése során "+err.toString()) });
	}
});

pizzakRouter.get('/:id', async (req, res) => {
	try {
		const pizzaID = req.params.id;
		res.status(201).json({ success:true, data:(await getPizza(pizzaID)) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a pizzák lekérdezése során "+err.toString()) });
	}
});

pizzakRouter.post('/', async (req, res) => {
	try {
		if (req.body.pnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		if (req.body.par < 100) {
			throw "Az ár nem lehet 100 Ft-nál kevesebb!";
		}
		await newPizza(req.body.pazon, req.body.pnev, req.body.par);
		res.status(201).json({ success:true, data:("Adatok sikeresen feltöltve: " + req.body.pnev.toString()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a pizza létrehozása során "+err.toString()) });
	}
});

pizzakRouter.put('/:id', async (req, res) => {
	try {
		if (req.body.pnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		if (req.body.par < 100) {
			throw "Az ár nem lehet 100 Ft-nál kevesebb!";
		}
		await editPizza(req.params.id, req.body.pnev, req.body.par);
		res.status(201).json({ success:true, data:("Adat sikeresen átírva: " + req.params.id.toString()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a pizza szerkesztése során "+err.toString()) });
	}
});

pizzakRouter.delete('/:id', async (req, res) => {
	try {
		await deletePizza(req.params.id);
		res.status(201).json({ success:true, data:("A pizza törlése sikeres: " + req.params.id.toString()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a pizza törlése során "+err.toString()) });
	}
});

export default pizzakRouter;