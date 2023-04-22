const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		require: true
	},
	accesstoken: {
		type: String,
		required: true
	},
	refreshtoken: {
		type: String,
		required: true
	},
	expire: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('users', UserSchema)
