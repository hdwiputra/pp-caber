const bcrypt = require('bcryptjs');
const { Account, User } = require('../models');

class UserController {
    static async getRegister(req, res) {
        try {
            let { error } = req.query;
            res.render('register', { error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postRegister(req, res) {
        try {
            let { email, username, password } = req.body;

            let user = User.build({
                email,
                password,
                role: 'User'
            });

            let account = Account.build({
                username,
                imageUrl: 'placeholder.jpg'
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
                return res.redirect(`/register?error=${(errors.join(','))}`);
            }

            // Kalau validasi oke, baru simpan dengan transaction supaya konsisten
            await User.sequelize.transaction(async (t) => {
                let savedUser = await user.save({ transaction: t });
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
            let { error } = req.query;
            res.render('login', { error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postLogin(req, res) {
        try {
            let { username, password } = req.body;

            if (!username || !password) {
                let error = 'Username and Password are required!';
                return res.redirect(`/login?error=${error}`);
            }

            let data = await User.findOne({
                include: {
                    model: Account,
                    where: { username },
                    attributes: ['username']
                },
                attributes: ['id', 'password', 'role']
            });

            if (!data || !data.Account) {
                let error = 'Username/Password is not correct!';
                return res.redirect(`/login?error=${error}`);
            }

            let checkPassword = bcrypt.compareSync(password, data.password);
            if (!checkPassword) {
                let error = 'Username/Password is not correct!';
                return res.redirect(`/login?error=${(error)}`);
            }

            // Sukses login, simpan session
            req.session.userId = data.id;
            req.session.role = data.role;

            return res.redirect('/home');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/login?error=${error}`)
            }

            if (error.name === 'SequelizeUniqueletraintError') {
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

    static async getEditMember(req, res) {
        try {
            let { id } = req.params;
            let { error } = req.query;
            let data = await Account.findOne({
                where: {
                    id: id
                }
            })
            res.render('editMember', { data, error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postEditMember(req, res) {
        try {
            let { username } = req.body;
            let file = req.file;

            await Account.update(
                {
                    username,
                    imageUrl: file ? file.filename : undefined
                },
                {
                    where: { id: req.params.id }
                }
            );

            res.redirect('/home');
        } catch (error) {
            let { id } = req.params;
            if (error.name === 'SequelizeValidationError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/member/edit/${id}?error=${error}`);
            }
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