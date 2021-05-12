// Dependency
var fs = require('fs');
var path = require('path');

storage = {};

storage.baseDir = path.join(__dirname, '/../.data/');

/**
 * creates the file in the data directory
 * @param {*} dir directory to store file
 * @param {*} file filename in which store data
 * @param {*} data data to store
 * @param {*} callback callback
 */
storage.create = (dir, file, data, callback) => {
    fs.open(storage.baseDir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);     
                        } else {
                            callback('Error while closing the file!');
                        }
                    });                    
                } else {
                    callback('Error while writing the data!');
                }
            });
        } else {
            callback('Error while creating new file!');
        }
    });
};

/**
 * reads the data from file
 * @param {*} dir 
 * @param {*} file 
 * @param {*} callback 
 */
storage.read = (dir, file, callback) => {
    fs.readFile(storage.baseDir+dir+'/'+file+'.json', 'utf8', (err, data) => {
        callback(err, data);
    });
};

/**
 * update the file data
 * @param {*} dir 
 * @param {*} file 
 * @param {*} data 
 * @param {*} callback 
 */
storage.update = (dir, file, data, callback) => {
    fs.open(storage.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);     
                                } else {
                                    callback('Error while closing the file!');
                                }
                            });                    
                        } else {
                            callback('Error while writing the data!');
                        }
                    });
                } else {
                    callback('Error while truncate file.');
                }
            });
        } else {
            callback('Error while Updating new file!');
        }
    });
};

/**
 * delete the data file
 * @param {*} dir 
 * @param {*} file 
 * @param {*} callback 
 */
storage.delete = (dir, file, callback) => {
    fs.unlink(storage.baseDir+dir+'/'+file+'.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error while deleting file.');
        }
    });
};

module.exports = storage;