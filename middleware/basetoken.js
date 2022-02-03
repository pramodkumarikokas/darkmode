const jwt = require('jsonwebtoken');

const BlacklistTokenObject = require('../models/Blacklist');


module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token|| req.headers.token;
    console.log("token 111===== ",req.headers)
    if (token) {
        // Check blacklist for token.
        const promise = BlacklistTokenObject.findOne({
            token
        });
        promise.then((data) => {
            if (data) {
                res.status(401).json({
                    status: false,
                    message: "Expired token!"
                });
            }else{
                // Verify token.
                jwt.verify(token, process.env.APISECRETKEY, (err, decoded) => {

                    // console.log("token 111111111111111=== ",token);
    // console.log("process.env.TEMPORARILYTOKENKEY==  ",process.env.TEMPORARILYTOKENKEY)

      console.log("err=== ",err);
            console.log("decoded=== ",decoded);
                    if (err) {
                        res.status(401).json({
                            status: false,
                            message: "Failed to authenticate token!------1"
                        });
                    } else {
                        if (!decoded.mobile) {
                            res.status(401).json({
                                status: false,
                                message: "Failed to authenticate token!----2"
                            });
                        } else {
                            req.decoded_mobile = decoded.mobile;
                            req.token = token;
                            next();
                        }
                    }
        
                });
            }
        }).catch((err) => {

        });
        
    } else {
        res.status(401).json({
            status: false,
            message: "Forbidden! You have to get token!"
        });
    }
};