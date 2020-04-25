export type Player = {
    id: string;
    name: string;
    controller: Controller;
}

export enum Controller {
    wasd = 1,
    arrows = 2,
    gamepad1 = 4,
    gamepad2 = 8
}