export function createInputManager() {
    const keys = {};

    window.addEventListener('keydown', e => {
        keys[e.code] = true;
    })

    return {
        getPressedKeys() {
            return Object.keys(keys)                
                .filter(key=>keys[key])                
        },

        reset() {
            Object.keys(keys)
                .forEach(key=>delete keys[key])
        }
    }
}

export type InputManager = ReturnType<typeof createInputManager>