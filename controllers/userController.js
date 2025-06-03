const bcrypt = require('bcryptjs');
const { Account, User } = require('../models');

class UserController {
    static async getRegister(req, res) {
        try {
            const { error } = req.query;
            res.render('register', { error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postRegister(req, res) {
        try {
            const { email, username, password } = req.body;

            const user = User.build({
                email,
                password,
                role: 'User'
            });

            const account = Account.build({
                username,
                imageUrl: 'https://i.pinimg.com/474x/47/ba/71/47ba71f457434319819ac4a7cbd9988e.jpg'
            });

            let errors = [];

            try {
                await user.validate();
            } catch (err) {
                errors.push(...err.errors.map(e => e.message));
            }

            try {
                await account.validate();
            } catch (err) {
                errors.push(...err.errors.map(e => e.message));
            }

            if (errors.length > 0) {
                return res.redirect(`/register?error=${encodeURIComponent(errors.join(','))}`);
            }

            // Kalau validasi oke, baru simpan dengan transaction supaya konsisten
            await User.sequelize.transaction(async (t) => {
                const savedUser = await user.save({ transaction: t });
                account.UserId = savedUser.id;
                await account.save({ transaction: t });
            });

            res.redirect('/login');

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/register?error=${error}`)
            }
            res.send(error);
        }
    }
    static async getLogin(req, res) {
        try {
            const { error } = req.query;
            res.render('login', { error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postLogin(req, res) {
        try {
            const { username, password } = req.body;
            let data = await User.findOne({
                include: {
                    model: Account,
                    where: {
                        username: username
                    },
                    attributes: [
                        'username'
                    ]
                }
            })

            if (!username || !data.Account.username || !bcrypt.compareSync(password, data.password)) {
                const error = 'Username/Password is not correct!'
                return res.redirect(`/login?error=${error}`);
            }

            req.session.userId = data.id;
            req.session.role = data.role;
            return res.redirect('/home');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/login?error=${error}`)
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/login?error=${error}`)
            }

            res.send(error);
        }
    }
    static async getLogOut(req, res) {
        try {
            req.session.destroy(function (err) {
                if (err) {
                    console.error('Logout Error:', err);
                    return res.send('Failed to logout.');
                }
                res.redirect('/');
            });
        } catch (error) {
            res.send(error);
        }
    }

    static async(req, res) {
        try {

        } catch (error) {
            res.send(error);
        }
    }
    static async(req, res) {
        try {

        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = UserController