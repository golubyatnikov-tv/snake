export function createInputManager() {
    const keys = {};

    const onKeyDown = (e: KeyboardEvent) => {
        keys[e.code] = true;
    }    

    window.addEventListener('keydown', onKeyDown)
    //window.addEventListener("gamepadconnected", onGamepadConnected);

    return {
        getPressedKeys() {
            return Object.keys(keys)
                .filter(key => {
                    return keys[key]
                })
        },

        reset() {
            Object.keys(keys)
                .forEach(key => delete keys[key])
        },

        dispose() {
            window.removeEventListener('keydown', onKeyDown);
            //window.removeEventListener('gamepadconnected', onGamepadConnected);
        }
    }
}

export type InputManager = ReturnType<typeof createInputManager>