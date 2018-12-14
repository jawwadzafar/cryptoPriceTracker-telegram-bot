const doa = require('./doa');

let setDuration = function(req,res){
    console.log(req.body)
    if(!req.body.duration) return handler.sendError(res,400,'Duration not found');
    doa.count({})
    .then(count=>{

        if(count){
            duration.findOne({}).then(data=>{
                duration.update({_id:data._id},{repeat:parseInt(req.body.duration)}).then(data=>{
                    return handler.sendRes(res,'duration updated');
                })
            })
        }else{
            if(typeof req.body.duration !== 'number' || req.body.duration <= 0) return handler.sendError(res,400,'Enter a number greater than 0');
            duration.create({repeat:parseInt(req.body.duration)})
            .then(data=>{
                return handler.sendRes(res,'duration set')
            })
            .catch(err=>{
                return handler.sendError(res,400,'Something went wrong');
            });
        }


    })
}

let setRepeat = (repeatDuration)=>{
    return new Promise ((resolve,reject)=>{
        if(!repeatDuration) return reject('repeat time not found');
        doa.count({})
        .then(count=>{
    
            if(count){
                doa.findOne({}).then(data=>{
                    doa.update({_id:data._id},{repeat:parseInt(repeatDuration)})
                    .then(data=>{
                        return resolve(`repeat duration updated : ${repeatDuration} (mins)`);
                    })
                })
            }else{
                if(typeof repeatDuration !== 'number' || parseInt(repeatDuration) <= 0) return reject('Enter a number greater than 0');
                doa.create({repeat:parseInt(repeatDuration)})
                .then(data=>{
                    return resolve(`repeat duration set : ${repeatDuration} (mins)`)
                })
                .catch(err=>{
                    return reject('cannot set repeat duration at this moement');
                });
            }
    
    
        })
    })

}

module.exports = {
    setDuration,
    setRepeat
}