const delayAsync = async (durationMs) => {
    await new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, durationMs);
    });
};

module.exports = delayAsync;