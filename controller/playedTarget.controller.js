const PlayedTarget = require("../models/playedTarget.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
const fs = require('fs');
let sendData = helpers.sendJsonXml;

exports.getPlayedTargets = (req, res) => {
    let page = 0;
    if (req.query.page) {
        page = parseInt(req.query.page);
    };
    const limit = 2;
    let startingIndex = page;
    let endingIndex = startingIndex + limit;

    //Create filter if query has valid filter-options
    let queryItems = (Object.keys(req.query));
    let filter = {};
    for(let i =0; i < queryItems.length; i++){
        const curItem = queryItems[i];
        //check for valid filters
        if(curItem == 'scorePercentage' || curItem == 'completed'){
            filter[curItem] = req.query[curItem];
        }
    }

    PlayedTarget.find(filter,(err, PlayedTarget) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        } else {
            const totalSize = PlayedTarget.length;
            // get the limited results from the target collection
            PlayedTarget = PlayedTarget.slice(startingIndex, endingIndex);

            res.status(200).sendData(JSON.stringify({
                status: 'success',
                message: 'PlayedTarget retrieved successfully',
                data: PlayedTarget,
                totalSize: totalSize,
                pagination: {
                    "message": `The pagination is page ${page}, with max. ${limit} results on each page`,
                    "page": page,
                    "returnCount": PlayedTarget.length,
                    "limit": limit,
                },
            }));
        }
    });
};

exports.newPlayedTarget = (req, res) => {
    const playedTarget = new PlayedTarget();
    const PlayedTargetObj = req.body;

    Object.keys(PlayedTargetObj).forEach((key) => {
        if (key != 'picture') {
            playedTarget[key] = PlayedTargetObj[key];
        } else {
            playedTarget[key] = 'temp';
        }
    });
    //get the original image to check if it is the exact same as the uploaded one
    Target.findById(PlayedTargetObj.target, (err, targetObj) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: TargetError,
            });
        }
        else {
            fs.readFileSync(targetObj.picture)
            contents = fs.readFileSync(targetObj.picture, { encoding: 'base64' });

            //check if the image is the exact same
            if (contents == PlayedTargetObj['picture']) {
                res.status(406).json({
                    status: 'error',
                    error: "The image is the exact same as the original, this is not allowed!",
                });
            }
            else {
                // save the Target and check for errors
                playedTarget.save((TargetError) => {
                    if (TargetError) {
                        res.status(400).json({
                            status: 'error',
                            error: TargetError,
                        });
                    }
                    else {
                        //get the original leader target to know which folder the image is stored
                        Target.findById(playedTarget.target, (err, target) => {
                            if (err) {
                                res.status(400).json({
                                    status: 'error',
                                    error: err,
                                });
                            }
                            else {
                                // append the image to the folder of the original target
                                // let originalPicturePath = target.picture.split('/o')[0];
                                // let fullImagePath = originalPicturePath + "/" + playedTarget._id + '.png';
                                // fs.writeFile(fullImagePath, PlayedTargetObj['picture'], 'base64', function (err) {
                                //     if (err) { console.log(err) };
                                // });
                                //update the picture path in database to a real picture path
                                playedTarget['picture'] = fullImagePath;
                                playedTarget.save((TargetError) => {
                                    if (TargetError) {
                                        res.status(400).json({
                                            status: 'error',
                                            error: TargetError,
                                        });
                                    } else {
                                        res.status(201).json({
                                            message: 'New PlayedTarget created!',
                                            data: playedTarget,
                                        });
                                        //update the score in async when using the score from imagge
                                        const got = require('got');
                                        const FormData = require('form-data');

                                        const apiKey = process.env.APIKEY;
                                        const apiSecret = process.env.APISECRET;

                                        const filePath = playedTarget.picture;
                                        const formData = new FormData();
                                        formData.append('image', fs.createReadStream(filePath));

                                        (async () => {
                                            try {
                                                const response = await got.post('https://api.imagga.com/v2/tags', { body: formData, username: apiKey, password: apiSecret });
                                                let score = JSON.parse(response.body)['result']['tags'];
                                                Target.findById(playedTarget.target, (err, target) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        // calculate the score of the picture
                                                        let playedTargetScore = score
                                                        let targetScore = target.score;
                                                        let compareScoreTarget = [];
                                                        const minimalConfidence = 20;

                                                        for (let i = 0; i < targetScore.length; i++) {
                                                            if (targetScore[i]['confidence'] > minimalConfidence)
                                                                compareScoreTarget[targetScore[i]['tag']['en']] = targetScore[i]['confidence'];
                                                        }
                                                        let compareScorePlayedTarget = [];
                                                        for (let i = 0; i < playedTargetScore.length; i++) {
                                                            if (playedTargetScore[i]['confidence'] > minimalConfidence)
                                                                compareScorePlayedTarget[playedTargetScore[i]['tag']['en']] = playedTargetScore[i]['confidence'];
                                                        }

                                                        const allowedScoreOffset = 15;
                                                        let scoredKeys = [];
                                                        Object.keys(compareScorePlayedTarget).forEach((key) => {
                                                            if (key in compareScoreTarget) {
                                                                let currentTargetScore = compareScoreTarget[key];
                                                                let currentPlayedScore = compareScorePlayedTarget[key];
                                                                if (currentPlayedScore >= (currentTargetScore - allowedScoreOffset) && currentPlayedScore <= (currentTargetScore + allowedScoreOffset)) {
                                                                    scoredKeys.push(key);
                                                                }
                                                            }
                                                        });
                                                        targetKeys = Object.keys(compareScoreTarget)
                                                        let scorePercentage = Math.round((scoredKeys.length / targetKeys.length) * 100);
                                                        const isCompleted = (scorePercentage > 80);
                                                        PlayedTarget.findByIdAndUpdate(
                                                            { _id: playedTarget._id },
                                                            { $set: { score: score, scorePercentage: scorePercentage, completed: isCompleted } },
                                                            function (err, result) {
                                                                console.log("score succesfully added to target")
                                                            }
                                                        );
                                                    }
                                                });
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        })();
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })


}

exports.viewPlayedTarget = (req, res) => {
    PlayedTarget.findById(req.params.playedTarget_id, (err, playedTarget) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'PlayedTarget details loading..',
                data: playedTarget,
            }));
        }
    });
};

exports.updatePlayedTarget = (req, res) => {
    PlayedTarget.findByIdAndUpdate(
        req.params.playedTarget_id,
        req.body,
        { new: true, runValidators: true },
        (err, playedTarget) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: err,
                });
            }
            else {
                res.status(200).sendData(JSON.stringify({
                    message: 'PlayedTarget Info updated',
                    data: playedTarget,
                }));
            }
        },
    );
};

exports.deletePlayedTarget = (req, res) => {
    PlayedTarget.remove({ _id: req.params.playedTarget_id }, (err) => {
        if (err) {
          res.status(400).json({
            status: 'error',
            error: err,
          });
        }
        res.status(200).sendData(JSON.stringify({
          status: 'success',
          message: 'PlayedTarget deleted',
        }));
      });
};


