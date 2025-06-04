const bcrypt = require('bcryptjs');
const { Account, User, Upload, UploadsTag, Tag } = require('../models');
const { QueryInterface } = require('sequelize');
const dateFormat = require('../helpers/helper');

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
            let member = await Account.findAll();
            let uploads = await Upload.findAll({
                include: {
                    model: Account,
                    attributes: [
                        'username'
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
            res.render('home', { member, uploads, dateFormat });
        } catch (error) {
            res.send(error);
        }
    }
    static async getAddUpload(req, res) {
        try {
            let data = await Tag.findAll();
            res.render('addUpload', { data });
        } catch (error) {
            res.send(error);
        }
    }
    static async postAddUpload(req, res) {
        try {
            const { title, content, imageUrl, tags } = req.body

            await Upload.create({
                title,
                content,
                imageUrl,
                AccountId: req.session.userId
            })

            let uploadsTagsData = []
            tags.forEach(el => {
                uploadsTagsData.push({ UploadId: req.session.userId, TagId: el })
            });

            await UploadsTag.bulkCreate(uploadsTagsData)

            res.redirect('/home');
        } catch (error) {
            res.send(error);
        }
    }
    static async uploadId(req, res) {
        try {
            const { id } = req.params
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
            const { id } = req.params;
            let data = await Tag.findAll();
            let upload = await Upload.findOne({
                where: { id: id },
                include: {
                    model: Tag
                }
            });
            res.render('editUpload', { data, upload });
        } catch (error) {
            res.send(error);
        }
    }
    static async postEditUpload(req, res) {
        try {
            const { id } = req.params;
            const { title, content, imageUrl, tags } = req.body;

            await Upload.update(
                { title, content, imageUrl },
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
            res.send(error);
        }
    }
    static async getDeleteUpload(req, res) {
        try {
            const { id } = req.params;

            await UploadsTag.destroy({
                where: {
                    UploadId: id
                }
            });

            await Upload.destroy({
                where: {
                    id : id
                }
            });

            res.redirect('/home');

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