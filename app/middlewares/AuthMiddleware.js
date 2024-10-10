import { TokenDecode } from "../utility/tokenUtility.js";

export default (req, res, next) => {
    // Extract the token from the headers
    let token = req.headers['token'];
    
    // Check if the token exists
    if (!token) {
        return res.status(401).json({ status: "fail", message: "Token is missing" });
    }

    // Decode the token
    let decoded = TokenDecode(token);

    // Check if the token decoding failed
    if (decoded === null) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    // If successful, set email and user_id in headers
    let email = decoded.email;
    let user_id = decoded.user_id;

    req.headers.email = email;
    req.headers.user_id = user_id;

    // Pass the request to the next middleware or route handler
    next();
};
