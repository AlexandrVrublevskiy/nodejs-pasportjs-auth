var usersList = [
    { id: 1, username: 'test', password: 'test'}
  , { id: 2, username: 'john', password: 'test123'}
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (usersList[idx]) {
      cb(null, usersList[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = usersList.length; i < len; i++) {
      var record = usersList[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
