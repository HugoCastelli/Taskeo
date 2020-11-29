const db = require('../../firebase.config');
const token = require('rand-token');


/**
 * @api {post} /authentification/register Register
 * @apiName Register
 * @apiGroup Authentification
 * @apiDescription Register a new user in the app.
 * @apiVersion 0.0.1
 *
 * @apiParam {String} email New user email.
 * @apiParam {String} password New user password.
 * @apiParam {String} firstName New user first name.
 * @apiParam {String} lastName New user last name.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "john.doe@gmail.com",
 *       "password": "1234567",
 *       "firstName": "John",
 *       "lastName": "Doe"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstName": "John",
 *       "lastName": "Doe"
 *       "email": "john.doe@gmail.com"
 *       "userId": "XXXXX"
 *       "token": "XXXXXXXXXXXXXXXXXXXX"
 *     }
 */
module.exports.register = async function (req, res, next) {
    try {
        const {email, password, firstName, lastName} = req.body;

        if (!email || !password || !firstName || !lastName)
            throw 'MissingParameters';

        const userId = token.uid(5);

        const newUser = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            userId: userId,
            token: token.uid(20)
        }

        const findUser = await db.collection('users').where('email', '==', email).get();
        if (!findUser.empty)
            throw 'UserAlreadyExist';

        await db.collection('users').doc(userId).set(newUser);

        // deleting password to send newUser data to front
        delete newUser.password;


        res.status(200).send(newUser);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {post} /authentification/login Login
 * @apiName Login
 * @apiGroup Authentification
 * @apiDescription Login a user in the app.
 * @apiVersion 0.0.1
 *
 * @apiParam {String} email User email.
 * @apiParam {String} password User password.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "john.doe@gmail.com",
 *       "password": "1234567",
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstName": "John",
 *       "lastName": "Doe"
 *       "email": "john.doe@gmail.com"
 *       "userId": "XXXXX"
 *       "token": "XXXXXXXXXXXXXXXXXXXX"
 *     }
 */
module.exports.login = async function (req, res, next) {
    try {
        const {email, password} = req.body;

        if (!email || !password)
            throw 'MissingParameters';

        const findUser = await db.collection('users').where('email', '==', email).limit(1).get();
        if (findUser.empty)
            throw 'UserNotFound';

        // Getting data in the finded user
        const resUser = await findUser.docs[0].data();

        // deleting user password and sending it to the front
        delete resUser.password;

        res.status(200).send(resUser);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {delete} /authentification/delete Delete
 * @apiName Delete
 * @apiGroup Authentification
 * @apiDescription Delete a user in the app.
 * @apiVersion 0.0.1
 *
 * @apiParam {String} token User token.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "token": "XXXXXXXXXXXXXXXXXXXX",
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "UserDeleted"
 *     }
 */
module.exports.delete = async function (req, res, next) {
    try {
        const {token} = req.body;

        if (!token)
            throw 'MissingParameters';

        const findUser = await db.collection('users').where('token', '==', token).limit(1).get();
        if (findUser.empty)
            throw 'UserNotFound';

        // Deleting findedUser
        await findUser.docs[0].ref.delete();

        res.status(200).send({message: 'UserDeleted'});
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}

