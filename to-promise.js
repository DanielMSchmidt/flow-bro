module.exports = function toPromise(fn, ...args) {
    return new Promise((resolve, reject) => {
        fn(...args, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            }

            resolve(stdout);
        });
    });
};
