import express from 'express';
import pool from '../db.js';
const tetelRouter = express.Router();

const getTetel = async(id) => {
	const [rows] = await pool.execute('SELECT pizza.pnev, pizza.par, tetel.db, rendeles.idopont FROM pizza JOIN tetel ON pizza.pazon = tetel.pazon JOIN rendeles ON rendeles.razon = tetel.razon WHERE tetel.razon = ' + id.toString() + ';');
	return(rows);
}

const newTetel = async(razon, pazon, db) => {
	await pool.execute(`INSERT INTO tetel (razon, pazon, db) VALUES (${razon.toString()}, ${pazon.toString()}, ${db.toString()});`);
}

const editTetel = async(razon, pazon, db) => {
	await pool.execute(`UPDATE tetel SET tetel.db = ${db.toString()} WHERE tetel.razon = ${razon.toString()} AND tetel.pazon = ${pazon.toString()};`);
}

const deleteTetel = async(razon, pazon) => {
	await pool.execute(`DELETE FROM tetel WHERE tetel.razon = ${razon.toString()} AND tetel.pazon = ${pazon.toString()};`);
}

tetelRouter.get('/:id', async (req, res) => {
	try {
		const tetelID = req.params.id;
		res.status(201).json({ success:true, data:(await getTetel(tetelID)) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a tétel lekérése során "+err.toString()) });
	}
});

tetelRouter.post('/', async (req, res) => {
	try {
		if (req.body.db < 1 || req.body.db > 20) {
			throw "Rendelési tétel minimum 1 db, maximum 20 db lehet";
		}
		await newTetel(req.body.razon, req.body.pazon, req.body.db);
		res.status(201).json({ success:true, data:("Adatok sikeresen feltöltve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a tétel létrehozása során "+err.toString()) });
	}
});

tetelRouter.put('/:razon/:pazon', async (req, res) => {
	try {
		if (req.body.db < 1 || req.body.db > 20) {
			throw "Rendelési tétel minimum 1 db, maximum 20 db lehet";
		}
		await editTetel(req.params.razon, req.params.pazon, req.body.db);
		res.status(201).json({ success:true, data:("Adat sikeresen átírva!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a tétel szerkesztése során "+err.toString()) });
	}
});

tetelRouter.delete('/:razon/:pazon', async (req, res) => {
	try {
		await deleteTetel(req.params.razon, req.params.pazon);
		res.status(201).json({ success:true, data:("Adat sikeresen törölve!") });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a tétel törlése során "+err.toString()) });
	}
});

export default tetelRouter;