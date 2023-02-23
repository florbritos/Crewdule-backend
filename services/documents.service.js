import { MongoClient, ObjectId} from 'mongodb'

//const client = new MongoClient('mongodb://127.0.0.1:27017')
const client = new MongoClient('mongodb+srv://crewdule:35978540Fb@cluster0.ptdeusi.mongodb.net/test')
const documentsCollection = client.db('DB_CREWDULE').collection('Documents')


async function getAllDocuments(filter = {}){

    if(filter.idUser){
        filter = {user_id : ObjectId(filter.idUser)}
    }

    return client.connect()
    .then(async function(){
        return documentsCollection.find(filter).toArray()
    })
    .catch(function(err){
        return []
    })
}

async function getDocumentById(id){
    return client.connect()
    .then(function(){
        return documentsCollection.findOne({_id: new ObjectId(id)})
    })
}

async function saveNewDocument(document){

    const newDocument= {...document}

    return client.connect()
    .then(function(){
        return documentsCollection.insertOne(newDocument)
    })

}

async function updateDocument(id, document){

    const docToUpdate = {...document}
    return client.connect()
    .then(function(){
        return documentsCollection.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: docToUpdate
        })
    })
}

async function deleteDocument(id){

    await client.connect()
    const result = await documentsCollection.deleteOne({ _id: ObjectId(id) })

    if (result.deletedCount === 0) {
        throw new Error("The document doesn't exists")
    }
}

export {
    getAllDocuments,
    getDocumentById,
    saveNewDocument,
    updateDocument,
    deleteDocument
}