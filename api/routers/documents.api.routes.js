import express from 'express'
import * as DocumentsApiController from '../controllers/documents.api.controller.js'

const route = express.Router()

route.route('/api/documents')
    .get(DocumentsApiController.findDocumentsByUserID)
    .post(DocumentsApiController.createDoc)

route.route('/api/documents/:idDocument')
    .patch(DocumentsApiController.updateDoc)
    .delete(DocumentsApiController.deleteDoc)

export default route