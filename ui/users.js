//
//
function ciniki_sysadmin_users() {
    this.users = null;

    //
    // Create the new panel
    //
    this.users = new M.panel('Sys Admins', 'ciniki_sysadmin_users', 'users', 'mc', 'medium', 'sectioned', 'ciniki.sysadmin.users');
    this.users.sections = {'_':{'label':'', 'list':{}}};
    this.users.sectionData = function(s) { return this.data; }

    this.users.listValue = function(s, i, d) { return d.user.firstname + ' ' + d.user.lastname; }
    this.users.listFn = function(s, i, d) { return 'M.startApp(\'ciniki.sysadmin.user\',null,\'M.ciniki_sysadmin_users.users.open();\',\'mc\',{\'id\':\'' + d.user.id + '\'});'; }
    this.users.noData = function() { return 'ERROR - No users'; }
    this.users.open = function(cb) {
        //
        // Get the detail for the user.  Do this for each request, to make sure
        // we have the current data.  If the user switches tenants, then we
        // want this data reloaded.
        //
        M.api.getJSONCb('ciniki.users.getSysAdmins', {}, function(rsp) {
            if( rsp.stat != 'ok' ) {
                M.api.err(rsp);
                return false;
            }
            var p = M.ciniki_sysadmin_users.users;
            p.data = rsp.users;
            p.refresh();
            p.show(cb);
        });
    }
    this.users.addButton('add', 'Add', 'M.startModalApp(\'ciniki.users.add\', null, \'M.ciniki_sysadmin_users.add(data);\');');
    this.users.addClose('Back');

    this.start = function(cb, appPrefix) {
        //
        // Create the app container if it doesn't exist, and clear it out
        // if it does exist.
        //
        var appContainer = M.createContainer(appPrefix, 'ciniki_sysadmin_users', 'yes');
        if( appContainer == null ) {
            M.alert('App Error');
            return false;
        } 

        this.users.open(cb);
    }

    // 
    // add a user a sysadmin
    //
    this.add = function(data) {
        var userID = 0;
        if( data != null && data.id != null ) {
            userID = data.id;
        }

        // FIXME: Add field for password, can only modify with password
        if( userID > 0 ) {
            M.api.getJSONCb('ciniki.users.addSysAdmin', {'user_id':userID}, function(rsp) {
                if( rsp.stat != 'ok' ) {
                    M.api.err(rsp);
                    return false;
                }
                M.ciniki_sysadmin_users.showUsers();
            });
        }
    }
}
