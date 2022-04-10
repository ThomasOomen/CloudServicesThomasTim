const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
const fs = require('fs');
let sendData = helpers.sendJsonXml;
const fs = require('fs');

exports.getTargets = (req, res) => {
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
        if(curItem == 'description' || curItem == 'name'){
            filter[curItem] = req.query[curItem];
        }
    }

    Target.find(filter,(err, Target) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        } else {
            const totalSize = Target.length;
            // get the limited results from the target collection
            Target = Target.slice(startingIndex, endingIndex);

            res.status(200).sendData(JSON.stringify({
                status: 'success',
                message: 'Target retrieved successfully',
                data: Target,
                totalSize: totalSize,
                pagination: {
                    "message": `The pagination is page ${page}, with max. ${limit} results on each page`,
                    "page": page,
                    "returnCount": Target.length,
                    "limit": limit,
                },
            }));
        }
    });
};

exports.newTarget = (req, res) => {
    if (req.body) {
        const target = new Target();
        const TargetObj = req.body;
        Object.keys(TargetObj).forEach((key) => {
            if (key != 'picture') {
                target[key] = TargetObj[key];
            } else {
                const fileList = [];
                const standardPath = 'images/';
                let path = '';

                // Create the images folder if it doesn't exist
                if (!fs.existsSync(standardPath)) {
                    fs.mkdirSync(standardPath);
                }

                // Create array of all foldernames
                fs.readdirSync('images/').forEach(file => {
                    fileList.push(parseInt(file));
                });

                if (fileList.length == 0) {
                    path = standardPath + 0;
                } else {
                    const highestNum = Math.max.apply(Math, fileList);
                    path = standardPath + (highestNum + 1);
                }
                fs.mkdirSync(path);

                let fullImagePath = path + "/original.png";
                fs.writeFile(fullImagePath, TargetObj[key], 'base64', function (err) {
                    if (err) { console.log(err) };
                });
                target[key] = fullImagePath;
            }
        });

        // save the Target and check for errors
        target.save((TargetError) => {
            if (TargetError) {
                res.status(400).json({
                    status: 'error',
                    error: TargetError,
                });
            }
            else {
                res.status(201).json({
                    message: 'New Target created!',
                    data: target,
                });
                //update the score in async when using the score from imagge
                const got = require('got');
                const FormData = require('form-data');

                const apiKey = process.env.APIKEY;
                const apiSecret = process.env.APISECRET;

                const filePath = target.picture;
                const formData = new FormData();
                formData.append('image', fs.createReadStream(filePath));

                (async () => {
                    try {
                        const response = await got.post('https://api.imagga.com/v2/tags', { body: formData, username: apiKey, password: apiSecret });
                        let score = JSON.parse(response.body);
                        Target.findByIdAndUpdate(
                            { _id: target._id },
                            { score: score['result']['tags'] },
                            function (err, result) {
                                console.log("score succesfully added to target")
                            }
                        )
                    } catch (error) {
                    }
                })();
            }
        });
    } else {
        res.status(400).json({
            status: 'error',
            error: "You need data to create a target",
        });
    }
};

exports.viewTarget = (req, res) => {
    Target.findById(req.params.target_id, (err, target) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'Target details loading..',
                data: target,
            }));
        }
    });
};

exports.updateTarget = (req, res) => {
    Target.findByIdAndUpdate(
        req.params.target_id,
        req.body,
        { new: true, runValidators: true },
        (err, target) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: err,
                });
            }
            else {
                res.status(200).sendData(JSON.stringify({
                    message: 'Target Info updated',
                    data: target,
                }));
            }
        },
    );
};

exports.deleteTarget = (req, res) => {
    Target.remove({ _id: req.params.target_id }, (err) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        res.status(200).sendData(JSON.stringify({
            status: 'success',
            message: 'Target deleted',
        }));
    });
};