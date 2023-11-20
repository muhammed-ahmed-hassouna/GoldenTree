const Donors = require("../Models/FinancialDonation");
const multer = require("multer")


// Storage Image By Multer Start
let lastFileSequence = 0;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'UserImage');
    },
    filename: (req, file, cb) => {
        lastFileSequence++;
        const newFileName = `${Date.now()}_${lastFileSequence}${path.extname(file.originalname)}`;
        cb(null, newFileName);
    },
});


// const getAllDonors = async (req, res) => {
//     try {
//         const donors = await Donors.find({ isCompleted: false });
//         return res.json(donors);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
// const getAllDonors = async (req, res) => {
//     try {
//         const donors = await Donors.find({ isCompleted: false });
//         res.render('home', { donors }); // Assuming 'home' is the correct EJS file name
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

const getDonorById = async (req, res) => {
    const { id } = req.params;
    try {
        const donor = await Donors.findById({ _id: id, isCompleted: false });
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        return res.json(donor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createDonor = async (req, res) => {
    const { title, details, DonationAmount, Date, image, maxDonationAmount, expirationTime } = req.body;
    try {
        const newDonor = new Donors({
            title,
            details,
            DonationAmount,
            Date,
            image,
            maxDonationAmount,
            expirationTime,
        });

        if (req.file) {
            // If a file is uploaded, set imageName to the filename
            image = req.file.filename;
        }
        await newDonor.save();
        return res.status(201).json({ newDonor, image });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateDonor = async (req, res) => {
    const donorId = req.params.id;
    const updatedDonorData = req.body;
    try {
        const updatedDonor = await Donors.findByIdAndUpdate(donorId, updatedDonorData, { new: true });
        if (!updatedDonor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        return res.json(updatedDonor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteDonor = async (req, res) => {
    const donorId = req.params.id;
    try {
        const deletedDonor = await Donors.findByIdAndDelete(donorId);
        if (!deletedDonor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        return res.json({ message: "Donor deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const donate = async (req, res) => {
    const { id } = req.params;
    try {
        const donation = await Donors.findById({ _id: id });

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }
        const donationToAdd = req.body.donationAmount;

        if (donation.currentDonationAmount + donationToAdd <= donation.maxDonationAmount) {
            donation.currentDonationAmount += donationToAdd;

            if (donation.currentDonationAmount === donation.maxDonationAmount) {
                donation.expirationTime = new Date(Date.now() + 15 * 1000);
                donation.InWork = true;
            }
            await donation.save();
            setTimeout(async () => {
                if (donation.expirationTime && donation.expirationTime <= new Date()) {
                    console.log("Done !");
                    donation.isCompleted = true;
                    await donation.save();
                }
            }, 15000);

            return res.json({ message: "Donation successful" });
        } else {
            return res.status(400).json({ message: "Maximum donation amount reached" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    donate,
    // getAllDonors,
    getDonorById,
    createDonor,
    updateDonor,
    deleteDonor
};
