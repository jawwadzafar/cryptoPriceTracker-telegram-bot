const doa = require('./doa');

let setPercentage = function (per) {
    let percentage = parseFloat(per);
    return new Promise((resolve, reject) => {
        if (!percentage) return reject('Wrong Tolerance Input');
        if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) return reject('Enter a number under 100');
        doa.count({})
            .then(count => {
                if (count) {
                    doa.findOne({}).then(data => {
                        doa.update({
                                _id: data._id
                            }, {
                                percentage: percentage
                            })
                            .then(data => {
                                return resolve('Tolerance Percentage Set : '+percentage);
                            })
                    })
                } else {

                    doa.create({
                            percentage: percentage
                        })
                        .then(data => {
                            return resolve('Tolerance Percentage Set : '+percentage);
                        })
                        .catch(err => {

                            return resolve('Well, Something Went Wrong');
                        })
                }
            })

    })
}
let getPercentage = function () {
    return new Promise((resolve, reject) => {
        doa.findOne({}).then(doc => {
            if (!doc) return 5;
            return resolve(doc.percentage);
        })
    })
}

module.exports = {
    getPercentage,
    setPercentage
}