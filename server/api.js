// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require('request');

const ManagementClient = require('auth0').ManagementClient;
const cloudinary = require('cloudinary');
const stream = require('getstream');

const User = require('./models/User');
const Image = require('./models/Image');
const Comment = require('./models/Comment');

const _imageListProjection = 'title userId likes online link createDate editDate';



module.exports = function (app, config) {


/*
 |--------------------------------------
 | Stream Middleware
 |--------------------------------------
 */
    streamClient = stream.connect(
        config.STREAM_API_KEY,
        config.STREAM_API_SECRET,
        config.STREAM_API_ID);
/*
 |--------------------------------------
 | Cloudinary Middleware
 |--------------------------------------
 */
    cloudinary.config({
          cloud_name: config.CLOUD_NAME,
          api_key: config.CLOUD_API_KEY,
          api_secret: config.CLOUD_API_SECRET
    });
 /*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */
    // define management interface for auth0 api
    const auth0 = new ManagementClient({
      domain: config.AUTH0_DOMAIN,
      clientId: config.AUTH0_CLIENT_ID,
      clientSecret: config.AUTH0_CLIENT_SECRET,
      scope: 'read:users update:users read:user_idp_tokens'
    });
    // Authentication middleware. validate json web tokens
    const jwtCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
        }),
        audience: config.AUTH0_API_AUDIENCE,
        issuer: `https://${config.AUTH0_DOMAIN}/`,
        algorithm: 'RS256'
    });
    // Check for an authenticated admin user
    const adminCheck = (req, res, next) => {
        const roles = req.user[config.NAMESPACE] || [];
        if (roles.indexOf('admin') > -1) {
            next();
        } else {
            console.log('Not an admin user');
            res.status(401).send({
                message: 'Not authorized for admin access'
            });
        };
    };
    /*
     |--------------------------------------
     | Stream API Routes
     |--------------------------------------
     */
    // GET specific stream
    app.get('/api/stream/:group/:name', jwtCheck, (req, res) => {
        const feed = streamClient.feed (req.params.group,req.params.name);
        feed.get({ limit: 50 }).then(function(results) {
            var activityData = results.results; // work with the feed activities
            console.log(activityData);
            res.send(activityData);
        },function(err) {
            // Handle or raise the Error.
            console.log(err);
            return res.status(500).send({message: err.message});
        });
    });
    /*
     |--------------------------------------
     | AUTH0 API Routes
     |--------------------------------------
     */

    // GET user name of auth0 user.
    app.get('/api/user/name/:id', jwtCheck,(req, res) => {
        auth0.users.get({id: req.params.id},function (err, users) {
            if (err) {
                console.log(err);
                return res.status(500).send({message: err.message});
            }
            const username = JSON.stringify(users.name);
            res.send(username);
        });
    });

    // GET user identity of auth0 user.
    app.get('/api/user/identity/:id',jwtCheck,(req, res) => {
        auth0.users.get({id: req.params.id},function (err, users) {
            if (err) {
                console.log(err);
                return res.status(500).send({message: err.message});
            }
            console.log(users);
            res.send(users);
        });
    });

    // GET API root
    app.get('/api/', (req, res) => {
        res.send('API works');
    });
        /*
     |--------------------------------------
     | User API Routes
     |--------------------------------------
     */

    // get user information
    app.get('/api/user/:id', jwtCheck, (req, res) => {
        User.find({
            userId: req.params.id
        }, (err, user) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!user[0]) {
                const user = new User({
                    userId: req.params.id,
                    screenName: "Someone",
                    avatar: "avatars/katyev.png",
                    primaryRole: "Collector",
                    location: "Unkown",
                    createDate: Date.now(),
                    description: "Nothing here yet"
                });
                user.save((err) => {
                    if (err) {
                        return res.status(500).send({message: err.message});
                    }
                    res.send(user);
                });
            }else{
                res.send(user);
            }
        });
    });

    // edit existing user information
    app.put('/api/user/:id', jwtCheck, (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!user) {
                return res.status(400).send({message: 'No such user found.'});
            }
            user.screenName = req.body.screenName;
            user.avatar = req.body.avatar;
            user.primaryRole = req.body.primaryRole,
            user.location = req.body.location;
            user.description = req.body.description;
            user.save(err => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(user);
            });
        });
    });

    // store initial user information
    app.post('/api/user/new', jwtCheck, (req, res) => {
        User.findOne({
            userId: req.body.userId}, (err, existingUser) => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                if (existingImage) {
                    return res.status(409).send({message: 'You have already created an user with this ID.'});
                }
                const user = new User({
                      userId: req.body.userId,
                      screenName: req.body.name,
                      avatar: "avatars/katyev.png",
                      primaryRole: "Collector",
                      location: "Unkown",
                      createDate: Date.now(),
                      description: "Nothing here yet"
                });
                image.save((err) => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(user);
            });
        });
    });
        /*
     |--------------------------------------
     | Image API Routes
     |--------------------------------------
     */
    // GET list of images marked as online
    app.get('/api/images', (req, res) => {
        Image.find({
            online: true
        }, _imageListProjection, (err, images) => {
            let imagesArr = [];
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (images) {
                images.forEach(image => {
                    imagesArr.push(image);
                });
            }
            res.send(imagesArr);
        });
    });

    // put a new image into database
    app.post('/api/image/new', jwtCheck, (req, res) => {
    Image.findOne({
      link: req.body.link}, (err, existingImage) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingImage) {
        return res.status(409).send({message: 'You have already created an image with link.'});
      }
      const image = new Image({
        title: req.body.title,
        link: req.body.link,
        location: req.body.location,
        userId: req.user.sub,
        createDate: req.body.createDate,
        editDate: req.body.editDate,
        description: req.body.description,
        likes: 0,
        online: req.body.online
      });
      image.save((err) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }

        var actor = req.user.sub.replace('|','_');
        //add activity to stream
        const feed = streamClient.feed ('user',actor);

        feed.addActivity({
            actor: actor,
            verb: 'add',
            object: `picture:${image._id}`,
            foreign_id: image._id
        }).then(
            null, // nothing further to do
            function(err) {
                // Handle or raise the Error.
                console.log(err);
                return res.status(500).send({message: err.message});
        });
        res.send(image);
      });
    });
  });

    // PUT (edit) an existing image
    app.put('/api/image/:id', jwtCheck, (req, res) => {
    Image.findById(req.params.id, (err, image) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!image) {
        return res.status(400).send({message: 'Image not found.'});
      }
      image.title = req.body.title;
      image.link = req.body.link;
      image.location = req.body.location,
      image.createDate = req.body.createDate;
      image.editDate = req.body.editDate;
      image.description = req.body.description;
      image.online = req.body.online;

      image.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(image);
      });
    });
  });

    // DELETE an image and all associated RSVPs
    app.delete('/api/image/:id', jwtCheck, (req, res) => {
        Image.findById(req.params.id, (err, image) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!image) {
                return res.status(400).send({message: 'Image not found.'});
            }
            Comment.find({imageId: req.params.id}, (err, comments) => {
                if (comments) {
                    comments.forEach(comment => {
                        comment.remove();
                    });
                }
                image.remove(err => {
                    if (err) {
                        return res.status(500).send({message: err.message});
                    }
                    cloudinary.v2.api.delete_resources(image.link, function(error, result){
                        console.log(result);
                    });
                    res.status(200).send({message: 'Image and comments successfully deleted.'});
                });
            });
        });
    });

    // GET list of images the user has commented to
    app.get('/api/image/:userId', jwtCheck, (req, res) => {
        Comment.find({userId: req.params.userId}, 'imageId', (err, comments) => {
            const _imageIdsArr = comments.map(comment => comment.imageId);
            //      const _commentImagesProjection = 'title createDate endDate';
            const _commentImagesProjection = 'title createDate link';
            let imagesArr = [];
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (comments) {
                Image.find(
                    {_id: {$in: _imageIdsArr}},
                    //          {_id: {$in: _imageIdsArr}, createDate: { $gte: new Date() }},
                    _commentImagesProjection, (err, images) => {
                    if (err) {
                        return res.status(500).send({message: err.message});
                    }
                    if (images) {
                        images.forEach(image => {
                            imagesArr.push(image);
                        });
                    }
                    res.send(imagesArr);
                });
            }
        });
    });

    // GET all images
    app.get('/api/images/admin', jwtCheck, adminCheck, (req, res) => {
        Image.find({}, _imageListProjection, (err, images) => {
            let imagesArr = [];
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (images) {
                images.forEach(image => {
                    imagesArr.push(image);
                });
            }
            res.send(imagesArr);
        });
    });

    // GET image by image ID
    app.get('/api/images/:id', jwtCheck, (req, res) => {
        Image.findById(req.params.id, (err, image) => {
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (!image) {
                return res.status(400).send({
                    message: 'Image not found.'
                });
            }
            res.send(image);
        });
    });

     // GET list of images that belong to specific user
    app.get('/api/images/user/:userId', jwtCheck, (req, res) => {
        Image.find({
            userId: req.params.userId
        }, (err, images) => {
            let imagesArr = [];
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (images) {
                images.forEach(image => {
                imagesArr.push(image);
                });
            }
            res.send(imagesArr);
        });
    });

    /*
     |--------------------------------------
     | Comment API Routes
     |--------------------------------------
     */
    // GET comments by image ID
    app.get('/api/images/:imageId/comments', jwtCheck, (req, res) => {
        Comment.find({
            imageId: req.params.imageId
        }, (err, comments) => {
            let commentsArr = [];
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (comments) {
                comments.forEach(comment => {
                commentsArr.push(comment);
                });
            }
            res.send(commentsArr);
        });
    });

    // POST a new Comment
    app.post('/api/comment/new', jwtCheck, (req, res) => {
        Comment.findOne({
            imageId: req.body.imageId,
            userId: req.body.userId
        }, (err, existingComment) => {
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            if (existingComment) {
                return res.status(409).send({
                    message: 'You have already opinionated to this image.'
                });
            }
            const comment = new Comment({
                userId: req.body.userId,
                userId: req.user.sub,
                imageId: req.body.imageId,
                comment: req.body.comment
            });
            comment.save((err) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message
                    });
                }
                    var actor = req.user.sub.replace('|','_');
                    //add activity to stream
                    const feed = streamClient.feed ('user',actor);
                    feed.addActivity({
                        actor: actor,
                        verb: 'comment',
                        object: `picture:${comment.imageId}`,
                        foreign_id: comment._id
                    }).then(
                        null, // nothing further to do
                        function(err) {
                        // Handle or raise the Error.
                        console.log(err);
                        return res.status(500).send({message: err.message});
                    });
                res.send(comment);
            });
        });
    });

    // PUT (edit) an existing comment
    app.put('/api/comment/:id', jwtCheck, (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!comment) {
        return res.status(400).send({message: 'Opinion not found.'});
      }
      if (comment.userId !== req.user.sub) {
        return res.status(401).send({message: 'You cannot edit someone else\'s opinion.'});
      }
      comment.comment = req.body.comment;

      comment.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(comment);
      });
    });
  });
};
