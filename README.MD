Для запуска проекта требуется:

1. Пререквизиты: yarn (https://classic.yarnpkg.com/en/docs/install/#windows-stable) и dotnet sdk (https://dotnet.microsoft.com/download)

2. Запустить установку пакетов командой:
yarn install

3. Запустить parcel командой: 
./node_modules/.bin/parcel ./ClientApp/index.ts --out-dir=./wwwroot/dist

4. Запустить сервер командой:
dotnet run

5. Запустить отладку из VSCode с использованием конфигурации Browser Preview: Attach
