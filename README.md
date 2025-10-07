# Smart Pharmacy Management System

## TODO

- http://localhost:4200/#/purchase 
- Show barcode issue
## Module

- Purchase
- Sale
- Return
- Inventory
- Damage
- Notification(Low quantity)
- Expiry Medicine

## Technology

- Angular
- Electron
- Lumen
- Mysql

## Setup for exe file

npm run start

npm run build

npm run package-win

npm run create-installer-win

## Development tools

- ng g m home/supplier --routing=true
- ng g c home/supplier


export NODE_OPTIONS=--openssl-legacy-provider

rm -rf dist node_modules/.cache
npm run build

## Command to create new module
ng g m home/master-report/sale-report-supplier --routing --module
ng g c home/master-report/sale-report-supplier --routing --module
