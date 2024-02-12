const { getBenOrgData } = require('../Controllers/BenOrg-controller');

const { getBenOrgId } = require('../Controllers/BenOrg-controller');

const { deleteBenOrg } = require('../Controllers/BenOrg-controller');

const { updateBenOrgData } = require('../Controllers/BenOrg-controller');

// Mocking dependencies
jest.mock('../Models/BenOrgSchema', () => ({
    find: jest.fn(), // For Get All Data 

    findOne: jest.fn(), // For Get The First User By Id

    findByIdAndUpdate: jest.fn(), // to Soft Delete For user

    findByIdAndUpdate: jest.fn() // For Update User Data
}));


describe('Check CRUD Of User', () => {

    describe('getBenOrgData function', () => {
        const mockResponse = () => {
            const res = {};
            res.status = jest.fn(() => res);
            res.json = jest.fn(() => res);
            return res;
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });
        //Jest clearAllMocks function is called before each test to reset all mock functions.
        // This ensures that the mocks dont interfere with each other between tests.

        it('should fetch BenOrg data successfully', async () => {
            const req = {};
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            const mockBenOrgData = [{ name: 'Organization 1' }, { name: 'Organization 2' }];
            BenOrgMODEL.find.mockResolvedValue(mockBenOrgData);

            // Execution
            await getBenOrgData(req, res);

            // successful data fetching case
            expect(BenOrgMODEL.find).toHaveBeenCalledWith({ isDeleted: false });
            expect(res.json).toHaveBeenCalledWith(mockBenOrgData);
        });

        it('should handle internal server error', async () => {
            const req = {};
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            BenOrgMODEL.find.mockRejectedValue(new Error('Simulated error'));

            await getBenOrgData(req, res);

            // internal server error case
            expect(BenOrgMODEL.find).toHaveBeenCalledWith({ isDeleted: false });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    describe('getBenOrgId function', () => {
        const mockResponse = () => {
            const res = {};
            res.status = jest.fn(() => res);
            res.json = jest.fn(() => res);
            res.send = jest.fn(() => res);
            return res;
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should get BenOrg by ID successfully', async () => {
            const req = { params: { id: 123 } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            const mockUserData = { _id: 123, name: 'User 1' };
            BenOrgMODEL.findOne.mockResolvedValue(mockUserData);

            await getBenOrgId(req, res);

            expect(BenOrgMODEL.findOne).toHaveBeenCalledWith({ _id: 123, isDeleted: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUserData);
        });

        it('should handle user not found', async () => {
            const req = { params: { id: 'nonexistentId' } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            BenOrgMODEL.findOne.mockResolvedValue(null);

            await getBenOrgId(req, res);

            expect(BenOrgMODEL.findOne).toHaveBeenCalledWith({ _id: 'nonexistentId', isDeleted: false });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'The User not found' });
        });

        it('should handle internal server error', async () => {
            const req = { params: { id: 'someId' } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            BenOrgMODEL.findOne.mockRejectedValue(new Error('Simulated error'));

            await getBenOrgId(req, res);

            expect(BenOrgMODEL.findOne).toHaveBeenCalledWith({ _id: 'someId', isDeleted: false });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    describe('deleteBenOrg function', () => {
        const mockResponse = () => {
            const res = {};
            res.status = jest.fn(() => res);
            res.json = jest.fn(() => res);
            res.send = jest.fn(() => res);
            return res;
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should delete BenOrg successfully', async () => {
            const req = { params: { id: 123 } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            const mockDeletedUser = { _id: 123, isDeleted: true };
            BenOrgMODEL.findByIdAndUpdate.mockResolvedValue(mockDeletedUser);

            await deleteBenOrg(req, res);

            expect(BenOrgMODEL.findByIdAndUpdate).toHaveBeenCalledWith(
                123,
                { isDeleted: true },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'The User Deleted !' });
        });

        it('should handle user not found', async () => {
            const req = { params: { id: 'nonexistentId' } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            BenOrgMODEL.findByIdAndUpdate.mockResolvedValue(null);

            await deleteBenOrg(req, res);

            expect(BenOrgMODEL.findByIdAndUpdate).toHaveBeenCalledWith(
                'nonexistentId',
                { isDeleted: true },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'The User not found' });
        });

        it('should handle internal server error', async () => {
            const req = { params: { id: 'someId' } };
            const res = mockResponse();

            const BenOrgMODEL = require('../Models/BenOrgSchema');
            BenOrgMODEL.findByIdAndUpdate.mockRejectedValue(new Error('Simulated error'));

            await deleteBenOrg(req, res);

            expect(BenOrgMODEL.findByIdAndUpdate).toHaveBeenCalledWith(
                'someId',
                { isDeleted: true },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    // describe('updateBenOrgData function', () => {
    //     const mockResponse = () => {
    //         const res = {};
    //         res.status = jest.fn(() => res);
    //         res.json = jest.fn(() => res);
    //         res.send = jest.fn(() => res);
    //         return res;
    //     };

    //     beforeEach(() => {
    //         jest.clearAllMocks();
    //     });

    //     it('should update BenOrg successfully', async () => {
    //         const req = {
    //             params: { id: 'someId' },
    //             body: {
    //                 orgName: 'UpdatedOrg',
    //                 orgId: 'updatedId',
    //                 address: 'UpdatedAddress',
    //                 email: 'updated@gmail.com',
    //                 password: 'ASwc232@#1',
    //                 confirm_password: 'ASwc232@#1',
    //                 phoneNumber: '9876543210',
    //             },
    //             file: { filename: 'someImage.jpg' },
    //         };
    //         const res = mockResponse();

    //         try {
    //             await updateBenOrgData(req, res);

    //             console.log('Received status code:', res.statusCode); 
    //             expect(res.status).toHaveBeenCalledWith(200);
    //             expect(res.json).toHaveBeenCalledWith({
    //                 message: 'The User Updated!',
    //                 user: {
    //                     _id: 'someId',
    //                     orgName: 'UpdatedOrg',
    //                     orgId: 'updatedId',
    //                     address: 'UpdatedAddress',
    //                     email: 'updated@gmail.com',
    //                     password: 'hashed_ASwc232@#1',
    //                     phoneNumber: '9876543210',
    //                     // imageName: 'someImage.jpg',
    //                 },
    //             });
    //         } catch (error) {
    //             console.error('Unexpected error:', error);
    //             throw error;
    //         }
    //     });
    // });


});

