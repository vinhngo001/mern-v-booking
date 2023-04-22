const jwt = require('jsonwebtoken')
const graph = require("@microsoft/microsoft-graph-client");
const authHelper = require("../helpers/auth.helper");

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		req.userId = decoded.userId
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}
const auth = async (req, res, next) => {
	
}
module.exports = {
	verifyToken,
	auth
}
