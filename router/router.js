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
				res.status(200).json({ message: 'Success in retrieving ID', account });
			} else {
				res.status(404).json({ message: 'ID could not be found' });
			}
		});
});
//#################################################################################
//UPDATE
//#################################################################################

router.patch('/:id', (req, res) => {
	const changes = req.body;
	const { id } = req.params.id;
	db('accounts').where({ id }).update *
		changes
			.then(num => {
				if (num > 0) {
					res.status(200).json({ message: 'The account is updated', num });
				} else {
					res.status(404).json({ message: 'The account was not updated' });
				}
			})
			.catch(error => {
				res.status(500).json({ message: 'There was an error, try again!', error });
			});
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
