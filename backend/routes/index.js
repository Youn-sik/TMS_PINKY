const Authorized_accessController = require('../controller/authorized_accessController')

const routes = [
    {
        method: 'GET',
        url: '/api/Authorized_accesss',
        handler: Authorized_accessController.getAuthorized_accesss
    },
    {
        method: 'GET',
        url: '/api/Authorized_accesss/:id',
        handler: Authorized_accessController.getSingleAuthorized_access
    },
    {
        method: 'POST',
        url: '/api/Authorized_accesss',
        handler: Authorized_accessController.addAuthorized_access
    },
    {
        method: 'PUT',
        url: '/api/Authorized_accesss/:id',
        handler: Authorized_accessController.updateAuthorized_access
    },
    {
        method: 'DELETE',
        url: '/api/Authorized_accesss/:id',
        handler: Authorized_accessController.deleteAuthorized_access
    }
]

module.exports = routes
