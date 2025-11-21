import express from 'express';
import pool from '../db.js';
const vevokRouter = express.Router();

const getAllVevo = async() => {
	const [rows] = await pool.execute('SELECT * FROM vevo;');
	return(rows);
}

const getVevo = async(id) => {
	const [rows] = await pool.execute('SELECT * FROM vevo WHERE vevo.vazon = ' + id.toString() + ';');
	return(rows);
}

const newVevo = async(vazon, vnev, vcim) => {
	await pool.execute(`INSERT INTO vevo (vazon, vnev, vcim) VALUES (${vazon.toString()}, "${vnev.toString()}", "${vcim.toString()}");`);
}

const editVevo = async(vazon, vnev, vcim) => {
	await pool.execute(`UPDATE vevo SET vevo.vnev = "${vnev.toString()}", vevo.vcim= "${vcim.toString()}" WHERE vevo.vazon = ${vazon.toString()};`);
}

const deleteVevo = async(vazon) => {
	await pool.execute('DELETE FROM vevo WHERE vevo.vazon = ' + vazon.toString() + ";");
}

vevokRouter.get('/', async (req, res) => {
	try {
		res.status(201).json({ success:true, data:(await getAllVevo()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a vevők lekérdezése során "+err.toString()) });
	}
});

vevokRouter.get('/:id', async (req, res) => {
	try {
		const vevoID = req.params.id;
		res.status(201).json({ success:true, data:(await getVevo(vevoID)) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a vevők lekérdezése során "+err.toString()) });
	}
});

vevokRouter.post('/', async (req, res) => {
	try {
		if (req.body.vnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		await newVevo(req.body.vazon, req.body.vnev, req.body.vcim);
		res.status(201).json({ success:true, data:("Adatok sikeresen feltöltve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a vevő létrehozása során "+err.toString()) });
	}
});

vevokRouter.put('/:id', async (req, res) => {
	try {
		if (req.body.vnev.length < 3) {
			throw "A megnevezések nem lehetnek 3 karakternél rövidebbek!";
		}
		await editVevo(req.params.id, req.body.vnev, req.body.vcim);
		res.status(201).json({ success:true, data:("Adat sikeresen átírva!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a vevő szerkesztése során "+err.toString()) });
	}
});

vevokRouter.delete('/:id', async (req, res) => {
	try {
		await deleteVevo(req.params.id);
		res.status(201).json({ success:true, data:("Adat sikeresen törölve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a vevő törlése során "+err.toString()) });
	}
});

export default vevokRouter;