var express = require('express')
var app = express()
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'User List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        name: '',
        lastname: '',        
        email: '',
        ext_id: '',
        ext_auth_sys: ''
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()           //Validate lastname    
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('ext_id', 'A valid external id is required').notEmpty()  //Validate email
    req.assert('ext_auth_sys', 'A valid external system is required').notEmpty()  //Validate email

 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),            
            email: req.sanitize('email').escape().trim(),
            ext_id: req.sanitize('ext_id').escape().trim(),
            ext_auth_sys: req.sanitize('ext_auth_sys').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        name: user.name,
                        lastname: user.lastname,                        
                        email: user.email,
                        ext_id: user.ext_id,
                        ext_auth_sys: user.ext_auth_sys                    
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        name: '',
                        lastname: '',
                        email: '',
                        ext_id: '',
                        ext_auth_sys: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/add', { 
            title: 'Add New User',
            name: req.body.name,
            lastname: req.body.lastname,            
            email: req.body.email,
            ext_id: req.body.ext_id,
            ext_auth_sys: req.body.ext_auth_sys
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User', 
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    email: rows[0].email,
                    ext_id: rows[0].ext_id,
                    ext_auth_sys: rows[0].ext_auth_sys             
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()           //Validate lastname   
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('ext_id', 'A valid external id is required').notEmpty()  //Validate email
    req.assert('ext_auth_sys', 'A valid external system is required').notEmpty()  //Validate email

 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            ext_id: req.sanitize('ext_id').escape().trim(),
            ext_auth_sys: req.sanitize('ext_auth_sys').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        ext_id: req.body.ext_id,
                        ext_auth_sys: req.body.ext_auth_sys
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        ext_id: req.body.ext_id,
                        ext_auth_sys: req.body.ext_auth_sys
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/edit', { 
            title: 'Edit User',            
            id: req.params.id, 
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            ext_id: req.body.ext_id,
            ext_auth_sys: req.body.ext_auth_sys
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/users')
            }
        })
    })
})
 
module.exports = app