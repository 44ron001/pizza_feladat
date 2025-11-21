import express from 'express';
import pool from '../db.js';
const rendelesRouter = express.Router();

const getAllRendeles = async() => {
	const [rows] = await pool.execute('SELECT rendeles.razon, vevo.vnev AS nev, vevo.vcim AS cim, SUM(tetel.db * pizza.par) AS osszeg, rendeles.idopont AS idopont FROM vevo JOIN rendeles ON vevo.vazon = rendeles.vazon JOIN tetel ON rendeles.razon = tetel.razon JOIN pizza ON tetel.pazon = pizza.pazon GROUP BY rendeles.razon;');
	return(rows);
};

const getRendeles = async(id) => {
	const [rows] = await pool.execute('SELECT rendeles.razon, vevo.vnev AS nev, vevo.vcim AS cim, SUM(tetel.db * pizza.par) AS osszeg, rendeles.idopont AS idopont FROM vevo JOIN rendeles ON vevo.vazon = rendeles.vazon JOIN tetel ON rendeles.razon = tetel.razon JOIN pizza ON tetel.pazon = pizza.pazon WHERE rendeles.razon =' + id.toString() + ';');
	return(rows);
};

const deleteRendeles = async (razon) => {
	try {
		await pool.execute("DELETE FROM tetel WHERE razon = ?", [razon]);
		await pool.execute("DELETE FROM rendeles WHERE razon = ?", [razon]);
	} catch (err) {
		throw err;
	}
};

rendelesRouter.get('/', async (req, res) => {
	try {
		res.status(201).json({ success:true, data:(await getAllRendeles()) });
	} catch (error) {
		res.status(501).json({ success:false, error:("Hiba a rendelés lekérése során "+err.toString()) });
	}
});

rendelesRouter.get('/:id', async (req, res) => {
	try {
		const rendelesID = req.params.id;
		res.status(201).json({ success:true, data:(await getRendeles(rendelesID)) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a rendelés lekérése során "+err.toString()) });
	}
});

rendelesRouter.post('/', async (req, res) => {
    const { razon, vazon, fazon, tetel } = req.body;
    if (!vazon || !tetel || tetel.length === 0) {
        return res.status(400).json({ success:false, error:"Hiányzó adatok" });
    }
    try {
        const [rendelesRes] = await pool.execute("INSERT INTO rendeles (razon, vazon, fazon, idopont) VALUES (?, ?, ?, NOW())", [razon, vazon, fazon]);
        const razon = rendelesRes.insertId;
        for (let t of tetel) {
            await pool.execute("INSERT INTO tetel (razon, pazon, db) VALUES (?, ?, ?)", [razon, t.pazon, t.db]);
        }
		res.status(201).json({ success:true, data:("Rendelés létrehozva " + razon.toString()) });
    } catch (err) {
		res.status(501).json({ success:false, error:("Hiba a rendelés létrehozása során "+err.toString()) });
    }
});

rendelesRouter.delete('/:id', async (req, res) => {
	try {
		await deleteRendeles(req.params.id);
		res.status(201).json({ success:true, data:("Rendelés sikeresen törölve " + req.params.id.toString()) });
	} catch (err) {
		res.status(501).json({ success:false, error:("Hiba a rendelés törlése során "+err.toString()) });
	}
});

export default rendelesRouter;