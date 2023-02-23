import * as DocumentsService from '../../services/documents.service.js'
import * as UserService from '../../services/users.service.js'
import moment from 'moment'

function findDocumentsByUserID(req, res) {
    const filter = req.query
    DocumentsService.getAllDocuments(filter)
    .then(function (allDocuments){
        res.status(200).json(allDocuments)
    })
}

function createDoc(req, res){

    const idUser = req.body.user_id

    UserService.findById(idUser)
    .then(function(user){
        const newDoc = {
            user_id: user._id,
            documentType: req.body.documentType,
            documentID: req.body.documentID,
            name:req.body.name,
            country: req.body.country,
            issuanceDate: req.body.issuanceDate,
            expiryDate: req.body.expiryDate,
            rating: req.body.rating, 
            comments: req.body.comments,
        }

        const validation = fieldValidation(newDoc)

        if(Object.entries(validation).length == 0){
            DocumentsService.saveNewDocument(newDoc)
            .then(function(newDocument){
                res.status(201).json({message: 'Document created'})
            })
            .catch(function(err){
                res.status(500).json(err)
            })
        }else {
            res.status(400).json({message: 'Validation failed', errors: validation})
        }
    })
    .catch(function(err){
        res.status(404).json({message: 'User was not found'})
    })
}

function updateDoc(req, res){
    const idDoc = req.params.idDocument

    DocumentsService.getDocumentById(idDoc)
    .then(function(document){
        let doc = {}

        if(req.body.hasOwnProperty('documentType')){
            doc.documentType = req.body.documentType
        }
        if(req.body.hasOwnProperty('documentID')){
            doc.documentID = req.body.documentID
        }
        if(req.body.hasOwnProperty('name')){
            doc.name = req.body.name
        }
        if(req.body.hasOwnProperty('country')){
            doc.country = req.body.country
        }
        if(req.body.hasOwnProperty('issuanceDate')){
            doc.issuanceDate = req.body.issuanceDate
        }
        if(req.body.hasOwnProperty('expiryDate')){
            doc.expiryDate = req.body.expiryDate
        }
        if(req.body.hasOwnProperty('rating')){
            doc.rating = req.body.rating
        }
        if(req.body.hasOwnProperty('comments')){
            doc.comments = req.body.comments
        }

        let docForFieldValidation = {...document}

        for(let field in doc){
            docForFieldValidation[field] = doc[field]
        }

        const validation = fieldValidation(docForFieldValidation)

        if(Object.entries(validation).length == 0){
            DocumentsService.updateDocument(document._id, doc)
            .then(function(documentUpdated){
                res.status(201).json({message: 'Document updated'})
            })
            .catch(function(err){
                res.status(500).json(err)
            })
        }else {
            res.status(400).json({message: 'Validation failed', errors: validation})
        }
    })
    .catch(err => {
        res.status(404).json({message: 'Document was not found'})
    })
}

function deleteDoc(req, res){
    const idDoc = req.params.idDocument

    DocumentsService.deleteDocument(idDoc)
    .then(function(){
        res.status(200).json({ message: 'Document deleted' })
    })
    .catch(err=>{
        res.status(404).json({ message: err.message })
    })
}

function fieldValidation(data){

    let error = {}

    for (let field in data){
        switch (field) {
            case 'documentType':
                if(data[field] == '' || data[field] === null){
                    error.documentType = 'Document Type must be set.'
                }
                break;
            case 'expiryDate':
                if(data[field] == null || data[field] == ""){
                    error.expiryDate = 'Expiry Date must be set.'
                    
                } else if(!(data.issuanceDate == "" || data.issuanceDate == null) && moment(data[field]).format('YYYYMMDD') < moment(data.issuanceDate).format('YYYYMMDD')){
                    error.expiryDate = 'Expiry Date must be later than the date of issue.'
                    error.issuanceDate = 'Date of Issue must be prior than the expiry date.'
                }
                break;
            
            case 'issuanceDate':
                if(!(data.issuanceDate == '' || data.issuanceDate == null) && !(data.expiryDate == "" || data.expiryDate == null) && moment(data[field]).format('YYYYMMDD') > moment(data.expiryDate).format('YYYYMMDD') && data[field] !== ''){
                    error.issuanceDate = 'Date of Issue must be prior than the expiry date.'
                    error.expiryDate = 'Expiry Date must be later than the date of issue.'
                }
                break;
        
            default:
                break;
        }
    }

    return error
}

export {
    findDocumentsByUserID,
    createDoc,
    updateDoc,
    deleteDoc
}