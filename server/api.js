// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const Image = require('./models/Image');
const Comment = require('./models/Comment');

const _imageListProjection = 'title userId likes nsfw link startDate stopDate';

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function (app, config) {
    // Authentication middleware
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
     | API Routes
     |--------------------------------------
     */

    // GET API root
    app.get('/api/', (req, res) => {
        res.send('API works');
    });

    // GET list of images considered safe for work
    app.get('/api/images', (req, res) => {
        Image.find({
            nsfw: false,
            stopDate: {
                $gte: new Date()
            }
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

     app.post('/api/image/new', jwtCheck, adminCheck, (req, res) => {
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
        startDate: req.body.startDate,
        stopDate: req.body.stopDate,
        description: req.body.description,
        likes: 0,
        nsfw: req.body.nsfw
      });
      image.save((err) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(image);
      });
    });
  });

    // PUT (edit) an existing image
  app.put('/api/image/:id', jwtCheck, adminCheck, (req, res) => {
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
      image.startDate = req.body.startDate;
      image.stopDate = req.body.stopDate;
      image.description = req.body.description;
      image.nsfw = req.body.nsfw;

      image.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(image);
      });
    });
  });

    // DELETE an image and all associated RSVPs
  app.delete('/api/image/:id', jwtCheck, adminCheck, (req, res) => {
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
          res.status(200).send({message: 'Image and commentss successfully deleted.'});
        });
      });
    });
  });

    // GET list of images the user has commented to
   app.get('/api/image/:userId', jwtCheck, (req, res) => {
    Comment.find({userId: req.params.userId}, 'imageId', (err, comments) => {
      const _imageIdsArr = comments.map(comment => comment.imageId);
//      const _commentImagesProjection = 'title startDate endDate';
      const _commentImagesProjection = 'title startDate';
      let imagesArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (comments) {
        Image.find(
          {_id: {$in: _imageIdsArr}},
//          {_id: {$in: _imageIdsArr}, startDate: { $gte: new Date() }},
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
    //app.get('/api/images/admin', (req, res) => {
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
    // app.get('/api/images/:id', jwtCheck, (req, res) => {
    app.get('/api/images/:id', (req, res) => {
        Image.findById(req.params.id, (err, image) => {
            if (err) {
                //console.log(' error 500 something')
                return res.status(500).send({
                    message: err.message
                });
            }
            if (!image) {
                //console.log(' error 400 something')
                return res.status(400).send({
                    message: 'Image not found.'
                });
            }
            res.send(image);
        });
    });

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
                imageId: req.body.imageId,
                comment: req.body.comment
            });
            comment.save((err) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message
                    });
                }
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
