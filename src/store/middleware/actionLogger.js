export default () => next => action => {
    if (__SERVER__) {
        console.log(require('cliff').inspect(action));
    } else if (__DEVELOPMENT__) {
        console.info(action);
    }

    return next(action);
};
