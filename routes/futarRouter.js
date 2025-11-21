import express from 'express';
import pool from '../db.js';
const futarRouter = express.Router();

const getAllFutar = async() => {
	const [rows] = await pool.execute('SELECT * FROM futar;');
	return(rows);
}

const getFutar = async(id) => {
	const [rows] = await pool.execute('SELECT * FROM futar WHERE futar.fazon = ' + id.toString() + ';');
	return(rows);
}

const newFutar = async(fazon, fnev, ftel) => {
	await pool.execute(`INSERT INTO futar (fazon, fnev, ftel) VALUES (${fazon.toString()}, "${fnev.toString()}", "${ftel.toString()}");`);
}

const editFutar = async(fazon, fnev, ftel) => {
	await pool.execute(`UPDATE futar SET futar.fnev = "${fnev.toString()}", futar.ftel= "${ftel.toString()}" WHERE futar.fazon = ${fazon.toString()};`);
}

const deleteFutar = async(fazon) => {
	await pool.execute('DELETE FROM futar WHERE futar.fazon = ' + fazon.toString() + ";");
}

futarRouter.get('/', async (req, res) => {
	try {
		res.status(201).json({ success:true, data:(await getAllFutar()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a futár lekérdezése során "+err.toString()) });
	}
});

futarRouter.get('/:id', async (req, res) => {
	try {
		const futarID = req.params.id;
		res.status(201).json({ success:true, data:(await getFutar(futarID)) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a futár lekérdezése során "+err.toString()) });
	}
});

futarRouter.post('/', async (req, res) => {
	try {
		if (req.body.fnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		await newFutar(req.body.fazon, req.body.fnev, req.body.ftel);
		res.status(201).json({ success:true, data:("Adatok sikeresen feltöltve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a futár létrehozása során "+err.toString()) });
	}
});

futarRouter.put('/:id', async (req, res) => {
	try {
		if (req.body.fnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		await editFutar(req.params.id, req.body.fnev, req.body.ftel);
		res.status(201).json({ success:true, data:("Adat sikeresen átírva!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a futár szerkesztése során "+err.toString()) });
	}
});

futarRouter.delete('/:id', async (req, res) => {
	try {
		await deleteFutar(req.params.id);
		res.status(201).json({ success:true, data:("Adat sikeresen törölve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a futár törlése során "+err.toString()) });
	}
});

export default futarRouter;