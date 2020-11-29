const db = require('../firebase.config');


module.exports = async function(req,res,next) {
    try {
        const {authorization} = req.headers;
        if (!authorization)
            throw 'TokenRequired';

        // Getting bearer token
        const bearer = authorization.split(' ')[1];

        // Getting user
        const user = await db.collection('users').where('token', '==', bearer).limit(1).get();
        if (user.empty)
            throw 'UserNotFound';

        req.user = user.docs[0].data();
        next();

    } catch (e) {
        console.error(e);
        res.send(401).send({message: e});
    }
}
