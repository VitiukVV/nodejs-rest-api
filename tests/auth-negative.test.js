/* eslint-env jest */
const authController = require("../controllers/auth");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/user");

describe("Auth Controller - Login (Negative Cases)", () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    test("should throw HttpError 401 when user not found", async () => {
        // Arrange
        User.findOne = jest.fn().mockResolvedValue(null);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledTimes(1);
        const error = mockNext.mock.calls[0][0];
        expect(error.status).toBe(401);
        expect(error.message).toBe("Email or password is wrong");
    });

    test("should throw HttpError 401 when password is wrong", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "test@example.com",
            password: "hashedPassword123",
            subscription: "starter",
        };

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledTimes(1);
        const error = mockNext.mock.calls[0][0];
        expect(error.status).toBe(401);
        expect(error.message).toBe("Email or password is wrong");
    });
});
