/* eslint-env jest */
const authController = require("../controllers/auth");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/user");

describe("Auth Controller - Login", () => {
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

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should return 200 status code, token and user object with email and subscription", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "test@example.com",
            password: "hashedPassword123",
            subscription: "starter",
        };

        const mockToken = "mock-jwt-token";

        // Мокаємо User.findOne
        User.findOne = jest.fn().mockResolvedValue(mockUser);

        // Мокаємо bcrypt.compare
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        // Мокаємо jwt.sign
        jwt.sign = jest.fn().mockReturnValue(mockToken);

        // Мокаємо User.findByIdAndUpdate
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            token: mockToken,
            user: {
                email: "test@example.com",
                subscription: "starter",
            },
        });
    });

    test("should return 200 status code for different subscription types", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "pro@example.com",
            password: "hashedPassword123",
            subscription: "pro",
        };

        const mockToken = "mock-jwt-token";

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue(mockToken);
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

        mockReq.body.email = "pro@example.com";

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            token: mockToken,
            user: {
                email: "pro@example.com",
                subscription: "pro",
            },
        });
    });

    test("should return user object with correct data types (String)", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "test@example.com",
            password: "hashedPassword123",
            subscription: "business",
        };

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue("mock-token");
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        const responseData = mockRes.json.mock.calls[0][0];

        expect(typeof responseData.user.email).toBe("string");
        expect(typeof responseData.user.subscription).toBe("string");
        expect(typeof responseData.token).toBe("string");
    });

    test("should return token in response", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "test@example.com",
            password: "hashedPassword123",
            subscription: "starter",
        };

        const mockToken = "mock-jwt-token";

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue(mockToken);
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        const responseData = mockRes.json.mock.calls[0][0];
        expect(responseData).toHaveProperty("token");
        expect(responseData.token).toBe(mockToken);
    });

    test("should return user object with email and subscription fields", async () => {
        // Arrange
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "test@example.com",
            password: "hashedPassword123",
            subscription: "starter",
        };

        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue("mock-token");
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

        // Act
        await authController.login(mockReq, mockRes, mockNext);

        // Assert
        const responseData = mockRes.json.mock.calls[0][0];

        expect(responseData).toHaveProperty("user");
        expect(responseData.user).toHaveProperty("email");
        expect(responseData.user).toHaveProperty("subscription");
        expect(responseData.user.email).toBe("test@example.com");
        expect(responseData.user.subscription).toBe("starter");
    });
});
