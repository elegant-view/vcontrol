export function inArray(value, arr) {
    let ret = false;
    arr.find(item => {
        if (item === value) {
            ret = true;
            return true;
        }
    });
    return ret;
}
