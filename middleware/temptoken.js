const jwt=require('jsonwebtoken');

module.exports=(req, res, next)=>{
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    //console.log("token 222 ",token);
    // console.log("process.env.TEMPORARILYTOKENKEY  ",process.env.TEMPORARILYTOKENKEY)
    if (token){
        // Verify token.
        jwt.verify(token, process.env.TEMPORARILYTOKENKEY,(err, decoded)=>{
            console.log("err ",err);
            console.log("decoded ",decoded);
            if(err){
                res.status(401).json({
                    status: false,
                    message: "Failed to authenticate token!"
                });
            }else{
                if(!decoded.mobile){
                    res.status(401).json({
                        status: false,
                        message: "Failed to authenticate token!"
                    });
                }else{
                    req.decoded_mobile=decoded.mobile;
                    next();
                }                
               
                
            }

        });
    }else{ 
        res.status(401).json({
            status: false,
            message: "Forbidden!"
        });
    }
};