export function createKeyboardManager() {
    const keys = {};

    window.addEventListener('keydown', e => {
        keys[e.key] = true;
    })

    return {
        getPressedKeys() {
            return Object.keys(keys)                
                .filter(key=>keys[key])                
        },

        clear() {
            Object.keys(keys)
                .forEach(key=>keys[key] = false)
        }
    }
}