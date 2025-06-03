const bcrypt = require('bcryptjs');
const {Account, User} = require('../models');

class Controller {
    static async landing(req,res){
        try {
            res.render('landing');
        } catch (error) {
            res.send(error);
        }
    }
    static async home(req,res){
        try {
            let data = await Account.findAll();
            res.render('home', {data});
        } catch (error) {
            res.send(error);
        }
    }
    static async (req,res){
        try {
            
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = Controller;