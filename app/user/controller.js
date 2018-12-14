const user = require('./doa');

let save = (data)=>{
    return new Promise((resolve,reject)=>{
        user.findOne({id:data.id}).then(doc=>{
            if(doc){
                user.update({id:data.id},{chatId:data.chatId,isActive:true})
                .then(data=>{
                    return resolve();
                })
            }else{
                user.create(data)
                .then(data=>{
                    return resolve();
                })
                .catch(err=>{
                    return reject(err);
                });
            }
    
        })
    })
}
let setInactive = (chatId) =>{
    return new Promise((resolve,reject)=>{
        user.update({chatId:chatId},{isActive:false}).then(resolve());
    })
}

let getChatId =()=>{
    return new Promise ((resolve,reject)=>{
        user.find({isActive:true,isAuthorised:true}).then(users=>{
            resolve(users.map(e=>e.chatId));
        }).catch(e=>{
            resolve([]);
        })


    })
}
let isAuthorised = (chatId)=>{
    return new Promise ((resolve,reject)=>{
        user.findOne({chatId:chatId,isAuthorised:true})
        .then(doc=>{
            return resolve(doc);
        })
    })
}

module.exports = {
    save,
    setInactive,
    getChatId,
    isAuthorised 
}