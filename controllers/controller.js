const bcrypt = require('bcryptjs');
const { Account, User, Upload, UploadsTag, Tag } = require('../models');
const { QueryInterface } = require('sequelize');
const dateFormat = require('../helpers/helper');
const { Op } = require('sequelize');

class Controller {
    static async landing(req, res) {
        try {
            res.render('landing');
        } catch (error) {
            res.send(error);
        }
    }
    static async home(req, res) {
        try {
            let { tittle, search } = req.query;
            let member = await Account.findAll({
                include: [{
                    model: User,
                    where: {
                        role: {
                            [Op.ne]: 'Admin'
                        }
                    }
                }]
            });
            let admins = await User.findAdmins();

            let query = {
                include: [{
                    model: Account,
                    attributes: ['username'],
                },
                {
                    model: Tag,
                }
                ],
                order: [['createdAt', 'DESC']],
            };

            if (search) {
                query.where = {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                };
            }

            let uploads = await Upload.findAll(query);

            res.render('home', { member, uploads, admins, tittle, dateFormat });
        } catch (error) {
            res.send(error);
        }
    }
    static async getAddUpload(req, res) {
        try {
            let { error } = req.query;
            let data = await Tag.findAll();
            res.render('addUpload', { data, error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postAddUpload(req, res) {
        try {
            let { title, content, tags } = req.body
            let file = req.file;

            if (!tags) {
                tags = [1]
            } else if (!isNaN(tags)) {
                tags = [tags];
            }

            let data = await Upload.create({
                title,
                content,
                imageUrl: file ? file.filename : undefined,
                AccountId: req.session.userId
            })

            let uploadsTagsData = []
            tags.forEach(el => {
                uploadsTagsData.push({ UploadId: data.id, TagId: el })
            });
            
            await UploadsTag.bulkCreate(uploadsTagsData)

            res.redirect('/home');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/uploads/add?error=${error}`);
            }
            res.send(error);
        }
    }
    static async uploadId(req, res) {
        try {
            let { id } = req.params
            let data = await Upload.findOne({
                where: { id: id },
                include: {
                    model: Tag
                }
            });
            res.render('uploadId', { data, dateFormat });
        } catch (error) {
            res.send(error);
        }
    }
    static async getEditUpload(req, res) {
        try {
            let { id } = req.params;
            let { error } = req.query
            let data = await Tag.findAll();
            let upload = await Upload.findOne({
                where: { id: id },
                include: {
                    model: Tag
                }
            });
            res.render('editUpload', { data, upload, error });
        } catch (error) {
            res.send(error);
        }
    }
    static async postEditUpload(req, res) {
        try {
            let { id } = req.params;
            let { title, content, tags } = req.body;
            let file = req.file;

            if (!tags) {
                tags = [1]
            } else if (!isNaN(tags)) {
                tags = [tags];
            }

            await Upload.update(
                {
                    title,
                    content,
                    imageUrl: file ? file.filename : undefined
                },
                { where: { id } }
            );

            await UploadsTag.destroy({ where: { UploadId: id } });

            let uploadsTagsData = []
            tags.forEach(el => {
                uploadsTagsData.push({ UploadId: id, TagId: el })
            });

            await UploadsTag.bulkCreate(uploadsTagsData)

            res.redirect(`/uploads/${id}`);
        } catch (error) {
            let { id } = req.params;
            if (error.name === 'SequelizeValidationError') {
                error = error.errors.map(el => el.message);
                res.redirect(`/uploads/${id}/edit/?error=${error}`);
            }
            res.send(error);
        }
    }
    static async getDeleteUpload(req, res) {
        try {
            let { id } = req.params;

            let data = await Upload.findOne({
                where: {
                    id: id
                }
            })

            await UploadsTag.destroy({
                where: {
                    UploadId: id
                }
            });

            await Upload.destroy({
                where: {
                    id: id
                }
            });

            res.redirect(`/home?tittle=${data.title}`);

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

module.exports = Controller;