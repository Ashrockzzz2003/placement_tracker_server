const paseto = require('paseto');
const { V4: { verify } } = paseto;
const fs = require('fs');
const secret_key = "E$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3424343244243o4uq0409uqujIODKQJNHDOLQJNDIUHO#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBASSFBASFHAFAHFBHABFHADBFE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3o4uq0409uqujIODKQJNHDOLQJNDIUHO#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBAE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)356536432424341#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBASSFBASFHAFAHFBHABFHADBFSSFBAE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3o4uq0409uqujIODKQJNHDOLQJNDIUHO#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBASSFBASFHAFAHFBHABFHADBFE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3o4uq0409uqujIODKQJNHDOLQJNDIUHO#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBASSFBASFHAFAHFBHABFHADBFSFHAFAHFBHABFHADE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3o4uq0409uqujIODKQJNHDOLQJNE$#^!$%!^$*!$(UHIANJKfnkjasnfkansdklandkOIJJ()#Q$)3o4uq0409uqujIODKQJNHDOLQJNDIUHO#984u32048024uhiusjJAbdsafdjsafhbBbhBFBVHFFIWJRQO9U432432843243284OIQJFKJNJBAHFB*($!)($*!(*!$#($*#!($&!HAFKAFJBAHFBAFDABHFBASSFBASFHAFAHFBHA"

async function otpTokenValidator(req, res, next) {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader && tokenHeader.split(' ')[1];

    if (tokenHeader == null || token == null) {
        res.status(401).send({
            "ERROR": "No Token. Warning."
        });
        return;
    }

    const public_key = fs.readFileSync('./RSA/public_key.pem');
    try {
        const payLoad = await verify(token, public_key);
        if (payLoad["secret_key"] == secret_key) {
            req.authorization_tier = payLoad["userRole"];

            if (payLoad["userRole"] == "0" || payLoad["userRole"] == "1") {
                req.userEmail = payLoad["userEmail"];
                req.managerName = payLoad["managerName"];
                req.managerRole = payLoad["managerRole"];
                req.managerPassword = payLoad["managerPassword"];
            } else if (payLoad["userRole"] == "2") {
                req.userEmail = payLoad["userEmail"];
                req.studentRollNo = payLoad["studentRollNo"];
                req.studentEmail = payLoad["studentEmail"];
                req.studentPassword = payLoad["studentPassword"];
                req.studentName = payLoad["studentName"];
                req.studentSection = payLoad["studentSection"];
                req.studentGender = payLoad["studentGender"];
                req.studentBatch = payLoad["studentBatch"];
                req.studentDept = payLoad["studentDept"];
                req.isHigherStudies = payLoad["isHigherStudies"];
                req.isPlaced = payLoad["isPlaced"];
                req.CGPA = payLoad["CGPA"];
            }

            next();
            return;
        } else {
            res.status(401).send({
                "ERROR": "Unauthorized access. Warning."
            });
            return;
        }
    } catch (err) {
        res.status(401).send({
            "ERROR": "Unauthorized access. Warning."
        });
        return;
    }

}

module.exports = otpTokenValidator;