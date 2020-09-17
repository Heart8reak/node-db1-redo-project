const express = require('express');

const db = require('../data/dbconfig');

const router = express.Router();

//#################################################################################
//CREATE
//#################################################################################

router.post('/', (req, res) => {
	const accountData = req.body;
	db('accounts')
		.insert(accountData, 'id')
		.then(newId => {
			const id = newId[0];
			db('accounts')
				.where({ id })
				.first()
				.then(newAccount => {
					res.status(201).json({ message: 'Success in creating a new account', newAccount });
				})
				.catch(error => {
					res.status(500).json({ message: 'Error in creating a new account', error });
				});
		});
});

//#################################################################################
//READ
//#################################################################################

router.get('/', (req, res) => {
	db
		.select('*')
		.from('accounts')
		.then(accounts => {
			res.status(200).json({ message: 'success', accounts });
		})
		.catch(error => {
			res.status(500).json({ message: 'Error retrieving Accounts', error });
		});
});

router.get('/:id', (req, res) => {
	db('accounts')
		.where('id', req.params.id)
		.first()
		.then(account => {
			if (account) {
				res.status(200).json({ message: 'Success in retrieving Account', account });
			} else {
				res.status(404).json({ message: 'ID could not be found' });
			}
		});
});
//#################################################################################
//UPDATE
//#################################################################################

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	try {
		const count = await db('accounts')
			.update(changes)
			.where({ id });
		if (count) {
			res.json({ message: 'the account was successfully updated', count });
		} else {
			res.status(404).json({ message: 'The account was not updated' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'There was an error updating your account', err });
	}
});

//#################################################################################
//DELETE
//#################################################################################

router.delete('/:id', (req, res) => {
	db('accounts')
		.where('id', req.params.id)
		.del()
		.then(deleted => {
			if (deleted) {
				res.status(200).json({ message: 'Successfuly deleted the account' });
			} else {
				res.status(404).json({ message: 'The account was not deleted' });
			}
		})
		.catch(error => {
			res.status(500).json({ message: 'There was an error deleting your account' }, error);
		});
});

module.exports = router;
