const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            },
    }, 
    userName: {
        type: String,
        required: true,
        minlength: 6,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
    }
});

UserSchema.pre(
    'save',
    async function(next){
        try {

            const newUser = this;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
    
            this.password = hashedPassword
            next(); 
        } catch (error) {
            next(error);
        }

    }
);

UserSchema.methods.isValidPassword = async function(hashedPassword) {
    try {
        return await bcrypt.compare(hashedPassword, this.password);
    }
    catch {
        throw new Error (error);
    }
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;