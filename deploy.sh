#!/bin/sh

#Backup old production folder
if [ -d ~/Website/wedding ]; then
    echo Backing up old wedding files...
    mv ~/Website/wedding/ ~/Website/wedding.old
    mkdir ~/Website/wedding
fi

#run gulp script
gulp dist

#create well-known acme challenge
echo Creating Acme Challenge folders
mkdir -p ./dist/.well-known/acme-challenge

#copy dist to deployment folder
echo Deploying dist to ~/Website/wedding
cp -r ./dist/* ~/Website/wedding

