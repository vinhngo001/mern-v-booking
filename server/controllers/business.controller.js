const businessModel = require("../models/business.model");

const businessController = {
    list: async (req, res) => {
        try {
            const businessList = await businessModel.find({ email: req.body.email });
            res.json({ businesses: businessList })
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    create: async (req, res) => {
        const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

        if (accessIdentity) {
            let parms = {
                title: 'QUT Booking - Create Business',
                active: {
                    business: true
                },
                user: accessIdentity.username
            };

            res.render('businesses/add', parms);
        } else {
            res.redirect('/');
        }
    },
    postCreate: async (req, res) => {
        try {
            const newBusiness = await new businessModel({ ...req.body });
            await newBusiness.save();
            res.json({ business: newBusiness });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getOne: async (req, res) => {
        try {
            const one_business = await businessModel.findById(req.params.id);
            if (!one_business) return res.status(404).json({ msg: 'No Business found' });

            res.json(one_business);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            // const {
            //     name, address, phone, desc, website, startTime, endTime, defaultHour, defaultMin, minLead, maxLead 
            // } = req.body;
            const updatedBusiness = await businessModel.findOneAndUpdate({ _id: req.params.id }, {
                ...req.body
            }, { new: true, runValidators: true });
            if (!updatedBusiness)
                return res.status(400).json({ msg: "Updated failure" });

            res.json({ msg: "Updated business successfully", business: updatedBusiness });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const deletedBusiness = await businessModel.findOneAndDelete({ _id: req.params.id });
            if (!deletedBusiness)
                return res.status(400).json({ msg: "Deleted failure" });

            res.json({ msg: "Deleted business successfully", business: deletedBusiness });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = businessController